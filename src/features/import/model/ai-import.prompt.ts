import type { WorkoutUnit } from '../../workout/model/workout.types';

export const AI_IMPORT_PROTOCOL_VERSION = '1.0';

export function buildAiImportPrompt(unit: WorkoutUnit = 'kg'): string {
  return `Сгенерируй тренировку в формате Workout Import Protocol v${AI_IMPORT_PROTOCOL_VERSION}.

Контекст:
- Приложение: Workout Atlas (трекер силовых тренировок).
- Ответ будет импортирован автоматически — нужен строго валидный формат.

Требования к ответу:
- Верни только валидный JSON без markdown-обёртки и без комментариев.
- Не добавляй текст до или после JSON.
- protocolVersion: "${AI_IMPORT_PROTOCOL_VERSION}".
- documentType: "workout_template".
- language: "ru".
- unit: "${unit}".

Поля тренировки (обязательные и рекомендуемые):
- title — название тренировки.
- goal — цель (сила, гипертрофия, выносливость и т.д.).
- difficulty — beginner | intermediate | advanced.
- estimatedDurationMin — ориентировочная длительность в минутах.

Поля каждого упражнения:
- name — название упражнения.
- muscleGroups — массив мышечных групп.
- equipment — массив оборудования.
- restSec — отдых между подходами в секундах.
- techniqueTips — 1-3 коротких совета по технике (опционально).
- safetyNotes — предупреждения для сложных упражнений (опционально).
- images — массив медиа-ссылок (см. ниже).
- sets — массив подходов.

Поля каждого подхода:
- type — warmup | working | drop | amrap | failure | backoff.
- weight — рабочий вес в ${unit}.
- reps — количество повторений.
- rpe — субъективная нагрузка от 1 до 10.

Медиа (images):
- Используй только публичные URL-ссылки.
- Для каждого упражнения добавь минимум 1 image с role: "exercise_demo".
- По возможности добавь role: "muscle_map".
- format: svg предпочтителен, иначе webp или png.
- Пример: { "role": "exercise_demo", "format": "svg", "url": "https://...", "alt": "Жим лежа" }

Безопасность:
- Не добавляй опасные или экстремальные рекомендации.
- Для тяжёлых базовых упражнений добавляй safetyNotes.

Если пользователь не указал детали — предложи сбалансированную тренировку на 4-6 упражнений.`;
}

export function buildAiImportJsonExample(unit: WorkoutUnit = 'kg'): string {
  return JSON.stringify(
    {
      protocolVersion: AI_IMPORT_PROTOCOL_VERSION,
      documentType: 'workout_template',
      title: 'Full Body A',
      language: 'ru',
      unit,
      goal: 'Сила и гипертрофия',
      difficulty: 'intermediate',
      estimatedDurationMin: 75,
      exercises: [
        {
          name: 'Жим лежа',
          muscleGroups: ['Грудь', 'Трицепс', 'Передние дельты'],
          equipment: ['Штанга', 'Скамья'],
          restSec: 180,
          techniqueTips: ['Лопатки сведены', 'Контролируемое опускание'],
          safetyNotes: ['Используй страховку на тяжёлых подходах'],
          images: [
            {
              role: 'exercise_demo',
              format: 'svg',
              url: 'https://example.com/bench-press.svg',
              alt: 'Жим лежа',
            },
            {
              role: 'muscle_map',
              format: 'svg',
              url: 'https://example.com/chest-muscles.svg',
              alt: 'Мышцы груди',
            },
          ],
          sets: [
            { type: 'warmup', weight: 40, reps: 10, rpe: 5 },
            { type: 'working', weight: 80, reps: 6, rpe: 8 },
            { type: 'working', weight: 80, reps: 6, rpe: 8.5 },
          ],
        },
        {
          name: 'Приседания со штангой',
          muscleGroups: ['Квадрицепс', 'Ягодицы'],
          equipment: ['Штанга', 'Стойки'],
          restSec: 180,
          safetyNotes: ['Следи за нейтральной спиной'],
          images: [
            {
              role: 'exercise_demo',
              format: 'webp',
              url: 'https://example.com/squat.webp',
              alt: 'Приседания',
            },
          ],
          sets: [
            { type: 'warmup', weight: 60, reps: 8, rpe: 5 },
            { type: 'working', weight: 100, reps: 5, rpe: 8 },
          ],
        },
      ],
    },
    null,
    2,
  );
}

export function buildAiImportMarkdownExample(unit: WorkoutUnit = 'kg'): string {
  return `# Full Body A
Type: workout_template
Unit: ${unit}
Goal: Сила и гипертрофия
Difficulty: intermediate
Duration: 75

## Жим лежа
Muscles: Грудь, Трицепс, Передние дельты
Equipment: Штанга, Скамья
Rest: 180
Image: https://example.com/bench-press.svg
MuscleMap: https://example.com/chest-muscles.svg
Sets:
- warmup: 40 ${unit} x 10 @RPE 5
- working: 80 ${unit} x 6 @RPE 8
- working: 80 ${unit} x 6 @RPE 8.5

## Приседания со штангой
Muscles: Квадрицепс, Ягодицы
Equipment: Штанга, Стойки
Rest: 180
Image: https://example.com/squat.webp
Sets:
- warmup: 60 ${unit} x 8 @RPE 5
- working: 100 ${unit} x 5 @RPE 8`;
}

export const AI_IMPORT_FIELD_REFERENCE = `Справочник полей Workout Import Protocol v1.0

Корневой объект:
- protocolVersion (обяз.) — только "1.0"
- documentType (обяз.) — workout_template | workout_session | program
- title (обяз.) — строка, не пустая
- unit (обяз.) — kg | lb
- language — код языка, напр. "ru"
- goal — цель тренировки
- difficulty — уровень сложности
- estimatedDurationMin — число, минуты
- exercises (обяз.) — массив, минимум 1 упражнение

Упражнение:
- name (обяз.) — название
- muscleGroups — массив строк
- equipment — массив строк
- restSec — число, секунды отдыха
- notes — заметки
- techniqueTips — массив советов
- safetyNotes — массив предупреждений
- images — массив медиа-объектов
- sets — массив подходов

Подход (set):
- type — warmup | working | drop | amrap | failure | backoff
- weight — число
- reps — число
- rpe — число 1-10
- notes — строка

Медиа (image):
- role — exercise_demo | muscle_map | thumbnail | equipment | technique | cover | fallback
- format — svg | webp | png | jpg | gif | lottie
- url (обяз.) — публичная ссылка
- alt — описание для доступности`;

export const AI_IMPORT_VALIDATION_RULES = `Правила валидации в Workout Atlas

Ошибки (импорт будет отклонён):
- Неподдерживаемая protocolVersion
- Пустой title
- Отсутствует unit
- Упражнение без name
- RPE вне диапазона 1-10
- Невалидный JSON

Предупреждения (импорт пройдёт, но с заметками):
- Нет restSec у упражнения
- Нет images у упражнения
- Нет SVG — будет использован fallback (webp/png)

Поддерживаемые форматы вставки:
- JSON (строгий режим, рекомендуется для AI)
- Markdown (человекочитаемый режим)`;

export const AI_IMPORT_WORKFLOW_STEPS = [
  {
    step: 1,
    title: 'Скопируй комплект',
    description: 'Нажми «Скопировать всё» — промпт, схему и примеры попадут в буфер.',
  },
  {
    step: 2,
    title: 'Вставь в AI',
    description: 'Открой ChatGPT, Claude или Gemini. Вставь текст и опиши желаемую тренировку.',
  },
  {
    step: 3,
    title: 'Импортируй ответ',
    description: 'Скопируй JSON-ответ AI и вставь на вкладке Import → Validate → Import.',
  },
] as const;

export interface AiImportSection {
  id: string;
  title: string;
  description: string;
  getContent: (unit: WorkoutUnit) => string;
}

export const AI_IMPORT_SECTIONS: AiImportSection[] = [
  {
    id: 'prompt',
    title: 'Промпт для AI',
    description: 'Основная инструкция для генерации тренировки',
    getContent: buildAiImportPrompt,
  },
  {
    id: 'json-example',
    title: 'Пример JSON',
    description: 'Полный образец валидного документа',
    getContent: buildAiImportJsonExample,
  },
  {
    id: 'markdown-example',
    title: 'Пример Markdown',
    description: 'Альтернативный человекочитаемый формат',
    getContent: buildAiImportMarkdownExample,
  },
  {
    id: 'fields',
    title: 'Справочник полей',
    description: 'Все поля протокола и допустимые значения',
    getContent: () => AI_IMPORT_FIELD_REFERENCE,
  },
  {
    id: 'validation',
    title: 'Правила валидации',
    description: 'Что блокирует импорт, а что даёт предупреждения',
    getContent: () => AI_IMPORT_VALIDATION_RULES,
  },
];

export function buildAiImportCopyPackage(unit: WorkoutUnit = 'kg'): string {
  const sections = [
    `Workout Atlas — AI Import Kit`,
    `Protocol: Workout Import Protocol v${AI_IMPORT_PROTOCOL_VERSION}`,
    `Unit: ${unit}`,
    '',
    '---',
    'КАК ИСПОЛЬЗОВАТЬ',
    '1. Вставь этот текст целиком в AI-чат.',
    '2. Добавь описание тренировки: цель, уровень, оборудование, длительность.',
    '3. Скопируй JSON-ответ и вставь в Workout Atlas → Import.',
    '',
    ...AI_IMPORT_SECTIONS.flatMap((section) => [
      '---',
      section.title.toUpperCase(),
      section.getContent(unit),
    ]),
  ];

  return sections.join('\n');
}

// Backward-compatible export used by settings store
export const AI_IMPORT_PROMPT = buildAiImportPrompt();