import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Storage from 'expo-sqlite/kv-store';
import type { TrackingMode, WorkoutUnit } from '../../workout/model/workout.types';
import { AI_IMPORT_PROMPT, buildAiImportPrompt } from '../../import/model/ai-import.prompt';

export { AI_IMPORT_PROMPT };

interface SettingsState {
  unit: WorkoutUnit;
  restTimerSec: number;
  trackingMode: TrackingMode;
  onboardingComplete: boolean;
  aiImportPrompt: string;
  setUnit: (unit: WorkoutUnit) => void;
  setRestTimerSec: (seconds: number) => void;
  setTrackingMode: (mode: TrackingMode) => void;
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
      setUnit: (unit) =>
        set({
          unit,
          aiImportPrompt: buildAiImportPrompt(unit),
        }),
      setRestTimerSec: (seconds) => set({ restTimerSec: seconds }),
      setTrackingMode: (mode) => set({ trackingMode: mode }),
      completeOnboarding: () => set({ onboardingComplete: true }),
      resetOnboarding: () => set({ onboardingComplete: false }),
    }),
    {
      name: 'workout-atlas-settings',
      storage: kvStorage,
    },
  ),
);