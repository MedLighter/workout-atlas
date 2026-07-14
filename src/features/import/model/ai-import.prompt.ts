import type { WorkoutUnit } from '../../workout/model/workout.types';

export const AI_IMPORT_PROTOCOL_VERSION = '1.1';

export function buildAiImportPrompt(unit: WorkoutUnit = 'kg'): string {
  return `Сгенерируй программу тренировок в формате Workout Import Protocol v${AI_IMPORT_PROTOCOL_VERSION}.

Контекст:
- Приложение: Workout Atlas (трекер силовых тренировок).
- Ответ будет импортирован автоматически — нужен строго валидный формат.

Требования к ответу:
- Верни только валидный JSON без markdown-обёртки и без комментариев.
- Не добавляй текст до или после JSON.
- protocolVersion: "${AI_IMPORT_PROTOCOL_VERSION}".
- documentType: "program" (предпочтительно для недельного плана) или "workout_template" (одна тренировка).
- language: "ru".
- unit: "${unit}".

Если documentType = "program" (рекомендуется):
- title — название программы, напр. "Full Body 3x".
- progression — план прогрессии (см. ниже).
- schedule — расписание по дням недели.
- workouts — массив тренировок программы.

Расписание (schedule):
- weekday: 0=Пн, 1=Вт, 2=Ср, 3=Чт, 4=Пт, 5=Сб, 6=Вс.
- type: "workout" | "rest".
- workoutTitle — обязателен для workout, должен совпадать с workouts[].title.

Прогрессия (progression):
- enabled: true | false
- mode: "linear" | "rpe"
- weightIncrementKg / weightIncrementLb — шаг повышения веса
- targetRpe — целевой RPE для режима rpe (1-10)
- cadence — как часто повышать нагрузку:
  - "every_session" — каждую тренировку с этим упражнением
  - "weekly" — не чаще раза в 7 дней
  - "biweekly" — не чаще раза в 14 дней
  - "every_n_sessions" — каждые N завершённых тренировок (укажи cadenceEverySessions)

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

Прогрессия (важно для Workout Atlas):
- Указывай rpe на каждом рабочем подходе — приложение использует RPE для авто-прогрессии.
- weight и reps в шаблоне — стартовая база первой недели, не максимум на отказ.
- Для базовых упражнений делай 2-3 рабочих подхода с одинаковым весом и повторами.
- Используй одинаковые name упражнений в разных тренировках одной программы (для связки истории).
- Добавляй notes у упражнения с краткой логикой прогрессии, напр.: "Старт 80×6 @RPE 8, дальше +2.5 кг если все подходы закрыты".
- Не завышай стартовый вес: рабочие подходы должны ощущаться как RPE 7-8.5.

Безопасность:
- Не добавляй опасные или экстремальные рекомендации.
- Для тяжёлых базовых упражнений добавляй safetyNotes.

Если пользователь не указал детали — предложи программу на неделю (2-4 тренировки) с расписанием и прогрессией.`;
}

export function buildAiImportProgressionGuide(unit: WorkoutUnit = 'kg'): string {
  return `Прогрессия в Workout Atlas

Как приложение использует импорт:
1. Первый раз пользователь выполняет веса из шаблона.
2. После завершения тренировки веса сохраняются в историю.
3. На следующей тренировке с тем же упражнением (то же name) Atlas предлагает новую цель.
4. Блок progression в program автоматически настраивает режим и интервал прогрессии.

Что важно заложить в JSON:
- rpe на каждом working-подходе (1-10).
- Одинаковые name для одного и того же упражнения в программе.
- notes с логикой прогрессии: стартовая база, шаг, условие повышения.
- progression.cadence — интервал между повышениями (every_session / weekly / biweekly / every_n_sessions).

Режимы прогрессии:
- linear: все рабочие подходы закрыты → +шаг к весу.
- rpe: RPE ниже цели → +шаг; выше → снижение или удержание.

Интервалы (cadence):
- every_session — повышать при каждой тренировке с упражнением.
- weekly — не чаще 1 раза в 7 дней.
- biweekly — не чаще 1 раза в 14 дней.
- every_n_sessions + cadenceEverySessions: 2 — каждые 2 завершённые тренировки.

Рекомендуемая формулировка в notes:
"База: 80 ${unit} × 6 @RPE 8. Если все рабочие подходы выполнены — следующий раз 82.5 ${unit} × 6."`;
}

export function buildAiImportJsonExample(unit: WorkoutUnit = 'kg'): string {
  return JSON.stringify(
    {
      protocolVersion: AI_IMPORT_PROTOCOL_VERSION,
      documentType: 'workout_template',
      title: 'Full Body A (single)',
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
          notes:
            `База: 80 ${unit} × 6 @RPE 8. Если все рабочие подходы закрыты — следующий раз 82.5 ${unit} × 6.`,
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
          notes: `База: 100 ${unit} × 5 @RPE 8. Прогрессия +2.5 ${unit} при RPE ≤ 7 на всех рабочих.`,
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

function buildBenchExercise(unit: WorkoutUnit) {
  return {
    name: 'Жим лежа',
    muscleGroups: ['Грудь', 'Трицепс', 'Передние дельты'],
    equipment: ['Штанга', 'Скамья'],
    restSec: 180,
    notes: `База: 80 ${unit} × 6 @RPE 8. Если все рабочие закрыты — +2.5 ${unit}.`,
    sets: [
      { type: 'warmup', weight: 40, reps: 10, rpe: 5 },
      { type: 'working', weight: 80, reps: 6, rpe: 8 },
      { type: 'working', weight: 80, reps: 6, rpe: 8.5 },
    ],
  };
}

function buildSquatExercise(unit: WorkoutUnit) {
  return {
    name: 'Приседания со штангой',
    muscleGroups: ['Квадрицепс', 'Ягодицы'],
    equipment: ['Штанга', 'Стойки'],
    restSec: 180,
    notes: `База: 100 ${unit} × 5 @RPE 8. Прогрессия +2.5 ${unit} при RPE ≤ 7.`,
    sets: [
      { type: 'warmup', weight: 60, reps: 8, rpe: 5 },
      { type: 'working', weight: 100, reps: 5, rpe: 8 },
    ],
  };
}

export function buildAiImportProgramJsonExample(unit: WorkoutUnit = 'kg'): string {
  return JSON.stringify(
    {
      protocolVersion: AI_IMPORT_PROTOCOL_VERSION,
      documentType: 'program',
      title: 'Full Body 3x',
      language: 'ru',
      unit,
      goal: 'Сила и гипертрофия',
      progression: {
        enabled: true,
        mode: 'linear',
        weightIncrementKg: unit === 'kg' ? 2.5 : undefined,
        weightIncrementLb: unit === 'lb' ? 5 : undefined,
        targetRpe: 8,
        cadence: 'weekly',
      },
      schedule: [
        { weekday: 0, type: 'workout', workoutTitle: 'Full Body A' },
        { weekday: 1, type: 'rest' },
        { weekday: 2, type: 'workout', workoutTitle: 'Full Body B' },
        { weekday: 3, type: 'rest' },
        { weekday: 4, type: 'workout', workoutTitle: 'Full Body A' },
        { weekday: 5, type: 'rest' },
        { weekday: 6, type: 'rest' },
      ],
      workouts: [
        {
          title: 'Full Body A',
          goal: 'База',
          estimatedDurationMin: 75,
          exercises: [buildBenchExercise(unit), buildSquatExercise(unit)],
        },
        {
          title: 'Full Body B',
          goal: 'База',
          estimatedDurationMin: 70,
          exercises: [buildSquatExercise(unit), buildBenchExercise(unit)],
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
Notes: База 80 ${unit} × 6 @RPE 8, дальше +2.5 ${unit} если все рабочие закрыты
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

export const AI_IMPORT_FIELD_REFERENCE = `Справочник полей Workout Import Protocol v1.1

Корневой объект (workout_template / workout_session):
- protocolVersion (обяз.) — "1.0" | "1.1"
- documentType (обяз.) — workout_template | workout_session | program
- title (обяз.) — строка, не пустая
- unit (обяз.) — kg | lb
- language — код языка, напр. "ru"
- goal — цель тренировки
- difficulty — уровень сложности
- estimatedDurationMin — число, минуты
- exercises (обяз.) — массив, минимум 1 упражнение

Корневой объект (program):
- title — название программы
- progression — план прогрессии (см. ниже)
- schedule — расписание по дням недели
- workouts — массив тренировок

schedule[]:
- weekday (обяз.) — 0=Пн … 6=Вс
- type (обяз.) — workout | rest
- workoutTitle — для workout, ссылка на workouts[].title

progression:
- enabled — true | false
- mode — linear | rpe
- weightIncrementKg / weightIncrementLb — шаг веса
- targetRpe — 1-10
- cadence — every_session | weekly | biweekly | every_n_sessions
- cadenceEverySessions — число, если cadence = every_n_sessions

workouts[]:
- title (обяз.)
- exercises (обяз.) — как в workout_template

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
- weight — число (стартовая база, не 1ПМ)
- reps — число
- rpe — число 1-10 (обязательно на working для прогрессии)
- notes — строка

Прогрессия:
- notes на уровне упражнения — логика повышения веса
- одинаковые name упражнений в программе — для связки истории
- working-подходы с rpe — для режима прогрессии по RPE

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
- Нет rpe на рабочих подходах — прогрессия по RPE будет менее точной
- Нет notes с логикой прогрессии — пользователь не увидит план роста нагрузки

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
    title: 'Пример JSON (одна тренировка)',
    description: 'Шаблон workout_template',
    getContent: buildAiImportJsonExample,
  },
  {
    id: 'program-example',
    title: 'Пример JSON (программа на неделю)',
    description: 'program + schedule + progression',
    getContent: buildAiImportProgramJsonExample,
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
  {
    id: 'progression',
    title: 'Прогрессия нагрузки',
    description: 'Как AI должен закладывать рост веса в шаблон',
    getContent: buildAiImportProgressionGuide,
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
    '4. После первой тренировки Atlas сам предложит следующую цель по весу.',
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