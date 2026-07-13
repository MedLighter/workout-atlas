import { calculateOneRepMax, formatOneRepMax } from '../features/workout/utils/oneRepMax';
import { getExerciseStatus, getWorkoutProgress } from '../features/workout/utils/workoutStatus';
import { selectBestMediaAsset } from '../features/media/utils/mediaPriority';
import { validateWorkoutImport } from '../features/import/model/import.schema';
import { parseWorkoutMarkdown } from '../features/import/model/markdown.parser';
import { transformImportToWorkoutSession } from '../features/import/model/import.parser';
import type { Exercise, WorkoutSession } from '../features/workout/model/workout.types';

describe('calculateOneRepMax', () => {
  it('uses Epley formula', () => {
    expect(calculateOneRepMax(100, 5)).toBeCloseTo(116.666, 2);
  });

  it('formats with decimal', () => {
    expect(formatOneRepMax(100, 5)).toBe('116.7 (оценка)');
  });

  it('returns null for invalid input', () => {
    expect(formatOneRepMax(0, 5)).toBeNull();
  });
});

describe('workout status', () => {
  const baseExercise: Exercise = {
    id: '1',
    name: 'Test',
    status: 'not_started',
    sets: [
      { id: 's1', type: 'working', completed: false },
      { id: 's2', type: 'working', completed: false },
    ],
  };

  it('detects not_started', () => {
    expect(getExerciseStatus(baseExercise)).toBe('not_started');
  });

  it('detects in_progress', () => {
    const exercise = {
      ...baseExercise,
      sets: [
        { id: 's1', type: 'working' as const, completed: true },
        { id: 's2', type: 'working' as const, completed: false },
      ],
    };
    expect(getExerciseStatus(exercise)).toBe('in_progress');
  });

  it('calculates workout progress', () => {
    const session: WorkoutSession = {
      id: 'w1',
      title: 'Test',
      date: '2026-07-07',
      unit: 'kg',
      createdAt: '',
      updatedAt: '',
      exercises: [
        {
          ...baseExercise,
          sets: [{ id: 's1', type: 'working', completed: true }],
        },
        baseExercise,
      ],
    };
    expect(getWorkoutProgress(session)).toEqual({ completed: 1, total: 2, percent: 50 });
  });
});

describe('media priority', () => {
  it('prefers svg over webp', () => {
    const asset = selectBestMediaAsset([
      { role: 'exercise_demo', format: 'webp', url: 'https://a.com/a.webp', alt: 'a' },
      { role: 'exercise_demo', format: 'svg', url: 'https://a.com/a.svg', alt: 'b' },
    ]);
    expect(asset?.format).toBe('svg');
  });
});

describe('import validation', () => {
  it('accepts valid json document', () => {
    const result = validateWorkoutImport({
      protocolVersion: '1.0',
      documentType: 'workout_template',
      title: 'Test',
      unit: 'kg',
      exercises: [{ name: 'Жим', sets: [{ type: 'working', weight: 80, reps: 6, rpe: 8 }] }],
    });
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects invalid protocol version', () => {
    const result = validateWorkoutImport({
      protocolVersion: '2.0',
      documentType: 'workout_template',
      title: 'Test',
      unit: 'kg',
      exercises: [{ name: 'Жим' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('markdown parser', () => {
  it('parses basic markdown workout', () => {
    const markdown = `# Full Body
Unit: kg
## Жим лежа
Muscles: Грудь, Трицепс
Rest: 180
Sets:
- working: 80 kg x 6 @RPE 8`;

    const doc = parseWorkoutMarkdown(markdown);
    expect(doc.title).toBe('Full Body');
    expect(doc.exercises[0].name).toBe('Жим лежа');
    expect(doc.exercises[0].sets?.[0]).toMatchObject({ weight: 80, reps: 6, rpe: 8 });
  });
});

describe('transformImportToWorkoutSession', () => {
  it('creates workout session from import document', () => {
    const session = transformImportToWorkoutSession({
      protocolVersion: '1.0',
      documentType: 'workout_template',
      title: 'A',
      unit: 'kg',
      exercises: [{ name: 'Присед', sets: [{ type: 'working', weight: 100, reps: 5 }] }],
    });
    expect(session.title).toBe('A');
    expect(session.exercises).toHaveLength(1);
    expect(session.exercises[0].sets[0].previousWeight).toBe(100);
  });
});