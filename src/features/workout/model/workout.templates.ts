import type { WorkoutSession } from './workout.types';
import { mockWorkoutSession } from './workout.mock';

function cloneSession(
  session: WorkoutSession,
  id: string,
  title: string,
): WorkoutSession {
  const today = new Date().toISOString().split('T')[0];
  return {
    ...JSON.parse(JSON.stringify(session)),
    id,
    title,
    date: today,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      status: 'not_started' as const,
      sets: exercise.sets.map((set) => ({ ...set, completed: false })),
    })),
  };
}

export const templateFullBodyA = cloneSession(
  mockWorkoutSession,
  'template-full-body-a',
  'Full Body A',
);

export const templateFullBodyB = cloneSession(
  {
    ...mockWorkoutSession,
    exercises: [
      mockWorkoutSession.exercises[1],
      mockWorkoutSession.exercises[2],
      mockWorkoutSession.exercises[3],
      {
        ...mockWorkoutSession.exercises[4],
        name: 'Подтягивания',
        muscleGroups: ['Спина', 'Бицепс'],
        equipment: ['Турник'],
        sets: [
          { id: 'set-p1', type: 'working', previousReps: 8, completed: false },
          { id: 'set-p2', type: 'working', previousReps: 7, completed: false },
          { id: 'set-p3', type: 'working', previousReps: 6, completed: false },
        ],
      },
    ],
  },
  'template-full-body-b',
  'Full Body B',
);

export const defaultTemplates = [templateFullBodyA, templateFullBodyB];