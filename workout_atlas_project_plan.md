# Workout Atlas: UX/UI Ideology, Protocol And Implementation Plan

## 1. Core Idea

Рабочее название проекта: **Workout Atlas**.

Идеология: **тело как инженерный атлас нагрузки**.

Это не очередной фитнес-дневник с карточками, мотивационными цитатами и случайными графиками. Приложение ощущается как личный черный атлас тела: пользователь быстро отмечает подходы на поверхности, а при раскрытии видит слои — техника, мышцы, история, RPE, 1ПМ, прогрессия.

Главный принцип:

> Снаружи — минимум действий. Внутри — глубина, если она нужна.

Визуальный язык:

- темный фон;
- тонкие векторные линии;
- схемы мышц;
- контурные карты тела;
- emerald/accent-green как цвет активности;
- zinc/slate как базовая среда;
- без фитнес-клише, без яркого спортивного маркетинга;
- интерфейс похож не на соцсеть, а на спокойную лабораторию прогресса.

## 2. Why It Feels Different

Большинство фитнес-приложений делают одно из двух:

- либо слишком простой трекер подходов;
- либо перегруженный кабинет аналитики.

Workout Atlas должен работать как **прогрессивный стек**:

1. **Surface Layer** — простой список упражнений на сегодня.
2. **Tracking Layer** — раскрытие упражнения и быстрый ввод подходов.
3. **Atlas Layer** — глубокий слой истории, техники, 1ПМ, RPE и медиа.

Пользователь не видит сложность, пока сам её не попросит.

## 3. Visual Metaphor

Основная метафора: **атлас / скан / чертеж тела**.

Не планеты, не космос, не RPG, не типичный gym-bro UI.

Приложение должно ощущаться как:

- темный технический дневник;
- карта нагрузки;
- рентген/скан тела;
- спокойная система контроля прогресса.

### Vector Art Direction

Основные визуальные элементы должны быть векторными:

- контур человека;
- подсветка мышечных групп;
- схемы упражнений;
- линии движения;
- мини-иконки оборудования;
- онбординг-иллюстрации;
- пустые состояния;
- импорт из AI;
- предупреждения по технике.

Приоритет форматов:

1. SVG
2. Lottie
3. WebP
4. PNG
5. JPG
6. GIF только как fallback

SVG — основной формат, потому что он:

- хорошо масштабируется;
- легкий;
- выглядит чисто на темной теме;
- подходит для схем техники;
- легко перекрашивается под тему;
- отлично подходит для AI Import Protocol через ссылки.

## 4. Product Philosophy

### 4.1 No Motivation Spam

Приложение не должно говорить пользователю: "Ты сможешь", "Давай еще", "Будь зверем".

Тон приложения:

- спокойный;
- точный;
- уверенный;
- без давления;
- без клоунады.

Примеры микрокопи:

- "Сегодня: 5 упражнений"
- "Последний раз: 100 кг x 5"
- "Нагрузка растет"
- "RPE выше обычного"
- "Есть запас"
- "Техника важнее веса"

### 4.2 Fast First, Deep Second

Во время тренировки пользователь не должен думать.

Главные действия:

- открыть тренировку;
- тапнуть упражнение;
- скопировать прошлый раз;
- поправить вес/повторы;
- отметить подход;
- закрыть телефон.

Аналитика должна быть доступна, но не должна мешать.

### 4.3 AI-Native Import

Приложение должно быть спроектировано так, будто пользователь постоянно приносит тренировки из нейронки.

Не "ручной ввод всего", а:

1. попросил AI составить план;
2. получил JSON/Markdown;
3. вставил в приложение;
4. увидел превью;
5. импортировал.

Это важная фича, которая отличает проект.

## 5. Main UX Model

## 5.1 Level 1: Surface Layer

Главный экран показывает только самое нужное:

- название тренировки;
- прогресс на сегодня;
- список упражнений;
- статус каждого упражнения;
- нижняя основная кнопка, если нужна.

Exercise row:

- название;
- короткий статус;
- тонкий progress marker;
- опционально маленькая иконка мышцы/оборудования.

Статусы:

- `not_started` — пустой контур;
- `in_progress` — emerald pulse;
- `done` — заполненный emerald marker;
- `skipped` — muted marker.

## 5.2 Level 2: Tracking Layer

Обычный тап по упражнению раскрывает панель подходов.

Внутри:

- список подходов;
- placeholder прошлого раза;
- кнопка "Copy last";
- инпут веса;
- инпут повторов;
- RPE optional;
- чекбокс выполнения.

Важно:

- прошлые значения должны быть блеклыми;
- текущий ввод должен быть контрастным;
- completed set должен визуально "закрываться";
- добавление подхода должно быть доступно, но не кричать.

## 5.3 Level 3: Atlas Layer

Долгий тап по упражнению открывает modal/bottom sheet.

Внутри:

- история по датам;
- все прошлые подходы;
- расчет 1ПМ;
- RPE;
- техника;
- muscle map;
- exercise demo;
- заметки;
- предупреждения;
- динамика нагрузки.

Это не основной экран, а "глубокий слой".

## 6. Core Screens

## 6.1 Onboarding

Цель онбординга — объяснить идеологию приложения.

Экран 1: "Твой атлас нагрузки"

- векторный силуэт тела;
- тонкие линии;
- подсвеченные мышцы;
- короткий текст: "Отмечай подходы быстро. Раскрывай аналитику, когда нужно."

Экран 2: "Прогрессивный стек"

- три слоя:
  - Today
  - Sets
  - Atlas
- визуально как раскрывающиеся пластины/слои.

Экран 3: "Импорт из AI"

- поле с JSON/MD;
- стрелка в превью тренировки;
- маленькие SVG-карточки упражнений.

Экран 4: "Начни с простой тренировки"

- выбор:
  - создать вручную;
  - вставить из AI;
  - использовать демо.

## 6.2 Today Workout

Главный экран.

Секции:

- header;
- daily progress;
- exercise list;
- expanded tracking panel;
- quick finish action.

## 6.3 Import Workout

Экран импорта.

Секции:

- paste area;
- format detection;
- validation result;
- preview;
- warnings;
- import button.

Поддержка:

- JSON;
- Markdown;
- future: shared file / clipboard auto-detect.

## 6.4 Library

Список шаблонов тренировок.

Секции:

- templates;
- imported from AI;
- recent;
- favorites.

## 6.5 Exercise Atlas

Экран или modal с глубокой информацией по упражнению.

Секции:

- exercise header;
- demo SVG/image;
- muscle map;
- history;
- 1RM;
- RPE notes;
- safety notes.

## 6.6 Settings

Минимально:

- kg/lb;
- theme;
- default rest timer;
- AI import prompt;
- data export/import.

## 7. Design System

## 7.1 Colors

Base:

- `#020617` slate-950
- `#09090B` zinc-950
- `#18181B` zinc-900
- `#27272A` zinc-800
- `#3F3F46` zinc-700

Text:

- `#FAFAFA` zinc-50
- `#D4D4D8` zinc-300
- `#A1A1AA` zinc-400
- `#71717A` zinc-500

Accent:

- `#10B981` emerald-500
- `#34D399` emerald-400
- `#064E3B` emerald-950

Warning:

- `#F59E0B` amber-500

Danger:

- `#EF4444` red-500

## 7.2 Typography

Use system font first.

Hierarchy:

- screen title: 28 / 34 / bold
- section title: 18 / 24 / semibold
- row title: 16 / 22 / semibold
- body: 14 / 20 / regular
- caption: 12 / 16 / medium

No huge hero text inside the app.

## 7.3 Components

Core components:

- `AppScreen`
- `AppHeader`
- `ProgressStrip`
- `ExerciseRow`
- `ExerciseStatusPill`
- `SetRow`
- `NumberInput`
- `CheckButton`
- `AtlasModal`
- `MediaAssetView`
- `MuscleMap`
- `ImportTextArea`
- `ValidationBanner`
- `WorkoutPreview`

## 7.4 Animation Rules

Animations should feel like layers opening.

Use:

- Reanimated layout transitions;
- LayoutAnimation for MVP if simpler;
- subtle opacity;
- height expansion;
- emerald pulse only for active/in-progress state.

Avoid:

- bouncing;
- excessive spring;
- confetti;
- loud gamification.

Motion examples:

- exercise expands downward like opening a technical drawer;
- completed set fades into low-contrast locked row;
- modal slides from bottom as "Atlas Layer";
- muscle highlight softly appears.

## 8. Data Model

## 8.1 TypeScript Interfaces

```ts
export type WorkoutUnit = "kg" | "lb";

export type ExerciseStatus =
  | "not_started"
  | "in_progress"
  | "done"
  | "skipped";

export interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  unit: WorkoutUnit;
  exercises: Exercise[];
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  status: ExerciseStatus;
  muscleGroups?: string[];
  equipment?: string[];
  restSec?: number;
  notes?: string;
  techniqueTips?: string[];
  safetyNotes?: string[];
  media?: MediaAsset[];
  sets: WorkoutSet[];
  history?: ExerciseHistoryEntry[];
}

export interface WorkoutSet {
  id: string;
  type: "warmup" | "working" | "drop" | "amrap" | "failure" | "backoff";
  weight?: number;
  reps?: number;
  previousWeight?: number;
  previousReps?: number;
  rpe?: number;
  completed: boolean;
  notes?: string;
}

export interface ExerciseHistoryEntry {
  id: string;
  date: string;
  sets: WorkoutSet[];
}

export interface MediaAsset {
  id?: string;
  role:
    | "thumbnail"
    | "exercise_demo"
    | "muscle_map"
    | "equipment"
    | "technique"
    | "cover"
    | "fallback";
  format: "svg" | "lottie" | "webp" | "png" | "jpg" | "gif";
  url: string;
  alt: string;
  priority?: number;
  width?: number;
  height?: number;
  theme?: "dark" | "light" | "any";
}
```

## 9. 1RM Formula

Use Epley formula:

```ts
export function calculateOneRepMax(weight: number, reps: number): number {
  return weight * (1 + reps / 30);
}
```

Display:

- rounded to 1 decimal;
- only when weight and reps are valid;
- mark it as estimated.

## 10. Import Protocol

The app should support `Workout Import Protocol v1.0`.

Main principles:

- JSON is strict mode.
- Markdown is human-friendly mode.
- All media comes through links.
- SVG has highest priority.
- Import always shows preview before saving.
- Invalid images should not block workout import.

Minimum valid JSON:

```json
{
  "protocolVersion": "1.0",
  "documentType": "workout_template",
  "title": "Full Body A",
  "language": "ru",
  "unit": "kg",
  "exercises": [
    {
      "name": "Жим лежа",
      "sets": [
        {
          "type": "working",
          "weight": 80,
          "reps": 6,
          "rpe": 8
        }
      ]
    }
  ]
}
```

Validation rules:

- reject unsupported protocol versions;
- reject empty title;
- reject missing unit;
- reject exercises without name;
- reject RPE outside 1-10;
- warn when media is missing;
- warn when media is not SVG;
- warn when no rest time is provided.

## 11. Suggested Tech Stack

Core:

- Expo
- React Native
- TypeScript
- NativeWind
- React Native Reanimated
- React Native Gesture Handler
- React Native SVG
- Zustand
- Zod
- Expo SQLite or MMKV

Recommended:

- `zod` for import validation;
- `zustand` for simple local state;
- `expo-sqlite` for persisted workouts/history;
- `react-native-svg` for vector illustrations;
- `lottie-react-native` later, not required for MVP.

## 12. Suggested Folder Structure

```txt
src/
  app/
    navigation/
    providers/
  features/
    workout/
      components/
        WorkoutScreen.tsx
        ExerciseRow.tsx
        SetRow.tsx
        AnalyticsModal.tsx
        ProgressStrip.tsx
      model/
        workout.types.ts
        workout.mock.ts
        workout.store.ts
        workout.selectors.ts
      utils/
        oneRepMax.ts
        workoutStatus.ts
    import/
      components/
        ImportWorkoutScreen.tsx
        ImportTextArea.tsx
        WorkoutPreview.tsx
        ValidationBanner.tsx
      model/
        import.types.ts
        import.schema.ts
        import.parser.ts
        markdown.parser.ts
    media/
      components/
        MediaAssetView.tsx
        SvgFallback.tsx
      utils/
        mediaPriority.ts
  shared/
    ui/
      AppScreen.tsx
      AppText.tsx
      AppButton.tsx
      NumberInput.tsx
      CheckButton.tsx
    theme/
      colors.ts
      spacing.ts
```

## 13. Implementation Iterations

Каждую итерацию можно отдавать Codex отдельным промптом.

## Iteration 1: Project Setup

Goal: поднять базовый Expo TypeScript проект с NativeWind.

Prompt:

```md
Ты работаешь в Expo React Native TypeScript проекте.

Настрой базовую структуру приложения для фитнес-трекера Workout Atlas.

Требования:
- Expo + TypeScript.
- NativeWind для Tailwind-стилей.
- Создай папки src/features, src/shared, src/app.
- Добавь базовый AppScreen.
- Добавь темную тему в стиле zinc/slate/emerald.
- Не добавляй сложную навигацию пока.
- Главный экран должен рендерить WorkoutScreen.
- Проверь, что проект запускается.
```

## Iteration 2: Core Types And Mock Data

Goal: создать доменные типы и моковые данные.

Prompt:

```md
Создай доменную модель для Workout Atlas.

Нужно:
- WorkoutSession.
- Exercise.
- WorkoutSet.
- ExerciseHistoryEntry.
- MediaAsset.
- ExerciseStatus.
- calculateOneRepMax.
- моковую тренировку на сегодня.

Моки должны включать:
- 4-5 упражнений.
- прошлые значения weight/reps.
- историю по датам.
- media assets с SVG URL и fallback WebP URL.

Код должен быть TypeScript.
```

## Iteration 3: Main Workout Screen

Goal: сделать Surface Layer.

Prompt:

```md
Реализуй главный экран WorkoutScreen.

Требования:
- темный минималистичный UI;
- FlatList для упражнений;
- header с названием тренировки и прогрессом;
- ExerciseRow показывает только название и статус;
- статус зависит от completed sets;
- NativeWind стили;
- без аналитики на этом шаге;
- аккуратные отступы и touch-friendly строки.
```

## Iteration 4: Expandable Tracking Layer

Goal: сделать раскрытие упражнения по тапу.

Prompt:

```md
Добавь Tracking Layer в WorkoutScreen.

Требования:
- обычный тап по ExerciseRow раскрывает упражнение вниз;
- используй Reanimated layout transition или LayoutAnimation;
- внутри показывай SetRow;
- SetRow содержит:
  - номер подхода;
  - placeholder прошлого раза: "100 кг x 5";
  - TextInput для веса;
  - TextInput для повторов;
  - checkbox выполнения;
  - кнопку Copy Last;
- keyboardType="numeric";
- completed set должен визуально становиться спокойнее;
- данные должны обновляться в локальном состоянии.
```

## Iteration 5: Atlas Modal

Goal: сделать глубокий слой аналитики.

Prompt:

```md
Добавь Atlas Layer.

Требования:
- long press по упражнению открывает Modal или bottom sheet;
- компонент AnalyticsModal;
- внутри:
  - название упражнения;
  - muscle groups;
  - equipment;
  - история подходов по датам;
  - расчет 1ПМ по формуле weight * (1 + reps / 30);
  - поле RPE от 1 до 10;
  - techniqueTips;
  - safetyNotes;
- дизайн как глубокий слой атласа;
- закрытие по кнопке и по backdrop.
```

## Iteration 6: Media System

Goal: научить приложение показывать картинки по протоколу.

Prompt:

```md
Реализуй MediaAssetView.

Требования:
- принимает MediaAsset[];
- выбирает лучший asset по priority и format;
- SVG имеет самый высокий приоритет;
- поддержи react-native-svg для SVG URL;
- если картинка не загрузилась, показывай SvgFallback;
- fallback не должен ломать экран;
- добавь отображение exercise_demo и muscle_map в AnalyticsModal.
```

## Iteration 7: Import Protocol Types And Zod Validation

Goal: создать строгий JSON import protocol.

Prompt:

```md
Реализуй Workout Import Protocol v1.0.

Нужно:
- import.types.ts;
- import.schema.ts на Zod;
- validateWorkoutImport(input: unknown);
- transformImportToWorkoutSession();

Правила:
- JSON должен быть строгим;
- protocolVersion только "1.0";
- documentType: workout_template | workout_session | program;
- unit: kg | lb;
- RPE от 1 до 10;
- media URL должен быть валидным URL;
- отсутствие картинок не ошибка, а warning;
- не-SVG картинки дают warning.
```

## Iteration 8: Markdown Import Parser

Goal: сделать мягкий парсинг Markdown.

Prompt:

```md
Добавь Markdown импорт для Workout Import Protocol.

Нужно:
- markdown.parser.ts;
- parseWorkoutMarkdown(markdown: string);
- поддержать:
  - # title
  - Type:
  - Unit:
  - Goal:
  - Difficulty:
  - Duration:
  - ## Exercise name
  - Muscles:
  - Equipment:
  - Rest:
  - Image:
  - MuscleMap:
  - Sets:
  - строки вида "- working: 80 kg x 6 @RPE 8"

Markdown парсер может быть не идеальным, но должен стабильно работать на нашем формате.
```

## Iteration 9: Import Workout Screen

Goal: сделать пользовательский экран вставки JSON/MD.

Prompt:

```md
Реализуй ImportWorkoutScreen.

UX:
- большое поле вставки JSON/Markdown;
- auto-detect формата;
- кнопка Validate;
- превью тренировки;
- список warnings/errors;
- кнопка Import;
- импорт не должен сохраняться без подтверждения.

После импорта пользователь должен видеть тренировку на WorkoutScreen.
```

## Iteration 10: App Navigation

Goal: собрать базовую навигацию.

Prompt:

```md
Добавь простую навигацию приложения.

Экраны:
- Today Workout;
- Import;
- Library;
- Settings.

Можно использовать Expo Router или React Navigation, выбери то, что уже есть в проекте.

Дизайн:
- темная тема;
- минимальный bottom nav или top-level tabs;
- Today должен быть главным экраном.
```

## Iteration 11: Persistence

Goal: сохранять тренировки и историю.

Prompt:

```md
Добавь persistence layer.

Требования:
- сохранять текущую тренировку;
- сохранять imported templates;
- сохранять историю completed sessions;
- использовать SQLite или MMKV;
- не ломать существующие типы;
- добавить repository/service слой;
- состояние UI должно восстанавливаться после перезапуска приложения.
```

## Iteration 12: Onboarding

Goal: сделать фирменный вход в продукт.

Prompt:

```md
Сделай onboarding для Workout Atlas.

Идеология:
- тело как инженерный атлас нагрузки;
- progressive stack;
- AI import.

Экраны:
1. Твой атлас нагрузки.
2. Быстрый трекинг.
3. Глубокий слой аналитики.
4. Импорт тренировок из AI.

Используй векторный стиль:
- contour body;
- muscle highlights;
- emerald lines;
- dark background;
- no stock photos.

Если нет готовых SVG, сделай временные vector placeholders через react-native-svg.
```

## Iteration 13: Polish

Goal: довести ощущение продукта.

Prompt:

```md
Проведи UI polish Workout Atlas.

Проверь:
- отступы;
- читаемость на маленьких экранах;
- touch targets;
- состояния empty/loading/error;
- клавиатуру в TextInput;
- темную тему;
- анимации раскрытия;
- modal behavior;
- import validation UX.

Ничего не рефактори глобально без необходимости.
```

## Iteration 14: Tests

Goal: добавить базовую проверку логики.

Prompt:

```md
Добавь тесты для ключевой логики.

Покрыть:
- calculateOneRepMax;
- status calculation;
- media priority selection;
- JSON import validation;
- Markdown parser на базовом примере;
- transformImportToWorkoutSession.

Не тестируй визуальные детали, только важную бизнес-логику.
```

## 14. AI Prompt For Generating Workouts

Этот prompt можно показывать пользователю внутри приложения.

```md
Сгенерируй тренировку в формате Workout Import Protocol v1.0.

Требования:
- Верни только валидный JSON.
- Не добавляй текст до или после JSON.
- protocolVersion: "1.0".
- documentType: "workout_template".
- language: "ru".
- unit: "kg".
- У тренировки должны быть title, goal, difficulty, estimatedDurationMin.
- У каждого упражнения должны быть name, muscleGroups, equipment, restSec, sets.
- У каждого упражнения добавь images.
- Для images используй ссылки.
- В первую очередь используй SVG.
- Если SVG недоступен, добавь WebP или PNG fallback.
- У каждого подхода укажи type, weight, reps и rpe.
- RPE должен быть от 1 до 10.
- Если упражнение технически сложное, добавь safetyNotes.
- Не добавляй опасные рекомендации.
```

## 15. MVP Scope

MVP должен включать:

- Today Workout screen;
- список упражнений;
- раскрытие подходов;
- ручной ввод веса/повторов;
- copy last;
- completed checkbox;
- analytics modal;
- 1RM;
- RPE;
- JSON import;
- preview before import;
- local persistence.

Не включать в MVP:

- социальные функции;
- аккаунты;
- облако;
- сложные графики;
- платные подписки;
- генерацию тренировок внутри приложения;
- видео;
- wearable-интеграции.

## 16. Post-MVP Ideas

После MVP:

- программы на 4-12 недель;
- авто-прогрессия;
- deload logic;
- адаптация по RPE;
- графики нагрузки;
- rest timer;
- supersets;
- body map analytics;
- экспорт данных;
- AI coach notes;
- Android widgets;
- локальная генерация prompt для AI.

## 17. Definition Of Done

Проект можно считать первым рабочим прототипом, когда:

- пользователь может открыть тренировку;
- быстро отметить все подходы;
- посмотреть историю упражнения;
- увидеть estimated 1RM;
- импортировать тренировку через JSON;
- увидеть preview до сохранения;
- перезапустить приложение и не потерять данные;
- интерфейс выглядит цельно в стиле Workout Atlas.

