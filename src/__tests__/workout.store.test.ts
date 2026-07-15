jest.mock('../shared/storage/kv-store', () => ({
  __esModule: true,
  default: {
    getItem: async () => null,
    setItem: async () => undefined,
    removeItem: async () => undefined,
  },
}));

jest.mock('../features/settings/model/settings.store', () => ({
  useSettingsStore: {
    getState: () => ({
      enabled: false,
      mode: 'linear',
      weightIncrementKg: 2.5,
      weightIncrementLb: 5,
      targetRpe: 8,
      cadence: 'every_session',
      cadenceEverySessions: 2,
    }),
  },
}));

import { useWorkoutStore } from '../features/workout/model/workout.store';
import { defaultWeeklyProgram } from '../features/workout/model/workout.schedule';
import { defaultTemplates } from '../features/workout/model/workout.templates';

describe('useWorkoutStore', () => {
  beforeEach(() => {
    useWorkoutStore.setState({
      currentSession: null,
      templates: defaultTemplates,
      completedSessions: [],
      weeklyProgram: defaultWeeklyProgram,
      selectedWeekday: 1,
      expandedExerciseId: null,
      atlasExerciseId: null,
      planEditorOpen: false,
      hydrated: true,
    });
  });

  it('starts an unplanned workout on a rest day without switching weekday', () => {
    useWorkoutStore.getState().startUnplannedWorkout();

    const state = useWorkoutStore.getState();
    expect(state.selectedWeekday).toBe(1);
    expect(state.currentSession).not.toBeNull();
    expect(state.currentSession?.title).toBe('Внеплановая тренировка');
    expect(state.currentSession?.exercises.length).toBeGreaterThan(0);
  });

  it('clears an unplanned workout when selecting the same rest day again', () => {
    useWorkoutStore.getState().startUnplannedWorkout();
    useWorkoutStore.getState().loadWorkoutForWeekday(1);

    const state = useWorkoutStore.getState();
    expect(state.selectedWeekday).toBe(1);
    expect(state.currentSession).toBeNull();
  });

  it('removes a template and converts schedule days that used it to rest', () => {
    useWorkoutStore.getState().removeTemplate('template-full-body-a');

    const state = useWorkoutStore.getState();
    expect(state.templates.some((template) => template.id === 'template-full-body-a')).toBe(false);
    expect(
      state.weeklyProgram.days.filter(
        (day) => day.type === 'workout' && day.templateId === 'template-full-body-a',
      ),
    ).toHaveLength(0);
    expect(state.weeklyProgram.days.find((day) => day.weekday === 0)?.type).toBe('rest');
    expect(state.weeklyProgram.days.find((day) => day.weekday === 4)?.type).toBe('rest');
  });
});