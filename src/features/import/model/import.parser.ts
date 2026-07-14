import type { WorkoutSession } from '../../workout/model/workout.types';
import type {
  ImportValidationResult,
  WorkoutImportDocument,
  WorkoutTemplateDocument,
} from './import.types';
import { validateWorkoutImport } from './import.schema';
import { parseWorkoutMarkdown } from './markdown.parser';

export type ImportFormat = 'json' | 'markdown' | 'unknown';

export function detectImportFormat(input: string): ImportFormat {
  const trimmed = input.trim();
  if (!trimmed) return 'unknown';
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) return 'json';
  if (trimmed.startsWith('#') || /^Type:/im.test(trimmed) || /^##\s+/m.test(trimmed)) {
    return 'markdown';
  }
  return 'unknown';
}

export function parseImportInput(input: string): ImportValidationResult {
  const format = detectImportFormat(input);

  if (format === 'json') {
    try {
      const json = JSON.parse(input);
      return validateWorkoutImport(json);
    } catch {
      return {
        success: false,
        errors: [{ severity: 'error', message: 'Невалидный JSON' }],
        warnings: [],
      };
    }
  }

  if (format === 'markdown') {
    const document = parseWorkoutMarkdown(input);
    return validateWorkoutImport(document);
  }

  return {
    success: false,
    errors: [{ severity: 'error', message: 'Не удалось определить формат (JSON или Markdown)' }],
    warnings: [],
  };
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function transformImportToWorkoutSession(document: WorkoutTemplateDocument): WorkoutSession {
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  return {
    id: createId('session'),
    title: document.title,
    date: today,
    unit: document.unit,
    createdAt: now,
    updatedAt: now,
    exercises: document.exercises.map((exercise) => ({
      id: createId('exercise'),
      name: exercise.name,
      status: 'not_started' as const,
      muscleGroups: exercise.muscleGroups,
      equipment: exercise.equipment,
      restSec: exercise.restSec,
      notes: exercise.notes,
      techniqueTips: exercise.techniqueTips,
      safetyNotes: exercise.safetyNotes,
      media: exercise.images,
      history: [],
      sets: (exercise.sets ?? []).map((set) => ({
        id: createId('set'),
        type: set.type ?? 'working',
        weight: set.weight,
        reps: set.reps,
        previousWeight: set.weight,
        previousReps: set.reps,
        rpe: set.rpe,
        completed: false,
        notes: set.notes,
      })),
    })),
  };
}