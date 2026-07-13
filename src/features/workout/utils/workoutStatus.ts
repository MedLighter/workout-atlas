import type { Exercise, ExerciseStatus, WorkoutSession } from '../model/workout.types';

export function getExerciseStatus(exercise: Exercise): ExerciseStatus {
  if (exercise.status === 'skipped') {
    return 'skipped';
  }

  const sets = exercise.sets;
  if (sets.length === 0) {
    return 'not_started';
  }

  const completedCount = sets.filter((set) => set.completed).length;
  if (completedCount === 0) {
    return 'not_started';
  }
  if (completedCount === sets.length) {
    return 'done';
  }
  return 'in_progress';
}

export function getWorkoutProgress(session: WorkoutSession): {
  completed: number;
  total: number;
  percent: number;
} {
  const total = session.exercises.length;
  const completed = session.exercises.filter(
    (exercise) => getExerciseStatus(exercise) === 'done',
  ).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}

export function formatPreviousSet(
  weight: number | undefined,
  reps: number | undefined,
  unit: string,
): string | null {
  if (weight == null || reps == null) {
    return null;
  }
  return `${weight} ${unit} x ${reps}`;
}