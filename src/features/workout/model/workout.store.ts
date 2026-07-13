import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Storage from 'expo-sqlite/kv-store';
import { mockWorkoutSession } from './workout.mock';
import {
  defaultWeeklyProgram,
  type ScheduleDayUpdate,
  updateProgramDay,
} from './workout.schedule';
import { defaultTemplates } from './workout.templates';
import type { Exercise, WeeklyProgram, WorkoutSession, WorkoutSet } from './workout.types';
import { getExerciseStatus } from '../utils/workoutStatus';

interface WorkoutState {
  currentSession: WorkoutSession | null;
  templates: WorkoutSession[];
  completedSessions: WorkoutSession[];
  weeklyProgram: WeeklyProgram;
  selectedWeekday: number;
  expandedExerciseId: string | null;
  atlasExerciseId: string | null;
  planEditorOpen: boolean;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  initSession: () => void;
  setCurrentSession: (session: WorkoutSession) => void;
  addTemplate: (session: WorkoutSession) => void;
  selectWeekday: (weekday: number) => void;
  loadWorkoutForWeekday: (weekday: number) => void;
  updateScheduleDay: (weekday: number, update: ScheduleDayUpdate) => void;
  setProgramName: (name: string) => void;
  resetWeeklyProgram: () => void;
  openPlanEditor: () => void;
  closePlanEditor: () => void;
  toggleExpanded: (exerciseId: string) => void;
  openAtlas: (exerciseId: string) => void;
  closeAtlas: () => void;
  updateSet: (exerciseId: string, setId: string, patch: Partial<WorkoutSet>) => void;
  copyLastSet: (exerciseId: string, setId: string) => void;
  addSet: (exerciseId: string) => void;
  toggleExerciseSimple: (exerciseId: string) => void;
  skipExercise: (exerciseId: string) => void;
  finishWorkout: () => void;
}

const kvStorage = createJSONStorage(() => ({
  getItem: (name) => Storage.getItem(name),
  setItem: (name, value) => Storage.setItem(name, value),
  removeItem: (name) => Storage.removeItem(name),
}));

function syncExerciseStatus(exercise: Exercise): Exercise {
  return { ...exercise, status: getExerciseStatus(exercise) };
}

function syncSession(session: WorkoutSession): WorkoutSession {
  return {
    ...session,
    exercises: session.exercises.map(syncExerciseStatus),
    updatedAt: new Date().toISOString(),
  };
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      templates: defaultTemplates,
      completedSessions: [],
      weeklyProgram: defaultWeeklyProgram,
      selectedWeekday: new Date().getDay() === 0 ? 6 : new Date().getDay() - 1,
      expandedExerciseId: null,
      atlasExerciseId: null,
      planEditorOpen: false,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      initSession: () => {
        const { currentSession, selectedWeekday } = get();
        if (!currentSession) {
          get().loadWorkoutForWeekday(selectedWeekday);
        }
      },
      selectWeekday: (weekday) => set({ selectedWeekday: weekday }),
      loadWorkoutForWeekday: (weekday) => {
        const { weeklyProgram, templates } = get();
        const day = weeklyProgram.days.find((item) => item.weekday === weekday);
        if (!day || day.type === 'rest' || !day.templateId) {
          set({ selectedWeekday: weekday, currentSession: null, expandedExerciseId: null });
          return;
        }

        const template =
          templates.find((item) => item.id === day.templateId) ??
          templates.find((item) => item.title === day.title);

        if (!template) {
          set({
            selectedWeekday: weekday,
            currentSession: syncSession({ ...mockWorkoutSession, id: createId('session') }),
          });
          return;
        }

        const today = new Date().toISOString().split('T')[0];
        set({
          selectedWeekday: weekday,
          currentSession: syncSession({
            ...JSON.parse(JSON.stringify(template)),
            id: createId('session'),
            date: today,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
          expandedExerciseId: null,
        });
      },
      updateScheduleDay: (weekday, update) => {
        set((state) => ({
          weeklyProgram: updateProgramDay(state.weeklyProgram, weekday, update),
        }));
        if (get().selectedWeekday === weekday) {
          get().loadWorkoutForWeekday(weekday);
        }
      },
      setProgramName: (name) =>
        set((state) => ({
          weeklyProgram: {
            ...state.weeklyProgram,
            name: name.trim() || state.weeklyProgram.name,
          },
        })),
      resetWeeklyProgram: () => {
        set({ weeklyProgram: defaultWeeklyProgram });
        get().loadWorkoutForWeekday(get().selectedWeekday);
      },
      openPlanEditor: () => set({ planEditorOpen: true }),
      closePlanEditor: () => set({ planEditorOpen: false }),
      setCurrentSession: (session) => set({ currentSession: syncSession(session), expandedExerciseId: null }),
      addTemplate: (session) =>
        set((state) => ({
          templates: [syncSession(session), ...state.templates.filter((t) => t.id !== session.id)],
        })),
      toggleExpanded: (exerciseId) =>
        set((state) => ({
          expandedExerciseId: state.expandedExerciseId === exerciseId ? null : exerciseId,
        })),
      openAtlas: (exerciseId) => set({ atlasExerciseId: exerciseId }),
      closeAtlas: () => set({ atlasExerciseId: null }),
      updateSet: (exerciseId, setId, patch) =>
        set((state) => {
          if (!state.currentSession) return state;
          const session = syncSession({
            ...state.currentSession,
            exercises: state.currentSession.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) return exercise;
              return syncExerciseStatus({
                ...exercise,
                sets: exercise.sets.map((workoutSet) =>
                  workoutSet.id === setId ? { ...workoutSet, ...patch } : workoutSet,
                ),
              });
            }),
          });
          return { ...state, currentSession: session };
        }),
      copyLastSet: (exerciseId, setId) =>
        set((state) => {
          if (!state.currentSession) return state;
          const session = syncSession({
            ...state.currentSession,
            exercises: state.currentSession.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) return exercise;
              return syncExerciseStatus({
                ...exercise,
                sets: exercise.sets.map((workoutSet) => {
                  if (workoutSet.id !== setId) return workoutSet;
                  return {
                    ...workoutSet,
                    weight: workoutSet.previousWeight,
                    reps: workoutSet.previousReps,
                  };
                }),
              });
            }),
          });
          return { ...state, currentSession: session };
        }),
      addSet: (exerciseId) =>
        set((state) => {
          if (!state.currentSession) return state;
          const session = syncSession({
            ...state.currentSession,
            exercises: state.currentSession.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) return exercise;
              const lastSet = exercise.sets[exercise.sets.length - 1];
              return {
                ...exercise,
                sets: [
                  ...exercise.sets,
                  {
                    id: createId('set'),
                    type: lastSet?.type ?? 'working',
                    previousWeight: lastSet?.previousWeight,
                    previousReps: lastSet?.previousReps,
                    completed: false,
                  },
                ],
              };
            }),
          });
          return { ...state, currentSession: session };
        }),
      toggleExerciseSimple: (exerciseId) =>
        set((state) => {
          if (!state.currentSession) return state;
          const session = syncSession({
            ...state.currentSession,
            exercises: state.currentSession.exercises.map((exercise) => {
              if (exercise.id !== exerciseId) return exercise;
              const isDone = getExerciseStatus(exercise) === 'done';
              return syncExerciseStatus({
                ...exercise,
                status: isDone ? 'not_started' : 'done',
                sets: exercise.sets.map((workoutSet) => ({
                  ...workoutSet,
                  completed: !isDone,
                })),
              });
            }),
          });
          return { ...state, currentSession: session };
        }),
      skipExercise: (exerciseId) =>
        set((state) => {
          if (!state.currentSession) return state;
          const session = syncSession({
            ...state.currentSession,
            exercises: state.currentSession.exercises.map((exercise) =>
              exercise.id === exerciseId
                ? { ...exercise, status: 'skipped' as const }
                : exercise,
            ),
          });
          return { ...state, currentSession: session };
        }),
      finishWorkout: () =>
        set((state) => {
          if (!state.currentSession) return state;
          const finished = syncSession(state.currentSession);
          return {
            currentSession: null,
            completedSessions: [finished, ...state.completedSessions],
            expandedExerciseId: null,
            atlasExerciseId: null,
          };
        }),
    }),
    {
      name: 'workout-atlas-data',
      storage: kvStorage,
      partialize: (state) => ({
        currentSession: state.currentSession,
        templates: state.templates,
        completedSessions: state.completedSessions,
        weeklyProgram: state.weeklyProgram,
        selectedWeekday: state.selectedWeekday,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);