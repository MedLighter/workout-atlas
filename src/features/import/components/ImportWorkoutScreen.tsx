import { useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { ImportTextArea } from './ImportTextArea';
import { ValidationBanner } from './ValidationBanner';
import { WorkoutPreview } from './WorkoutPreview';
import {
  detectImportFormat,
  parseImportInput,
  transformImportToWorkoutSession,
} from '../model/import.parser';
import { isProgramImportDocument } from '../model/import.types';
import {
  buildWeeklyProgramFromImport,
  mapImportProgressionToSettings,
  transformProgramWorkouts,
} from '../model/import.program';
import { buildAiImportProgramJsonExample } from '../model/ai-import.prompt';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { useSettingsStore } from '../../settings/model/settings.store';
import { AiImportPromptSection } from '../../settings/components/AiImportPromptSection';
import { IMPORT_ACTION_BAR_HEIGHT, IMPORT_SCROLL_END_PADDING } from '../../../shared/theme/layout';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { useScrollToFocusedInput } from '../../../shared/hooks/useScrollToFocusedInput';

const SAMPLE_TEMPLATE_JSON = `{
  "protocolVersion": "1.1",
  "documentType": "workout_template",
  "title": "Full Body A",
  "language": "ru",
  "unit": "kg",
  "exercises": [
    {
      "name": "Жим лежа",
      "muscleGroups": ["Грудь", "Трицепс"],
      "equipment": ["Штанга"],
      "restSec": 180,
      "sets": [
        { "type": "working", "weight": 80, "reps": 6, "rpe": 8 }
      ]
    }
  ]
}`;

export function ImportWorkoutScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const unit = useSettingsStore((s) => s.unit);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const applyProgressionPlan = useSettingsStore((s) => s.applyProgressionPlan);
  const [input, setInput] = useState('');
  const [validated, setValidated] = useState<ReturnType<typeof parseImportInput> | null>(null);
  const setCurrentSession = useWorkoutStore((s) => s.setCurrentSession);
  const addTemplate = useWorkoutStore((s) => s.addTemplate);
  const importWeeklyProgram = useWorkoutStore((s) => s.importWeeklyProgram);

  const format = useMemo(() => detectImportFormat(input), [input]);
  const canImport = validated?.success && !!validated.document;
  const isProgram =
    canImport && validated?.document && isProgramImportDocument(validated.document);
  const { scrollToFocusedInput } = useScrollToFocusedInput(
    canImport ? IMPORT_ACTION_BAR_HEIGHT : 0,
  );

  const handleValidate = () => {
    setValidated(parseImportInput(input));
  };

  const handleClear = () => {
    setInput('');
    setValidated(null);
  };

  const handleImport = () => {
    if (!validated?.success || !validated.document) return;

    if (isProgramImportDocument(validated.document)) {
      const templates = transformProgramWorkouts(validated.document);
      const weeklyProgram = buildWeeklyProgramFromImport(validated.document, templates);

      importWeeklyProgram(templates, weeklyProgram);
      setUnit(validated.document.unit);
      applyProgressionPlan(mapImportProgressionToSettings(validated.document.progression));
      router.replace('/(tabs)/plan');
      return;
    }

    const session = transformImportToWorkoutSession(validated.document);
    addTemplate(session);
    setCurrentSession(session);
    setUnit(validated.document.unit);
    router.replace('/(tabs)/plan');
  };

  const importLabel = isProgram ? 'Импортировать программу' : 'Импортировать';

  return (
    <View className="flex-1 bg-zinc-950" style={{ minHeight: 0 }}>
      <View className="flex-1" style={{ minHeight: 0 }}>
        <AppScreen
          scrollable
          scrollRef={scrollRef}
          extraBottomSpacing={canImport ? IMPORT_SCROLL_END_PADDING : 0}
        >
          <FadeSlideIn>
          <AppText variant="title" className="mb-1">
            Импорт
          </AppText>
          <AppText variant="body" muted className="mb-4">
            Вставь JSON программы на неделю (рекомендуется) или одной тренировки. Сначала проверь —
            потом импортируй.
          </AppText>

          <AiImportPromptSection unit={unit} variant="compact" />

          <ImportTextArea
            value={input}
            onChangeText={(text) => {
              setInput(text);
              if (validated) setValidated(null);
            }}
            onClear={handleClear}
            format={format}
            onInputFocus={(layout) => scrollToFocusedInput(scrollRef, layout)}
          />

          <View className="flex-row gap-2 mb-2">
            <AppButton
              compact
              variant="ghost"
              label="Неделя"
              onPress={() => {
                setInput(buildAiImportProgramJsonExample(unit));
                setValidated(null);
              }}
              className="flex-1"
            />
            <AppButton
              compact
              variant="ghost"
              label="1 треня"
              onPress={() => {
                setInput(SAMPLE_TEMPLATE_JSON);
                setValidated(null);
              }}
              className="flex-1"
            />
          </View>

          <View className="mb-4">
            <AppButton compact variant="secondary" label="Проверить" onPress={handleValidate} />
          </View>

          {validated ? (
            <>
              <ValidationBanner
                errors={validated.errors}
                warnings={validated.warnings}
                success={validated.success}
              />
              {validated.success && validated.document ? (
                <WorkoutPreview document={validated.document} />
              ) : null}
            </>
          ) : null}
          </FadeSlideIn>
        </AppScreen>
      </View>

      {canImport ? (
        <Animated.View
          entering={FadeInUp.duration(280)}
          className="shrink-0 px-5 pt-3 pb-4 bg-zinc-950 border-t border-zinc-800"
        >
          <AppButton label={importLabel} onPress={handleImport} />
        </Animated.View>
      ) : null}
    </View>
  );
}