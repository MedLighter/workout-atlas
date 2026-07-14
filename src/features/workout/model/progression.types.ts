import type { WorkoutUnit } from './workout.types';

export type ProgressionMode = 'linear' | 'rpe';

export type ProgressionTrend = 'up' | 'hold' | 'down';

export interface ProgressionSettings {
  enabled: boolean;
  mode: ProgressionMode;
  weightIncrementKg: number;
  weightIncrementLb: number;
  targetRpe: number;
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
};

export function getWeightIncrement(settings: ProgressionSettings, unit: WorkoutUnit): number {
  return unit === 'kg' ? settings.weightIncrementKg : settings.weightIncrementLb;
}