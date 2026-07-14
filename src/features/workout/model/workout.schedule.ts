import type { WeeklyProgram } from './workout.types';

export const WEEKDAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] as const;

export const WEEKDAY_NAMES = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье',
] as const;

/** Monday-first index: 0 = Mon … 6 = Sun */
export function getMondayFirstWeekday(date = new Date()): number {
  const jsDay = date.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export const defaultWeeklyProgram: WeeklyProgram = {
  id: 'program-full-body-3x',
  name: 'Full Body 3x',
  days: [
    { weekday: 0, type: 'workout', title: 'Full Body A', templateId: 'template-full-body-a' },
    { weekday: 1, type: 'rest', title: 'Отдых' },
    { weekday: 2, type: 'workout', title: 'Full Body B', templateId: 'template-full-body-b' },
    { weekday: 3, type: 'rest', title: 'Отдых' },
    { weekday: 4, type: 'workout', title: 'Full Body A', templateId: 'template-full-body-a' },
    { weekday: 5, type: 'rest', title: 'Отдых' },
    { weekday: 6, type: 'rest', title: 'Отдых' },
  ],
};

export type ScheduleDayUpdate =
  | { type: 'rest' }
  | { type: 'workout'; templateId: string; title: string };

export function deriveProgramName(days: WeeklyProgram['days']): string {
  const workoutDays = days.filter((day) => day.type === 'workout');
  if (workoutDays.length === 0) return 'Без тренировок';
  if (workoutDays.length === 1) return '1 тренировка в неделю';

  const uniqueTitles = [...new Set(workoutDays.map((day) => day.title))];
  if (uniqueTitles.length === 1) {
    return `${uniqueTitles[0]} · ${workoutDays.length}x`;
  }

  return `${workoutDays.length}x в неделю`;
}

export function updateProgramDay(
  program: WeeklyProgram,
  weekday: number,
  update: ScheduleDayUpdate,
): WeeklyProgram {
  const days = program.days.map((day) => {
    if (day.weekday !== weekday) return day;
    if (update.type === 'rest') {
      return { weekday, type: 'rest' as const, title: 'Отдых' };
    }
    return {
      weekday,
      type: 'workout' as const,
      title: update.title,
      templateId: update.templateId,
    };
  });

  return {
    ...program,
    days,
    name: deriveProgramName(days),
  };
}

export type SchedulePresetId = 'fullbody3' | 'fullbody2' | 'all-rest';

export const SCHEDULE_PRESETS: Array<{
  id: SchedulePresetId;
  label: string;
  subtitle: string;
}> = [
  { id: 'fullbody3', label: '3× Full Body', subtitle: 'Пн · Ср · Пт' },
  { id: 'fullbody2', label: '2× Full Body', subtitle: 'Пн · Чт' },
  { id: 'all-rest', label: 'Без плана', subtitle: 'Все дни — отдых' },
];

export function createSchedulePreset(preset: SchedulePresetId): WeeklyProgram {
  if (preset === 'fullbody3') {
    return { ...defaultWeeklyProgram };
  }

  if (preset === 'all-rest') {
    const days = defaultWeeklyProgram.days.map((day) => ({
      weekday: day.weekday,
      type: 'rest' as const,
      title: 'Отдых',
    }));
    return {
      id: 'program-rest',
      name: deriveProgramName(days),
      days,
    };
  }

  const days = defaultWeeklyProgram.days.map((day) => {
    if (day.weekday === 0 || day.weekday === 3) {
      return day;
    }
    return { weekday: day.weekday, type: 'rest' as const, title: 'Отдых' };
  });

  return {
    id: 'program-full-body-2x',
    name: deriveProgramName(days),
    days,
  };
}

export function countWorkoutDays(program: WeeklyProgram): number {
  return program.days.filter((day) => day.type === 'workout').length;
}

export function formatWorkoutDaysSummary(program: WeeklyProgram): string {
  const workoutDays = program.days.filter((day) => day.type === 'workout');
  if (workoutDays.length === 0) {
    return 'Тренировок нет — только отдых';
  }

  const labels = workoutDays.map((day) => WEEKDAY_LABELS[day.weekday]).join(' · ');
  return `${workoutDays.length} тренировки · ${labels}`;
}