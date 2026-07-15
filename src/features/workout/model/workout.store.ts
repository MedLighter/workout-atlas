import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import Storage from '../../../shared/storage/kv-store';
import { STORAGE_KEYS } from '../../../shared/storage/storage-keys';
import { mockWorkoutSession } from './workout.mock';
import {
  defaultWeeklyProgram,
  deriveProgramName,
  getMondayFirstWeekday,
  type ScheduleDayUpdate,
  updateProgramDay,
} from './workout.schedule';
import { defaultTemplates } from './workout.templates';
import type { Exercise, WeeklyProgram, WorkoutSession, WorkoutSet } from './workout.types';
import { useSettingsStore } from '../../settings/model/settings.store';
import {
  applyProgressionToSession,
  syncTemplateExerciseFromPerformance,
} from '../utils/progression';
import { findNextActiveExerciseId, getExerciseStatus } from '../utils/workoutStatus';
import {
  initialFocusFlowState,
  type FocusFlowState,
  type WorkoutPhase,
} from './focus-flow.types';
import {
  findFirstActiveExerciseIndex,
  findFirstIncompleteSetIndex,
  getActiveExercise,
} from '../utils/focus-flow.logic';

interface WorkoutState extends FocusFlowState {
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
  removeTemplate: (templateId: string) => void;
  importWeeklyProgram: (templates: WorkoutSession[], program: WeeklyProgram) => void;
  selectWeekday: (weekday: number) => void;
  loadWorkoutForWeekday: (weekday: number) => void;
  startUnplannedWorkout: () => void;
  updateScheduleDay: (weekday: number, update: ScheduleDayUpdate) => void;
  setProgramName: (name: string) => void;
  setWeeklyProgram: (program: WeeklyProgram) => void;
  resetWeeklyProgram: () => void;
  openPlanEditor: () => void;
  closePlanEditor: () => void;
  toggleExpanded: (exerciseId: string) => void;
  openAtlas: (exerciseId: string) => void;
  closeAtlas: () => void;
  updateSet: (exerciseId: string, setId: string, patch: Partial<WorkoutSet>) => void;
  copyLastSet: (exerciseId: string, setId: string) => void;
  applyProgressionSet: (exerciseId: string, setId: string) => void;
  addSet: (exerciseId: string) => void;
  toggleExerciseSimple: (exerciseId: string) => void;
  skipExercise: (exerciseId: string) => void;
  finishWorkout: () => void;
  prepareWorkout: () => void;
  cancelWorkoutPrep: () => void;
  startWorkout: (skipPrep?: boolean) => void;
  completeSet: () => void;
  skipRest: () => void;
  extendRest: (seconds: number) => void;
  selectSetIndex: (index: number) => void;
  selectExerciseIndex: (index: number) => void;
  adjustWeight: (delta: number) => void;
  adjustReps: (delta: number) => void;
  setActiveWeight: (value: number | undefined) => void;
  setActiveReps: (value: number | undefined) => void;
  pauseWorkout: () => void;
  resumeWorkout: () => void;
  goToNextExercise: () => void;
  finishWorkoutEarly: () => void;
  discardWorkout: () => void;
  dismissSummary: () => void;
  setWorkoutFeedback: (feedback: FocusFlowState['workoutFeedback']) => void;
  setHadPain: (value: boolean) => void;
  resetFocusFlow: () => void;
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

function getProgressionSettings() {
  const settings = useSettingsStore.getState();
  return {
    enabled: settings.enabled,
    mode: settings.mode,
    weightIncrementKg: settings.weightIncrementKg,
    weightIncrementLb: settings.weightIncrementLb,
    targetRpe: settings.targetRpe,
    cadence: settings.cadence ?? 'every_session',
    cadenceEverySessions: settings.cadenceEverySessions ?? 2,
  };
}

function withProgression(session: WorkoutSession, completedSessions: WorkoutSession[]): WorkoutSession {
  return applyProgressionToSession(session, completedSessions, getProgressionSettings());
}

function createSessionFromTemplate(
  template: WorkoutSession,
  title = template.title,
): WorkoutSession {
  const today = new Date().toISOString().split('T')[0];
  return syncSession({
    ...JSON.parse(JSON.stringify(template)),
    id: createId('session'),
    title,
    date: today,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      ...initialFocusFlowState,
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
          const session = syncSession({ ...mockWorkoutSession, id: createId('session') });
          set({
            selectedWeekday: weekday,
            currentSession: session,
            expandedExerciseId: findNextActiveExerciseId(session),
          });
          return;
        }

        const session = withProgression(
          createSessionFromTemplate(template),
          get().completedSessions,
        );
        set({
          selectedWeekday: weekday,
          currentSession: session,
          expandedExerciseId: findNextActiveExerciseId(session),
        });
      },
      startUnplannedWorkout: () => {
        const { templates, completedSessions } = get();
        const template = templates[0] ?? mockWorkoutSession;

        const session = withProgression(
          createSessionFromTemplate(template, 'Внеплановая тренировка'),
          completedSessions,
        );
        set({
          currentSession: session,
          expandedExerciseId: findNextActiveExerciseId(session),
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
      setWeeklyProgram: (program) => {
        set({ weeklyProgram: program });
        get().loadWorkoutForWeekday(get().selectedWeekday);
      },
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
      removeTemplate: (templateId) => {
        set((state) => {
          const templates = state.templates.filter((template) => template.id !== templateId);
          const days = state.weeklyProgram.days.map((day) =>
            day.type === 'workout' && day.templateId === templateId
              ? { weekday: day.weekday, type: 'rest' as const, title: 'Отдых' }
              : day,
          );
          const weeklyProgram = {
            ...state.weeklyProgram,
            days,
            name: deriveProgramName(days),
          };
          const currentSession =
            state.currentSession?.id === templateId ? null : state.currentSession;

          return { templates, weeklyProgram, currentSession, expandedExerciseId: null };
        });
        get().loadWorkoutForWeekday(get().selectedWeekday);
      },
      importWeeklyProgram: (templates, program) => {
        const today = getMondayFirstWeekday();
        const todayPlan = program.days.find((day) => day.weekday === today);
        const targetWeekday =
          todayPlan?.type === 'workout'
            ? today
            : (program.days.find((day) => day.type === 'workout')?.weekday ?? today);

        set((state) => {
          const merged = [...templates.map(syncSession)];
          const existing = state.templates.filter(
            (template) => !merged.some((item) => item.id === template.id),
          );
          return {
            templates: [...merged, ...existing],
            weeklyProgram: program,
            selectedWeekday: targetWeekday,
          };
        });
        get().loadWorkoutForWeekday(targetWeekday);
      },
      toggleExpanded: (exerciseId) =>
        set((state) => ({
          expandedExerciseId: state.expandedExerciseId === exerciseId ? null : exerciseId,
        })),
      openAtlas: (exerciseId) => set({ atlasExerciseId: exerciseId }),
      closeAtlas: () => set({ atlasExerciseId: null }),
      updateSet: (exerciseId, setId, patch) =>
        set((state) => {
          if (!state.currentSession) return state;
          const previous = state.currentSession.exercises.find((item) => item.id === exerciseId);
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
          const updated = session.exercises.find((item) => item.id === exerciseId);
          const becameDone =
            previous &&
            updated &&
            getExerciseStatus(previous) !== 'done' &&
            getExerciseStatus(updated) === 'done';

          return {
            ...state,
            currentSession: session,
            expandedExerciseId: becameDone
              ? findNextActiveExerciseId(session)
              : state.expandedExerciseId,
          };
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
      applyProgressionSet: (exerciseId, setId) =>
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
          const becameDone = session.exercises.some(
            (exercise) =>
              exercise.id === exerciseId && getExerciseStatus(exercise) === 'done',
          );

          return {
            ...state,
            currentSession: session,
            expandedExerciseId: becameDone
              ? findNextActiveExerciseId(session)
              : exerciseId,
          };
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
          return {
            ...state,
            currentSession: session,
            expandedExerciseId: findNextActiveExerciseId(session),
          };
        }),
      resetFocusFlow: () => set({ ...initialFocusFlowState }),
      prepareWorkout: () => set({ workoutPhase: 'prep' }),
      cancelWorkoutPrep: () => set({ workoutPhase: 'idle' }),
      startWorkout: (skipPrep) => {
        const { currentSession } = get();
        if (!currentSession) return;
        const exerciseIndex = findFirstActiveExerciseIndex(currentSession);
        const exercise = currentSession.exercises[exerciseIndex];
        const setIndex = exercise ? findFirstIncompleteSetIndex(exercise) : 0;
        set({
          workoutPhase: skipPrep ? 'active' : 'active',
          activeExerciseIndex: exerciseIndex,
          activeSetIndex: setIndex,
          workoutStartedAt: new Date().toISOString(),
          restEndsAt: null,
          pausedAt: null,
          elapsedBeforePauseMs: 0,
        });
      },
      completeSet: () => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        if (!exercise) return;
        const currentSet = exercise.sets[state.activeSetIndex];
        if (!currentSet) return;

        get().updateSet(exercise.id, currentSet.id, {
          weight: currentSet.weight ?? currentSet.previousWeight,
          reps: currentSet.reps ?? currentSet.previousReps,
          completed: true,
        });

        const updated = get().currentSession;
        if (!updated) return;
        const updatedExercise = updated.exercises[state.activeExerciseIndex];
        const restSec = updatedExercise?.restSec ?? useSettingsStore.getState().restTimerSec;
        const isExerciseDone = getExerciseStatus(updatedExercise) === 'done';
        const hasMoreSets = state.activeSetIndex < updatedExercise.sets.length - 1 && !isExerciseDone;

        if (isExerciseDone) {
          set({ workoutPhase: 'exercise_complete', restEndsAt: null });
          return;
        }

        if (hasMoreSets) {
          set({
            workoutPhase: 'rest',
            restEndsAt: Date.now() + restSec * 1000,
          });
        }
      },
      skipRest: () => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        if (!exercise) return;

        const nextSetIndex = state.activeSetIndex + 1;
        if (nextSetIndex < exercise.sets.length) {
          set({
            workoutPhase: 'active',
            activeSetIndex: nextSetIndex,
            restEndsAt: null,
          });
        } else {
          set({ workoutPhase: 'exercise_complete', restEndsAt: null });
        }
      },
      extendRest: (seconds) =>
        set((state) => ({
          restEndsAt: state.restEndsAt ? state.restEndsAt + seconds * 1000 : null,
        })),
      selectSetIndex: (index) => set({ activeSetIndex: index, workoutPhase: 'active', restEndsAt: null }),
      selectExerciseIndex: (index) => {
        const { currentSession } = get();
        if (!currentSession) return;
        const exercise = currentSession.exercises[index];
        if (!exercise) return;
        set({
          activeExerciseIndex: index,
          activeSetIndex: findFirstIncompleteSetIndex(exercise),
          workoutPhase: 'active',
          restEndsAt: null,
        });
      },
      adjustWeight: (delta) => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        const set = exercise?.sets[state.activeSetIndex];
        if (!exercise || !set) return;
        const current = set.weight ?? set.previousWeight ?? 0;
        get().updateSet(exercise.id, set.id, { weight: Math.max(0, current + delta) });
      },
      adjustReps: (delta) => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        const set = exercise?.sets[state.activeSetIndex];
        if (!exercise || !set) return;
        const current = set.reps ?? set.previousReps ?? 0;
        get().updateSet(exercise.id, set.id, { reps: Math.max(0, current + delta) });
      },
      setActiveWeight: (value) => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        const set = exercise?.sets[state.activeSetIndex];
        if (!exercise || !set) return;
        get().updateSet(exercise.id, set.id, { weight: value });
      },
      setActiveReps: (value) => {
        const state = get();
        if (!state.currentSession) return;
        const exercise = getActiveExercise(state.currentSession, state.activeExerciseIndex);
        const set = exercise?.sets[state.activeSetIndex];
        if (!exercise || !set) return;
        get().updateSet(exercise.id, set.id, { reps: value });
      },
      pauseWorkout: () =>
        set((state) => ({
          workoutPhase: 'paused',
          pausedAt: new Date().toISOString(),
        })),
      resumeWorkout: () =>
        set((state) => {
          if (!state.pausedAt || !state.workoutStartedAt) {
            return { workoutPhase: 'active' as WorkoutPhase, pausedAt: null };
          }
          const pauseDuration = Date.now() - new Date(state.pausedAt).getTime();
          return {
            workoutPhase: 'active',
            pausedAt: null,
            elapsedBeforePauseMs: state.elapsedBeforePauseMs + pauseDuration,
          };
        }),
      goToNextExercise: () => {
        const { currentSession, activeExerciseIndex } = get();
        if (!currentSession) return;
        const nextIndex = currentSession.exercises.findIndex(
          (ex, i) =>
            i > activeExerciseIndex &&
            getExerciseStatus(ex) !== 'done' &&
            getExerciseStatus(ex) !== 'skipped',
        );
        if (nextIndex < 0) {
          get().finishWorkout();
          return;
        }
        const exercise = currentSession.exercises[nextIndex];
        set({
          activeExerciseIndex: nextIndex,
          activeSetIndex: findFirstIncompleteSetIndex(exercise),
          workoutPhase: 'active',
          restEndsAt: null,
        });
      },
      finishWorkoutEarly: () => get().finishWorkout(),
      discardWorkout: () =>
        set({
          ...initialFocusFlowState,
          currentSession: null,
          expandedExerciseId: null,
          atlasExerciseId: null,
        }),
      dismissSummary: () => set({ ...initialFocusFlowState, lastFinishedSessionId: null }),
      setWorkoutFeedback: (feedback) => set({ workoutFeedback: feedback }),
      setHadPain: (value) => set({ hadPain: value }),
      finishWorkout: () =>
        set((state) => {
          if (!state.currentSession) return state;
          const finished = syncSession(state.currentSession);
          const day = state.weeklyProgram.days.find((item) => item.weekday === state.selectedWeekday);
          const templateId = day?.templateId;

          const templates = templateId
            ? state.templates.map((template) => {
                if (template.id !== templateId) return template;
                return syncSession({
                  ...template,
                  exercises: template.exercises.map((templateExercise) => {
                    const performed = finished.exercises.find(
                      (exercise) => exercise.name === templateExercise.name,
                    );
                    if (!performed) return templateExercise;
                    return syncTemplateExerciseFromPerformance(
                      templateExercise,
                      performed,
                      finished.date,
                      () => createId('hist'),
                    );
                  }),
                  updatedAt: new Date().toISOString(),
                });
              })
            : state.templates;

          return {
            ...initialFocusFlowState,
            workoutPhase: 'summary' as WorkoutPhase,
            lastFinishedSessionId: finished.id,
            currentSession: null,
            completedSessions: [finished, ...state.completedSessions],
            templates,
            expandedExerciseId: null,
            atlasExerciseId: null,
          };
        }),
    }),
    {
      name: STORAGE_KEYS.workout,
      storage: kvStorage,
      partialize: (state) => ({
        currentSession: state.currentSession,
        templates: state.templates,
        completedSessions: state.completedSessions,
        weeklyProgram: state.weeklyProgram,
        selectedWeekday: state.selectedWeekday,
        workoutPhase: state.workoutPhase,
        activeExerciseIndex: state.activeExerciseIndex,
        activeSetIndex: state.activeSetIndex,
        restEndsAt: state.restEndsAt,
        workoutStartedAt: state.workoutStartedAt,
        pausedAt: state.pausedAt,
        elapsedBeforePauseMs: state.elapsedBeforePauseMs,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('[workout-atlas] Failed to restore workout data, using defaults.', error);
        }
        useWorkoutStore.getState().setHydrated(true);
      },
    },
  ),
);

useWorkoutStore.persist.onFinishHydration(() => {
  useWorkoutStore.getState().setHydrated(true);
});