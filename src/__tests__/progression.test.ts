import {
  applyProgressionToExercise,
  calculateProgressionSuggestion,
  findLastExercisePerformance,
  formatWeightDelta,
  roundWeight,
} from '../features/workout/utils/progression';
import { DEFAULT_PROGRESSION_SETTINGS } from '../features/workout/model/progression.types';
import type { Exercise, WorkoutSession } from '../features/workout/model/workout.types';

const benchExercise: Exercise = {
  id: 'ex-1',
  name: 'Жим лежа',
  status: 'done',
  sets: [
    { id: 's1', type: 'working', weight: 80, reps: 6, rpe: 7, completed: true },
    { id: 's2', type: 'working', weight: 80, reps: 6, rpe: 7, completed: true },
  ],
};

const completedSession: WorkoutSession = {
  id: 'session-1',
  title: 'Full Body A',
  date: '2026-07-10',
  unit: 'kg',
  createdAt: '2026-07-10',
  updatedAt: '2026-07-10',
  exercises: [benchExercise],
};

describe('progression', () => {
  it('rounds weight to 2.5 kg steps', () => {
    expect(roundWeight(82.3, 'kg')).toBe(82.5);
    expect(roundWeight(10, 'lb')).toBe(10);
  });

  it('finds last performance by exercise name', () => {
    const result = findLastExercisePerformance('жим лежа', [completedSession]);
    expect(result?.date).toBe('2026-07-10');
    expect(result?.exercise.sets).toHaveLength(2);
  });

  it('suggests linear increase when all working sets are done', () => {
    const suggestion = calculateProgressionSuggestion(
      { ...benchExercise, id: 'next', status: 'not_started', sets: [{ id: 'n1', type: 'working', completed: false }] },
      [completedSession],
      { ...DEFAULT_PROGRESSION_SETTINGS, mode: 'linear' },
      'kg',
    );

    expect(suggestion).toMatchObject({
      weight: 82.5,
      reps: 6,
      trend: 'up',
      reason: 'Все рабочие подходы закрыты',
      baselineWeight: 80,
    });
    expect(formatWeightDelta(suggestion!, 'kg')).toBe('+2.5 kg');
  });

  it('suggests decrease when average RPE is too high', () => {
    const heavySession: WorkoutSession = {
      ...completedSession,
      exercises: [
        {
          ...benchExercise,
          sets: [
            { id: 's1', type: 'working', weight: 90, reps: 5, rpe: 9.5, completed: true },
            { id: 's2', type: 'working', weight: 90, reps: 5, rpe: 10, completed: true },
          ],
        },
      ],
    };

    const suggestion = calculateProgressionSuggestion(
      { ...benchExercise, id: 'next', status: 'not_started', sets: [{ id: 'n1', type: 'working', completed: false }] },
      [heavySession],
      { ...DEFAULT_PROGRESSION_SETTINGS, mode: 'rpe', targetRpe: 8 },
      'kg',
    );

    expect(suggestion).toMatchObject({
      weight: 87.5,
      trend: 'down',
      reason: 'RPE выше обычного — снижаем',
    });
  });

  it('applies suggestion to working sets', () => {
    const exercise: Exercise = {
      id: 'ex-2',
      name: 'Жим лежа',
      status: 'not_started',
      sets: [
        { id: 's1', type: 'warmup', completed: false },
        { id: 's2', type: 'working', completed: false },
      ],
    };

    const updated = applyProgressionToExercise(exercise, {
      weight: 82.5,
      reps: 6,
      trend: 'up',
      reason: 'test',
    });

    expect(updated.sets[0].previousWeight).toBeUndefined();
    expect(updated.sets[1]).toMatchObject({
      previousWeight: 82.5,
      previousReps: 6,
      weight: 82.5,
      reps: 6,
    });
  });
});