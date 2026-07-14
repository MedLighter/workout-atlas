import type { WeeklyProgram, WorkoutSession } from '../../workout/model/workout.types';
import type { ProgressionSettings } from '../../workout/model/progression.types';
import { DEFAULT_PROGRESSION_SETTINGS } from '../../workout/model/progression.types';
import { deriveProgramName } from '../../workout/model/workout.schedule';
import type {
  ImportProgressionPlan,
  ImportWorkoutDefinition,
  ProgramImportDocument,
  WorkoutTemplateDocument,
} from './import.types';
import { transformImportToWorkoutSession } from './import.parser';

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function slugifyTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-а-яё]/gi, '')
    .slice(0, 40);
  return `template-import-${slug || 'workout'}`;
}

function toTemplateDocument(
  workout: ImportWorkoutDefinition,
  unit: ProgramImportDocument['unit'],
): WorkoutTemplateDocument {
  return {
    protocolVersion: '1.1',
    documentType: 'workout_template',
    title: workout.title,
    unit,
    goal: workout.goal,
    difficulty: workout.difficulty,
    estimatedDurationMin: workout.estimatedDurationMin,
    exercises: workout.exercises,
  };
}

export function transformProgramWorkouts(document: ProgramImportDocument): WorkoutSession[] {
  const usedIds = new Set<string>();

  return document.workouts.map((workout) => {
    let templateId = slugifyTitle(workout.title);
    if (usedIds.has(templateId)) {
      templateId = `${templateId}-${usedIds.size}`;
    }
    usedIds.add(templateId);

    const session = transformImportToWorkoutSession(toTemplateDocument(workout, document.unit));
    return { ...session, id: templateId };
  });
}

export function buildWeeklyProgramFromImport(
  document: ProgramImportDocument,
  templates: WorkoutSession[],
): WeeklyProgram {
  const templateByTitle = new Map(templates.map((template) => [template.title, template]));
  const scheduleByWeekday = new Map(document.schedule.map((day) => [day.weekday, day]));

  const days = Array.from({ length: 7 }, (_, weekday) => {
    const scheduled = scheduleByWeekday.get(weekday);

    if (!scheduled || scheduled.type === 'rest') {
      return { weekday, type: 'rest' as const, title: 'Отдых' };
    }

    const template = templateByTitle.get(scheduled.workoutTitle ?? '');
    if (!template) {
      return { weekday, type: 'rest' as const, title: 'Отдых' };
    }

    return {
      weekday,
      type: 'workout' as const,
      title: template.title,
      templateId: template.id,
    };
  });

  return {
    id: createId('program'),
    name: document.title || deriveProgramName(days),
    days,
  };
}

export function mapImportProgressionToSettings(
  plan?: ImportProgressionPlan,
): Partial<ProgressionSettings> {
  if (!plan) return {};

  return {
    enabled: plan.enabled,
    mode: plan.mode,
    weightIncrementKg: plan.weightIncrementKg ?? DEFAULT_PROGRESSION_SETTINGS.weightIncrementKg,
    weightIncrementLb: plan.weightIncrementLb ?? DEFAULT_PROGRESSION_SETTINGS.weightIncrementLb,
    targetRpe: plan.targetRpe ?? DEFAULT_PROGRESSION_SETTINGS.targetRpe,
    cadence: plan.cadence,
    cadenceEverySessions:
      plan.cadenceEverySessions ?? DEFAULT_PROGRESSION_SETTINGS.cadenceEverySessions,
  };
}