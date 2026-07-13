import { z } from 'zod';
import type { ImportValidationResult, WorkoutImportDocument } from './import.types';

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

export const workoutImportSchema = z.object({
  protocolVersion: z.literal('1.0'),
  documentType: z.enum(['workout_template', 'workout_session', 'program']),
  title: z.string().min(1),
  language: z.string().optional(),
  unit: z.enum(['kg', 'lb']),
  goal: z.string().optional(),
  difficulty: z.string().optional(),
  estimatedDurationMin: z.number().optional(),
  exercises: z.array(importExerciseSchema).min(1),
});

function collectWarnings(document: WorkoutImportDocument) {
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
  const warnings = collectWarnings(document);

  return {
    success: true,
    document,
    errors: [],
    warnings,
  };
}