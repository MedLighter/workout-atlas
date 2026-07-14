import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Storage from '../../../shared/storage/kv-store';
import { STORAGE_KEYS } from '../../../shared/storage/storage-keys';
import type { TrackingMode, WorkoutUnit } from '../../workout/model/workout.types';
import {
  DEFAULT_PROGRESSION_SETTINGS,
  type ProgressionCadence,
  type ProgressionMode,
  type ProgressionSettings,
} from '../../workout/model/progression.types';

import { AI_IMPORT_PROMPT, buildAiImportPrompt } from '../../import/model/ai-import.prompt';

export { AI_IMPORT_PROMPT };

interface SettingsState extends ProgressionSettings {
  unit: WorkoutUnit;
  restTimerSec: number;
  trackingMode: TrackingMode;
  onboardingComplete: boolean;
  aiImportPrompt: string;
  setUnit: (unit: WorkoutUnit) => void;
  setRestTimerSec: (seconds: number) => void;
  setTrackingMode: (mode: TrackingMode) => void;
  setProgressionEnabled: (enabled: boolean) => void;
  setProgressionMode: (mode: ProgressionMode) => void;
  setWeightIncrementKg: (value: number) => void;
  setWeightIncrementLb: (value: number) => void;
  setTargetRpe: (value: number) => void;
  setProgressionCadence: (cadence: ProgressionCadence) => void;
  setCadenceEverySessions: (value: number) => void;
  applyProgressionPlan: (plan: Partial<ProgressionSettings>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const kvStorage = createJSONStorage(() => ({
  getItem: (name) => Storage.getItem(name),
  setItem: (name, value) => Storage.setItem(name, value),
  removeItem: (name) => Storage.removeItem(name),
}));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      unit: 'kg',
      restTimerSec: 90,
      trackingMode: 'detailed',
      onboardingComplete: false,
      aiImportPrompt: AI_IMPORT_PROMPT,
      ...DEFAULT_PROGRESSION_SETTINGS,
      setUnit: (unit) =>
        set({
          unit,
          aiImportPrompt: buildAiImportPrompt(unit),
        }),
      setRestTimerSec: (seconds) => set({ restTimerSec: seconds }),
      setTrackingMode: (mode) => set({ trackingMode: mode }),
      setProgressionEnabled: (enabled) => set({ enabled }),
      setProgressionMode: (mode) => set({ mode }),
      setWeightIncrementKg: (value) => set({ weightIncrementKg: value }),
      setWeightIncrementLb: (value) => set({ weightIncrementLb: value }),
      setTargetRpe: (value) => set({ targetRpe: value }),
      setProgressionCadence: (cadence) => set({ cadence }),
      setCadenceEverySessions: (value) => set({ cadenceEverySessions: value }),
      applyProgressionPlan: (plan) => set((state) => ({ ...state, ...plan })),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboardingComplete: false }),
    }),
    {
      name: STORAGE_KEYS.settings,
      storage: kvStorage,
    },
  ),
);