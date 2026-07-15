import type { Exercise, WorkoutSession, WorkoutSet } from '../model/workout.types';
import type { FocusFlowState, WorkoutPhase } from '../model/focus-flow.types';
import { getExerciseStatus } from './workoutStatus';

export function findFirstIncompleteSetIndex(exercise: Exercise): number {
  const idx = exercise.sets.findIndex((set) => !set.completed);
  return idx >= 0 ? idx : Math.max(0, exercise.sets.length - 1);
}

export function findFirstActiveExerciseIndex(session: WorkoutSession): number {
  const idx = session.exercises.findIndex(
    (ex) => getExerciseStatus(ex) !== 'done' && getExerciseStatus(ex) !== 'skipped',
  );
  return idx >= 0 ? idx : 0;
}

export function getActiveExercise(session: WorkoutSession | null, index: number): Exercise | null {
  if (!session) return null;
  return session.exercises[index] ?? null;
}

export function getActiveSet(exercise: Exercise | null, setIndex: number): WorkoutSet | null {
  if (!exercise) return null;
  return exercise.sets[setIndex] ?? null;
}

export function countCompletedExercises(session: WorkoutSession): number {
  return session.exercises.filter((ex) => getExerciseStatus(ex) === 'done').length;
}

export function countCompletedSets(session: WorkoutSession): number {
  return session.exercises.reduce(
    (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
    0,
  );
}

export function estimateSessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce(
    (sum, ex) =>
      sum +
      ex.sets
        .filter((s) => s.completed && s.weight != null && s.reps != null)
        .reduce((setSum, s) => setSum + (s.weight ?? 0) * (s.reps ?? 0), 0),
    0,
  );
}

export function getBestSet(exercise: Exercise): { weight: number; reps: number } | null {
  let best: { weight: number; reps: number } | null = null;
  for (const set of exercise.sets) {
    if (!set.completed || set.weight == null || set.reps == null) continue;
    if (!best || set.weight > best.weight || (set.weight === best.weight && set.reps > best.reps)) {
      best = { weight: set.weight, reps: set.reps };
    }
  }
  return best;
}

export function getPreviousResult(exercise: Exercise): { weight?: number; reps?: number } | null {
  const lastHistory = exercise.history?.[0];
  if (lastHistory) {
    const working = lastHistory.sets.filter((s) => s.type === 'working' && s.weight != null);
    const best = working.reduce<typeof working[0] | null>((acc, s) => {
      if (!acc) return s;
      if ((s.weight ?? 0) > (acc.weight ?? 0)) return s;
      return acc;
    }, null);
    if (best) return { weight: best.weight, reps: best.reps };
  }

  const set = exercise.sets.find((s) => s.previousWeight != null || s.previousReps != null);
  if (set) return { weight: set.previousWeight, reps: set.previousReps };
  return null;
}

export function isWorkoutInProgress(phase: WorkoutPhase): boolean {
  return ['prep', 'active', 'rest', 'exercise_complete', 'paused'].includes(phase);
}

export function getElapsedMinutes(state: FocusFlowState): number {
  if (!state.workoutStartedAt) return 0;
  const start = new Date(state.workoutStartedAt).getTime();
  const now = state.pausedAt ? new Date(state.pausedAt).getTime() : Date.now();
  return Math.round((now - start - state.elapsedBeforePauseMs) / 60000);
}

export function formatRestTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}