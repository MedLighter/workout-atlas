import type { WorkoutUnit } from './workout.types';

export type ProgressionMode = 'linear' | 'rpe';

export type ProgressionCadence =
  | 'every_session'
  | 'weekly'
  | 'biweekly'
  | 'every_n_sessions';

export type ProgressionTrend = 'up' | 'hold' | 'down';

export interface ProgressionSettings {
  enabled: boolean;
  mode: ProgressionMode;
  weightIncrementKg: number;
  weightIncrementLb: number;
  targetRpe: number;
  cadence: ProgressionCadence;
  cadenceEverySessions: number;
}

export interface ProgressionSuggestion {
  weight: number;
  reps: number;
  trend: ProgressionTrend;
  reason: string;
  basedOnDate?: string;
  baselineWeight?: number;
  baselineReps?: number;
}

export const DEFAULT_PROGRESSION_SETTINGS: ProgressionSettings = {
  enabled: true,
  mode: 'linear',
  weightIncrementKg: 2.5,
  weightIncrementLb: 5,
  targetRpe: 8,
  cadence: 'every_session',
  cadenceEverySessions: 2,
};

export const PROGRESSION_CADENCE_LABELS: Record<ProgressionCadence, string> = {
  every_session: 'Каждую тренировку',
  weekly: 'Раз в неделю',
  biweekly: 'Раз в 2 недели',
  every_n_sessions: 'Каждые N тренировок',
};

export function getWeightIncrement(settings: ProgressionSettings, unit: WorkoutUnit): number {
  return unit === 'kg' ? settings.weightIncrementKg : settings.weightIncrementLb;
}