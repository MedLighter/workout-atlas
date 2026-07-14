import { z } from 'zod';
import type {
  ImportValidationResult,
  ProgramImportDocument,
  WorkoutImportDocument,
  WorkoutTemplateDocument,
} from './import.types';

const mediaAssetSchema = z.object({
  id: z.string().optional(),
  role: z
    .enum([
      'thumbnail',
      'exercise_demo',
      'muscle_map',
      'equipment',
      'technique',
      'cover',
      'fallback',
    ])
    .optional()
    .default('exercise_demo'),
  format: z.enum(['svg', 'lottie', 'webp', 'png', 'jpg', 'gif']),
  url: z.string().url(),
  alt: z.string().optional().default(''),
  priority: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  theme: z.enum(['dark', 'light', 'any']).optional(),
});

const importSetSchema = z.object({
  type: z
    .enum(['warmup', 'working', 'drop', 'amrap', 'failure', 'backoff'])
    .optional()
    .default('working'),
  weight: z.number().optional(),
  reps: z.number().optional(),
  rpe: z.number().min(1).max(10).optional(),
  notes: z.string().optional(),
});

const importExerciseSchema = z.object({
  name: z.string().min(1),
  muscleGroups: z.array(z.string()).optional(),
  equipment: z.array(z.string()).optional(),
  restSec: z.number().optional(),
  notes: z.string().optional(),
  techniqueTips: z.array(z.string()).optional(),
  safetyNotes: z.array(z.string()).optional(),
  images: z.array(mediaAssetSchema).optional(),
  sets: z.array(importSetSchema).optional().default([]),
});

const progressionPlanSchema = z.object({
  enabled: z.boolean().default(true),
  mode: z.enum(['linear', 'rpe']).default('linear'),
  weightIncrementKg: z.number().positive().optional(),
  weightIncrementLb: z.number().positive().optional(),
  targetRpe: z.number().min(1).max(10).optional(),
  cadence: z
    .enum(['every_session', 'weekly', 'biweekly', 'every_n_sessions'])
    .default('every_session'),
  cadenceEverySessions: z.number().int().min(2).max(12).optional(),
});

const scheduleDaySchema = z.object({
  weekday: z.number().int().min(0).max(6),
  type: z.enum(['workout', 'rest']),
  workoutTitle: z.string().min(1).optional(),
});

const workoutDefinitionSchema = z.object({
  title: z.string().min(1),
  goal: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedDurationMin: z.number().optional(),
  exercises: z.array(importExerciseSchema).min(1),
});

const templateImportSchema = z.object({
  protocolVersion: z.enum(['1.0', '1.1']),
  documentType: z.enum(['workout_template', 'workout_session']),
  title: z.string().min(1),
  language: z.string().optional(),
  unit: z.enum(['kg', 'lb']),
  goal: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedDurationMin: z.number().optional(),
  exercises: z.array(importExerciseSchema).min(1),
});

const programImportSchema = z
  .object({
    protocolVersion: z.enum(['1.0', '1.1']),
    documentType: z.literal('program'),
    title: z.string().min(1),
    language: z.string().optional(),
    unit: z.enum(['kg', 'lb']),
    goal: z.string().optional(),
    progression: progressionPlanSchema.optional(),
    schedule: z.array(scheduleDaySchema).min(1),
    workouts: z.array(workoutDefinitionSchema).min(1),
  })
  .superRefine((data, ctx) => {
    const titles = new Set(data.workouts.map((workout) => workout.title));

    data.schedule.forEach((day, index) => {
      if (day.type === 'workout' && !day.workoutTitle) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Для тренировочного дня нужен workoutTitle',
          path: ['schedule', index, 'workoutTitle'],
        });
        return;
      }

      if (day.type === 'workout' && day.workoutTitle && !titles.has(day.workoutTitle)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Тренировка "${day.workoutTitle}" не найдена в workouts`,
          path: ['schedule', index, 'workoutTitle'],
        });
      }
    });
  });

export const workoutImportSchema = z.union([templateImportSchema, programImportSchema]);

function collectTemplateWarnings(document: WorkoutTemplateDocument) {
  const warnings: ImportValidationResult['warnings'] = [];

  document.exercises.forEach((exercise, index) => {
    if (!exercise.restSec) {
      warnings.push({
        severity: 'warning',
        message: `Упражнение "${exercise.name}" без restSec`,
        path: `exercises[${index}].restSec`,
      });
    }

    if (!exercise.images || exercise.images.length === 0) {
      warnings.push({
        severity: 'warning',
        message: `Упражнение "${exercise.name}" без изображений`,
        path: `exercises[${index}].images`,
      });
    } else {
      const hasSvg = exercise.images.some((image) => image.format === 'svg');
      if (!hasSvg) {
        warnings.push({
          severity: 'warning',
          message: `Упражнение "${exercise.name}" без SVG — используется fallback`,
          path: `exercises[${index}].images`,
        });
      }
    }

    const workingSets = (exercise.sets ?? []).filter((set) => set.type === 'working');
    if (workingSets.some((set) => set.rpe == null)) {
      warnings.push({
        severity: 'warning',
        message: `У "${exercise.name}" нет RPE на рабочих подходах`,
        path: `exercises[${index}].sets`,
      });
    }
  });

  return warnings;
}

function collectProgramWarnings(document: ProgramImportDocument) {
  const warnings: ImportValidationResult['warnings'] = [];

  if (!document.progression) {
    warnings.push({
      severity: 'warning',
      message: 'Нет блока progression — будут использованы настройки приложения',
    });
  }

  const scheduledWeekdays = new Set(document.schedule.map((day) => day.weekday));
  for (let weekday = 0; weekday <= 6; weekday += 1) {
    if (!scheduledWeekdays.has(weekday)) {
      warnings.push({
        severity: 'warning',
        message: `День ${weekday} не указан в schedule — будет считаться отдыхом`,
        path: 'schedule',
      });
    }
  }

  document.workouts.forEach((workout, workoutIndex) => {
    workout.exercises.forEach((exercise, exerciseIndex) => {
      if (!exercise.notes) {
        warnings.push({
          severity: 'warning',
          message: `У "${exercise.name}" (${workout.title}) нет notes с логикой прогрессии`,
          path: `workouts[${workoutIndex}].exercises[${exerciseIndex}].notes`,
        });
      }
    });
  });

  return warnings;
}

export function validateWorkoutImport(input: unknown): ImportValidationResult {
  const parsed = workoutImportSchema.safeParse(input);

  if (!parsed.success) {
    const errors = parsed.error.issues.map((issue) => ({
      severity: 'error' as const,
      message: issue.message,
      path: issue.path.join('.'),
    }));
    return { success: false, errors, warnings: [] };
  }

  const document = parsed.data as WorkoutImportDocument;
  const warnings =
    document.documentType === 'program'
      ? collectProgramWarnings(document)
      : collectTemplateWarnings(document);

  return {
    success: true,
    document,
    errors: [],
    warnings,
  };
}