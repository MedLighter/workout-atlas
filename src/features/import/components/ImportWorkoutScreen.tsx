import { useMemo, useState } from 'react';
import { View } from 'react-native';
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
import { useWorkoutStore } from '../../workout/model/workout.store';
import { useSettingsStore } from '../../settings/model/settings.store';
import { AiImportPromptSection } from '../../settings/components/AiImportPromptSection';

const SAMPLE_JSON = `{
  "protocolVersion": "1.0",
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
  const unit = useSettingsStore((s) => s.unit);
  const [input, setInput] = useState('');
  const [validated, setValidated] = useState<ReturnType<typeof parseImportInput> | null>(null);
  const setCurrentSession = useWorkoutStore((s) => s.setCurrentSession);
  const addTemplate = useWorkoutStore((s) => s.addTemplate);

  const format = useMemo(() => detectImportFormat(input), [input]);

  const handleValidate = () => {
    setValidated(parseImportInput(input));
  };

  const handleImport = () => {
    if (!validated?.success || !validated.document) return;
    const session = transformImportToWorkoutSession(validated.document);
    addTemplate(session);
    setCurrentSession(session);
    router.push('/(tabs)');
  };

  return (
    <AppScreen scrollable>
      <AppText variant="title" className="mb-1">
        Импорт
      </AppText>
      <AppText variant="body" muted className="mb-4">
        Вставь JSON или Markdown. Сначала проверь — потом импортируй.
      </AppText>

      <AiImportPromptSection unit={unit} variant="compact" />

      <ImportTextArea value={input} onChangeText={setInput} format={format} />

      <View className="flex-row gap-2 mb-4">
        <AppButton
          compact
          variant="ghost"
          label="Пример"
          onPress={() => setInput(SAMPLE_JSON)}
          className="flex-1"
        />
        <AppButton
          compact
          variant="secondary"
          label="Проверить"
          onPress={handleValidate}
          className="flex-1"
        />
      </View>

      {validated ? (
        <>
          <ValidationBanner errors={validated.errors} warnings={validated.warnings} />
          {validated.success && validated.document ? (
            <>
              <WorkoutPreview document={validated.document} />
              <AppButton label="Импортировать" onPress={handleImport} />
            </>
          ) : null}
        </>
      ) : null}
    </AppScreen>
  );
}