import type { WeeklyProgram, WorkoutSession } from '../../workout/model/workout.types';
import type { WorkoutPhase } from '../../workout/model/focus-flow.types';
import { getMondayFirstWeekday } from '../../workout/model/workout.schedule';
import { isWorkoutInProgress } from '../../workout/utils/focus-flow.logic';

export type TodayState =
  | 'loading'
  | 'empty'
  | 'rest'
  | 'start'
  | 'prep'
  | 'active'
  | 'paused'
  | 'summary';

export function hasProgram(templates: WorkoutSession[], program: WeeklyProgram): boolean {
  const hasWorkoutDays = program.days.some((d) => d.type === 'workout');
  return templates.length > 0 && hasWorkoutDays;
}

export function resolveTodayState(params: {
  hydrated: boolean;
  templates: WorkoutSession[];
  weeklyProgram: WeeklyProgram;
  workoutPhase: WorkoutPhase;
  currentSession: WorkoutSession | null;
}): TodayState {
  const { hydrated, templates, weeklyProgram, workoutPhase, currentSession } = params;

  if (!hydrated) return 'loading';
  if (!hasProgram(templates, weeklyProgram)) return 'empty';
  if (workoutPhase === 'summary') return 'summary';
  if (workoutPhase === 'paused') return 'paused';
  if (isWorkoutInProgress(workoutPhase)) return 'active';
  if (workoutPhase === 'prep') return 'prep';

  const today = getMondayFirstWeekday();
  const todayPlan = weeklyProgram.days.find((d) => d.weekday === today);
  if (!todayPlan || todayPlan.type === 'rest') return 'rest';
  if (currentSession) return 'start';

  return 'start';
}

export function getNextWorkoutDay(program: WeeklyProgram, fromWeekday: number) {
  for (let offset = 1; offset <= 7; offset++) {
    const weekday = (fromWeekday + offset) % 7;
    const day = program.days.find((d) => d.weekday === weekday);
    if (day?.type === 'workout') return { day, offset };
  }
  return null;
}