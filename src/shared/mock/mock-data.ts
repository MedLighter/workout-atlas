/** Моковые данные по разделу 39 ТЗ */

import type { Exercise, WorkoutSession } from '../../features/workout/model/workout.types';

const today = new Date().toISOString().split('T')[0];

function createSet(id: string, type: 'warmup' | 'working', prevW?: number, prevR?: number) {
  return {
    id,
    type,
    previousWeight: prevW,
    previousReps: prevR,
    completed: false,
  };
}

export const mockBenchPressHistory = [
  {
    id: 'hist-july-15',
    date: '2026-07-15',
    sets: [
      { id: 'h1', type: 'working' as const, weight: 80, reps: 8, completed: true, rpe: 8 },
      { id: 'h2', type: 'working' as const, weight: 80, reps: 7, completed: true, rpe: 8.5 },
      { id: 'h3', type: 'working' as const, weight: 77.5, reps: 8, completed: true, rpe: 8 },
    ],
  },
  {
    id: 'hist-july-8',
    date: '2026-07-08',
    sets: [
      { id: 'h4', type: 'working' as const, weight: 77.5, reps: 8, completed: true, rpe: 8 },
      { id: 'h5', type: 'working' as const, weight: 77.5, reps: 8, completed: true, rpe: 8 },
      { id: 'h6', type: 'working' as const, weight: 75, reps: 9, completed: true, rpe: 7.5 },
    ],
  },
];

export const mockFullBodyAExercises: Exercise[] = [
  {
    id: 'ex-bench',
    name: 'Жим лёжа',
    status: 'not_started',
    muscleGroups: ['Грудь', 'Трицепс', 'Передние дельты'],
    equipment: ['Штанга', 'Скамья'],
    restSec: 120,
    techniqueTips: ['Лопатки сведены и прижаты к скамье', 'Контролируй опускание штанги'],
    safetyNotes: ['Не отрывай таз от скамьи'],
    sets: [
      createSet('set-b1', 'working', 77.5, 8),
      createSet('set-b2', 'working', 80, 8),
      createSet('set-b3', 'working', 80, 8),
      createSet('set-b4', 'working', 80, 8),
    ],
    history: mockBenchPressHistory,
  },
  {
    id: 'ex-pullups',
    name: 'Подтягивания',
    status: 'not_started',
    muscleGroups: ['Спина', 'Бицепс'],
    equipment: ['Турник'],
    restSec: 120,
    sets: [
      createSet('set-p1', 'working', undefined, 8),
      createSet('set-p2', 'working', undefined, 7),
      createSet('set-p3', 'working', undefined, 6),
    ],
    history: [],
  },
  {
    id: 'ex-squat',
    name: 'Приседания',
    status: 'not_started',
    muscleGroups: ['Квадрицепс', 'Ягодицы'],
    equipment: ['Штанга'],
    restSec: 120,
    sets: [
      createSet('set-s1', 'working', 100, 10),
      createSet('set-s2', 'working', 100, 9),
      createSet('set-s3', 'working', 100, 8),
    ],
    history: [],
  },
  {
    id: 'ex-lat-pulldown',
    name: 'Тяга верхнего блока',
    status: 'not_started',
    muscleGroups: ['Спина', 'Бицепс'],
    equipment: ['Блоки'],
    restSec: 90,
    sets: [
      createSet('set-l1', 'working', 55, 12),
      createSet('set-l2', 'working', 55, 11),
      createSet('set-l3', 'working', 55, 10),
    ],
    history: [],
  },
  {
    id: 'ex-flyes',
    name: 'Разведения гантелей',
    status: 'not_started',
    muscleGroups: ['Грудь'],
    equipment: ['Гантели', 'Скамья'],
    restSec: 90,
    sets: [
      createSet('set-f1', 'working', 14, 14),
      createSet('set-f2', 'working', 14, 13),
      createSet('set-f3', 'working', 14, 12),
    ],
    history: [],
  },
];

export const mockFullBodyASession: WorkoutSession = {
  id: 'session-full-body-a',
  title: 'Full Body A',
  date: today,
  unit: 'kg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  exercises: mockFullBodyAExercises,
};

export const mockProgressionRecommendation = {
  target: '82.5 кг × 6–8',
  reason: 'Верхняя граница повторений достигнута в двух тренировках.',
};