import type { Exercise, WorkoutSession, WorkoutSet } from '../model/workout.types';
import type {
  ProgressionCadence,
  ProgressionSettings,
  ProgressionSuggestion,
  ProgressionTrend,
} from '../model/progression.types';
import { getWeightIncrement } from '../model/progression.types';
import type { WorkoutUnit } from '../model/workout.types';

export function normalizeExerciseName(name: string): string {
  return name.trim().toLowerCase();
}

export function roundWeight(weight: number, unit: WorkoutUnit): number {
  const step = unit === 'kg' ? 2.5 : 5;
  return Math.round(weight / step) * step;
}

function getWorkingSets(sets: WorkoutSet[]): WorkoutSet[] {
  return sets.filter((set) => set.type === 'working');
}

function getBestWorkingSet(sets: WorkoutSet[]): WorkoutSet | null {
  const working = getWorkingSets(sets).filter((set) => set.weight && set.reps);
  if (working.length === 0) return null;
  return working.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0))[0];
}

function daysSinceDate(date: string): number {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return Number.POSITIVE_INFINITY;
  return (Date.now() - parsed.getTime()) / 86_400_000;
}

function sessionsSincePerformance(
  exerciseName: string,
  performanceDate: string,
  completedSessions: WorkoutSession[],
): number {
  const target = normalizeExerciseName(exerciseName);
  const index = completedSessions.findIndex((session) => {
    if (session.date !== performanceDate) return false;
    return session.exercises.some(
      (exercise) => normalizeExerciseName(exercise.name) === target,
    );
  });
  return index < 0 ? 0 : index;
}

export function isProgressionCadenceMet(
  exerciseName: string,
  performanceDate: string,
  completedSessions: WorkoutSession[],
  cadence: ProgressionCadence,
  cadenceEverySessions: number,
): boolean {
  switch (cadence) {
    case 'every_session':
      return true;
    case 'weekly':
      return daysSinceDate(performanceDate) >= 7;
    case 'biweekly':
      return daysSinceDate(performanceDate) >= 14;
    case 'every_n_sessions':
      return (
        sessionsSincePerformance(exerciseName, performanceDate, completedSessions) >=
        cadenceEverySessions
      );
    default:
      return true;
  }
}

function averageRpe(sets: WorkoutSet[]): number | null {
  const withRpe = sets.filter((set) => set.rpe != null);
  if (withRpe.length === 0) return null;
  const total = withRpe.reduce((sum, set) => sum + (set.rpe ?? 0), 0);
  return total / withRpe.length;
}

export function findLastExercisePerformance(
  exerciseName: string,
  completedSessions: WorkoutSession[],
): { exercise: Exercise; date: string } | null {
  const target = normalizeExerciseName(exerciseName);

  for (const session of completedSessions) {
    const match = session.exercises.find(
      (exercise) => normalizeExerciseName(exercise.name) === target,
    );
    if (!match) continue;

    const completedWorking = getWorkingSets(match.sets).filter((set) => set.completed);
    if (completedWorking.length === 0) continue;

    return { exercise: match, date: session.date };
  }

  return null;
}

function buildSuggestion(
  weight: number,
  reps: number,
  trend: ProgressionTrend,
  reason: string,
  basedOnDate?: string,
  baseline?: { weight: number; reps: number },
): ProgressionSuggestion {
  return {
    weight,
    reps,
    trend,
    reason,
    basedOnDate,
    baselineWeight: baseline?.weight,
    baselineReps: baseline?.reps,
  };
}

export function calculateProgressionSuggestion(
  exercise: Exercise,
  completedSessions: WorkoutSession[],
  settings: ProgressionSettings,
  unit: WorkoutUnit,
): ProgressionSuggestion | null {
  if (!settings.enabled) return null;

  const last = findLastExercisePerformance(exercise.name, completedSessions);
  if (!last) return null;

  if (
    !isProgressionCadenceMet(
      exercise.name,
      last.date,
      completedSessions,
      settings.cadence,
      settings.cadenceEverySessions,
    )
  ) {
    const best = getBestWorkingSet(getWorkingSets(last.exercise.sets).filter((set) => set.completed));
    if (!best?.weight || !best.reps) return null;
    return buildSuggestion(
      best.weight,
      best.reps,
      'hold',
      'Ещё рано повышать — ждём следующий интервал прогрессии',
      last.date,
      { weight: best.weight, reps: best.reps },
    );
  }

  const workingSets = getWorkingSets(last.exercise.sets);
  const completedWorking = workingSets.filter((set) => set.completed);
  const best = getBestWorkingSet(completedWorking);
  if (!best?.weight || !best.reps) return null;

  const increment = getWeightIncrement(settings, unit);
  const basedOnDate = last.date;
  const baseline = { weight: best.weight, reps: best.reps };

  if (settings.mode === 'linear') {
    const allWorkingDone = workingSets.every((set) => set.completed);
    if (allWorkingDone) {
      return buildSuggestion(
        roundWeight(best.weight + increment, unit),
        best.reps,
        'up',
        'Все рабочие подходы закрыты',
        basedOnDate,
        baseline,
      );
    }

    return buildSuggestion(
      best.weight,
      best.reps,
      'hold',
      'Есть незакрытые подходы — держим вес',
      basedOnDate,
      baseline,
    );
  }

  const avgRpe = averageRpe(completedWorking);
  if (avgRpe == null) {
    const allWorkingDone = workingSets.every((set) => set.completed);
    if (allWorkingDone) {
      return buildSuggestion(
        roundWeight(best.weight + increment, unit),
        best.reps,
        'up',
        'Все рабочие подходы закрыты',
        basedOnDate,
        baseline,
      );
    }
    return buildSuggestion(best.weight, best.reps, 'hold', 'Нет RPE — держим вес', basedOnDate, baseline);
  }

  if (avgRpe <= settings.targetRpe - 1) {
    return buildSuggestion(
      roundWeight(best.weight + increment, unit),
      best.reps,
      'up',
      'RPE ниже цели — есть запас',
      basedOnDate,
      baseline,
    );
  }

  if (avgRpe >= settings.targetRpe + 1) {
    const reduced = Math.max(roundWeight(best.weight - increment, unit), increment);
    return buildSuggestion(reduced, best.reps, 'down', 'RPE выше обычного — снижаем', basedOnDate, baseline);
  }

  return buildSuggestion(
    best.weight,
    best.reps,
    'hold',
    'Нагрузка в целевой зоне',
    basedOnDate,
    baseline,
  );
}

export function applyProgressionToExercise(
  exercise: Exercise,
  suggestion: ProgressionSuggestion,
): Exercise {
  return {
    ...exercise,
    sets: exercise.sets.map((set) => {
      if (set.type !== 'working') return set;

      return {
        ...set,
        previousWeight: suggestion.weight,
        previousReps: suggestion.reps,
        weight: set.weight ?? suggestion.weight,
        reps: set.reps ?? suggestion.reps,
      };
    }),
  };
}

export function applyProgressionToSession(
  session: WorkoutSession,
  completedSessions: WorkoutSession[],
  settings: ProgressionSettings,
): WorkoutSession {
  if (!settings.enabled) return session;

  return {
    ...session,
    exercises: session.exercises.map((exercise) => {
      const suggestion = calculateProgressionSuggestion(
        exercise,
        completedSessions,
        settings,
        session.unit,
      );
      if (!suggestion) return exercise;
      return applyProgressionToExercise(exercise, suggestion);
    }),
  };
}

export function syncTemplateExerciseFromPerformance(
  templateExercise: Exercise,
  performedExercise: Exercise,
  sessionDate: string,
  createHistoryId: () => string,
): Exercise {
  const completedSets = performedExercise.sets.filter((set) => set.completed);

  return {
    ...templateExercise,
    history: [
      {
        id: createHistoryId(),
        date: sessionDate,
        sets: completedSets.map((set) => ({ ...set })),
      },
      ...(templateExercise.history ?? []),
    ].slice(0, 12),
    sets: templateExercise.sets.map((templateSet, index) => {
      const performedSet =
        performedExercise.sets[index] ??
        performedExercise.sets.find((set) => set.type === templateSet.type);

      if (!performedSet?.completed || performedSet.weight == null || performedSet.reps == null) {
        return {
          ...templateSet,
          completed: false,
        };
      }

      return {
        ...templateSet,
        previousWeight: performedSet.weight,
        previousReps: performedSet.reps,
        rpe: performedSet.rpe ?? templateSet.rpe,
        weight: undefined,
        reps: undefined,
        completed: false,
      };
    }),
  };
}

export function formatProgressionSuggestion(
  suggestion: ProgressionSuggestion,
  unit: string,
): string {
  const trendLabel =
    suggestion.trend === 'up' ? '↑' : suggestion.trend === 'down' ? '↓' : '→';
  return `${trendLabel} ${suggestion.weight} ${unit} × ${suggestion.reps}`;
}

export function formatWeightDelta(
  suggestion: ProgressionSuggestion,
  unit: string,
): string | null {
  if (suggestion.baselineWeight == null) return null;
  const delta = suggestion.weight - suggestion.baselineWeight;
  if (Math.abs(delta) < 0.01) return 'без изменений';
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta} ${unit}`;
}

export function getProgressionFillPercent(suggestion: ProgressionSuggestion): number {
  if (suggestion.baselineWeight == null || suggestion.baselineWeight <= 0) return 100;
  const ratio = suggestion.weight / suggestion.baselineWeight;
  return Math.min(100, Math.max(35, Math.round(ratio * 100)));
}