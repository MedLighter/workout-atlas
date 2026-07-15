import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Storage from '../../../shared/storage/kv-store';
import { STORAGE_KEYS } from '../../../shared/storage/storage-keys';

export type TrainingGoal = 'muscle' | 'strength' | 'weight_loss' | 'maintain';
export type ProgramChoice = 'import' | 'generate' | 'manual' | null;

export type GeneratorFrequency = 2 | 3 | 4 | 5;
export type GeneratorDuration = 30 | 45 | 60 | 90;
export type GeneratorLocation = 'gym' | 'home_dumbbells' | 'home_bodyweight' | 'custom';
export type GeneratorExperience = 'beginner' | 'under_year' | 'one_to_three' | 'over_three';

interface OnboardingState {
  step: number;
  goal: TrainingGoal | null;
  programChoice: ProgramChoice;
  frequency: GeneratorFrequency;
  duration: GeneratorDuration;
  location: GeneratorLocation;
  equipment: string[];
  experience: GeneratorExperience;
  limitations: string[];
  limitationNote: string;
  setStep: (step: number) => void;
  setGoal: (goal: TrainingGoal) => void;
  setProgramChoice: (choice: ProgramChoice) => void;
  setFrequency: (value: GeneratorFrequency) => void;
  setDuration: (value: GeneratorDuration) => void;
  setLocation: (value: GeneratorLocation) => void;
  toggleEquipment: (item: string) => void;
  setExperience: (value: GeneratorExperience) => void;
  toggleLimitation: (item: string) => void;
  setLimitationNote: (note: string) => void;
  reset: () => void;
}

const kvStorage = createJSONStorage(() => ({
  getItem: (name) => Storage.getItem(name),
  setItem: (name, value) => Storage.setItem(name, value),
  removeItem: (name) => Storage.removeItem(name),
}));

const initialState = {
  step: 0,
  goal: null as TrainingGoal | null,
  programChoice: null as ProgramChoice,
  frequency: 3 as GeneratorFrequency,
  duration: 45 as GeneratorDuration,
  location: 'gym' as GeneratorLocation,
  equipment: [] as string[],
  experience: 'under_year' as GeneratorExperience,
  limitations: [] as string[],
  limitationNote: '',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setGoal: (goal) => set({ goal }),
      setProgramChoice: (choice) => set({ programChoice: choice }),
      setFrequency: (value) => set({ frequency: value }),
      setDuration: (value) => set({ duration: value }),
      setLocation: (value) => set({ location: value }),
      toggleEquipment: (item) => {
        const current = get().equipment;
        set({
          equipment: current.includes(item)
            ? current.filter((e) => e !== item)
            : [...current, item],
        });
      },
      setExperience: (value) => set({ experience: value }),
      toggleLimitation: (item) => {
        const current = get().limitations;
        set({
          limitations: current.includes(item)
            ? current.filter((l) => l !== item)
            : [...current, item],
        });
      },
      setLimitationNote: (note) => set({ limitationNote: note }),
      reset: () => set(initialState),
    }),
    {
      name: `${STORAGE_KEYS.settings}-onboarding`,
      storage: kvStorage,
    },
  ),
);