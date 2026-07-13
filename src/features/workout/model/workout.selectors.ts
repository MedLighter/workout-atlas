import type { Exercise, WorkoutSession } from './workout.types';
import { formatOneRepMax } from '../utils/oneRepMax';
import { getExerciseStatus, getWorkoutProgress } from '../utils/workoutStatus';

export function selectWorkoutProgress(session: WorkoutSession | null) {
  if (!session) {
    return { completed: 0, total: 0, percent: 0 };
  }
  return getWorkoutProgress(session);
}

export function selectExerciseWithStatus(exercise: Exercise): Exercise {
  return {
    ...exercise,
    status: getExerciseStatus(exercise),
  };
}

export function selectBestSetForOneRm(exercise: Exercise): { weight: number; reps: number } | null {
  const completedSets = exercise.sets.filter(
    (set) => set.completed && set.weight && set.reps,
  );
  if (completedSets.length === 0) {
    const historySets = exercise.history?.flatMap((entry) => entry.sets) ?? [];
    const bestHistory = historySets
      .filter((set) => set.weight && set.reps)
      .sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0];
    if (bestHistory?.weight && bestHistory.reps) {
      return { weight: bestHistory.weight, reps: bestHistory.reps };
    }
    return null;
  }

  const best = completedSets.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0];
  if (!best.weight || !best.reps) {
    return null;
  }
  return { weight: best.weight, reps: best.reps };
}

export function selectEstimatedOneRm(exercise: Exercise): string | null {
  const best = selectBestSetForOneRm(exercise);
  if (!best) {
    return null;
  }
  return formatOneRepMax(best.weight, best.reps);
}