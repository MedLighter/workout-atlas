import {
  deriveProgramName,
  getMondayFirstWeekday,
  defaultWeeklyProgram,
  updateProgramDay,
} from '../features/workout/model/workout.schedule';

describe('workout schedule', () => {
  it('maps sunday to monday-first index 6', () => {
    expect(getMondayFirstWeekday(new Date('2026-07-05'))).toBe(6);
  });

  it('maps monday to index 0', () => {
    expect(getMondayFirstWeekday(new Date('2026-07-06'))).toBe(0);
  });

  it('defines a 3-day workout program', () => {
    const workoutDays = defaultWeeklyProgram.days.filter((day) => day.type === 'workout');
    expect(workoutDays).toHaveLength(3);
    expect(workoutDays.map((day) => day.title)).toEqual([
      'Full Body A',
      'Full Body B',
      'Full Body A',
    ]);
  });

  it('updates a day to rest', () => {
    const updated = updateProgramDay(defaultWeeklyProgram, 0, { type: 'rest' });
    expect(updated.days[0]).toMatchObject({ type: 'rest', title: 'Отдых' });
    expect(updated.name).toBe('2x в неделю');
  });

  it('assigns workout template to a day', () => {
    const updated = updateProgramDay(defaultWeeklyProgram, 1, {
      type: 'workout',
      templateId: 'template-full-body-b',
      title: 'Full Body B',
    });
    expect(updated.days[1]).toMatchObject({
      type: 'workout',
      templateId: 'template-full-body-b',
      title: 'Full Body B',
    });
  });

  it('derives program name from workout count', () => {
    expect(deriveProgramName(defaultWeeklyProgram.days)).toBe('3x в неделю');
  });
});