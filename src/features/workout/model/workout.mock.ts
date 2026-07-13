import type { WorkoutSession } from './workout.types';

const today = new Date().toISOString().split('T')[0];

export const mockWorkoutSession: WorkoutSession = {
  id: 'session-demo-1',
  title: 'Full Body A',
  date: today,
  unit: 'kg',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  exercises: [
    {
      id: 'ex-1',
      name: 'Жим лежа',
      status: 'not_started',
      muscleGroups: ['Грудь', 'Трицепс', 'Передние дельты'],
      equipment: ['Штанга', 'Скамья'],
      restSec: 180,
      techniqueTips: [
        'Лопатки сведены и прижаты к скамье',
        'Контролируй опускание штанги',
      ],
      safetyNotes: ['Не отрывай таз от скамьи', 'Используй страховку на тяжёлых подходах'],
      media: [
        {
          id: 'media-1-svg',
          role: 'exercise_demo',
          format: 'svg',
          url: 'https://raw.githubusercontent.com/wrkout/svg-exercises/main/exercises/bench-press.svg',
          alt: 'Жим лежа — схема',
          priority: 1,
        },
        {
          id: 'media-1-webp',
          role: 'fallback',
          format: 'webp',
          url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
          alt: 'Жим лежа — fallback',
          priority: 10,
        },
      ],
      sets: [
        {
          id: 'set-1-1',
          type: 'warmup',
          previousWeight: 60,
          previousReps: 10,
          completed: false,
        },
        {
          id: 'set-1-2',
          type: 'working',
          previousWeight: 80,
          previousReps: 6,
          completed: false,
        },
        {
          id: 'set-1-3',
          type: 'working',
          previousWeight: 80,
          previousReps: 5,
          completed: false,
        },
      ],
      history: [
        {
          id: 'hist-1',
          date: '2026-07-01',
          sets: [
            { id: 'h1', type: 'working', weight: 77.5, reps: 6, completed: true, rpe: 8 },
            { id: 'h2', type: 'working', weight: 77.5, reps: 5, completed: true, rpe: 8.5 },
          ],
        },
        {
          id: 'hist-2',
          date: '2026-06-28',
          sets: [
            { id: 'h3', type: 'working', weight: 75, reps: 6, completed: true, rpe: 7.5 },
          ],
        },
      ],
    },
    {
      id: 'ex-2',
      name: 'Приседания со штангой',
      status: 'not_started',
      muscleGroups: ['Квадрицепс', 'Ягодицы', 'Кор'],
      equipment: ['Штанга', 'Стойки'],
      restSec: 240,
      techniqueTips: ['Колени следуют за носками', 'Глубина — параллель или ниже'],
      safetyNotes: ['Разминай колени перед рабочими подходами'],
      media: [
        {
          role: 'muscle_map',
          format: 'svg',
          url: 'https://raw.githubusercontent.com/wrkout/svg-exercises/main/muscles/legs.svg',
          alt: 'Карта мышц — ноги',
          priority: 1,
        },
      ],
      sets: [
        {
          id: 'set-2-1',
          type: 'working',
          previousWeight: 100,
          previousReps: 5,
          completed: false,
        },
        {
          id: 'set-2-2',
          type: 'working',
          previousWeight: 100,
          previousReps: 5,
          completed: false,
        },
        {
          id: 'set-2-3',
          type: 'working',
          previousWeight: 100,
          previousReps: 4,
          completed: false,
        },
      ],
      history: [
        {
          id: 'hist-3',
          date: '2026-07-01',
          sets: [
            { id: 'h4', type: 'working', weight: 100, reps: 5, completed: true, rpe: 8 },
          ],
        },
      ],
    },
    {
      id: 'ex-3',
      name: 'Тяга в наклоне',
      status: 'not_started',
      muscleGroups: ['Спина', 'Бицепс'],
      equipment: ['Штанга'],
      restSec: 150,
      techniqueTips: ['Спина прямая', 'Тяни к поясу'],
      sets: [
        {
          id: 'set-3-1',
          type: 'working',
          previousWeight: 70,
          previousReps: 8,
          completed: false,
        },
        {
          id: 'set-3-2',
          type: 'working',
          previousWeight: 70,
          previousReps: 7,
          completed: false,
        },
      ],
      history: [],
    },
    {
      id: 'ex-4',
      name: 'Жим гантелей сидя',
      status: 'not_started',
      muscleGroups: ['Плечи', 'Трицепс'],
      equipment: ['Гантели', 'Скамья'],
      restSec: 120,
      sets: [
        {
          id: 'set-4-1',
          type: 'working',
          previousWeight: 24,
          previousReps: 10,
          completed: false,
        },
        {
          id: 'set-4-2',
          type: 'working',
          previousWeight: 24,
          previousReps: 9,
          completed: false,
        },
      ],
      history: [],
    },
    {
      id: 'ex-5',
      name: 'Планка',
      status: 'not_started',
      muscleGroups: ['Кор'],
      equipment: ['Коврик'],
      restSec: 60,
      sets: [
        {
          id: 'set-5-1',
          type: 'working',
          previousReps: 60,
          completed: false,
        },
      ],
      history: [],
    },
  ],
};