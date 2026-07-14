import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { TrackingModePicker } from '../../../shared/ui/TrackingModePicker';
import { useSettingsStore } from '../model/settings.store';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { AiImportPromptSection } from './AiImportPromptSection';
import { DataBackupSection } from './DataBackupSection';
import { ProgressionSection } from './ProgressionSection';

export function SettingsScreen() {
  const router = useRouter();
  const unit = useSettingsStore((s) => s.unit);
  const restTimerSec = useSettingsStore((s) => s.restTimerSec);
  const trackingMode = useSettingsStore((s) => s.trackingMode);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const setRestTimerSec = useSettingsStore((s) => s.setRestTimerSec);
  const setTrackingMode = useSettingsStore((s) => s.setTrackingMode);
  const resetOnboarding = useSettingsStore((s) => s.resetOnboarding);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);
  const openPlanEditor = useWorkoutStore((s) => s.openPlanEditor);

  const handleEditPlan = () => {
    openPlanEditor();
    router.push('/(tabs)');
  };

  const handleShowOnboarding = () => {
    resetOnboarding();
    router.replace('/onboarding');
  };

  return (
    <AppScreen scrollable>
      <AppText variant="title" className="mb-1">
        Настройки
      </AppText>
      <AppText variant="body" muted className="mb-6">
        Тренировки, таймер и AI-импорт
      </AppText>

      <View className="mb-6">
        <AppText variant="section" className="mb-1">
          Единицы веса
        </AppText>
        <AppText variant="caption" muted className="mb-3">
          Используются в тренировках и в промпте для AI
        </AppText>
        <View className="flex-row gap-2">
          <AppButton
            compact
            label="kg"
            variant={unit === 'kg' ? 'primary' : 'secondary'}
            onPress={() => setUnit('kg')}
            className="flex-1"
          />
          <AppButton
            compact
            label="lb"
            variant={unit === 'lb' ? 'primary' : 'secondary'}
            onPress={() => setUnit('lb')}
            className="flex-1"
          />
        </View>
      </View>

      <View className="mb-6">
        <AppText variant="section" className="mb-1">
          Режим отметки
        </AppText>
        <AppText variant="caption" muted className="mb-3">
          Быстро — одним тапом. Детально — вес, повторы и подходы.
        </AppText>
        <TrackingModePicker value={trackingMode} onChange={setTrackingMode} />
      </View>

      <View className="mb-6">
        <AppText variant="section" className="mb-1">
          План недели
        </AppText>
        <AppText variant="caption" muted className="mb-3">
          Сейчас: {weeklyProgram.name}. Назначь тренировки на каждый день.
        </AppText>
        <AppButton label="Изменить план недели" variant="secondary" onPress={handleEditPlan} />
      </View>

      <ProgressionSection />

      <View className="mb-6">
        <AppText variant="section" className="mb-1">
          Таймер отдыха
        </AppText>
        <AppText variant="caption" muted className="mb-3">
          Значение по умолчанию между подходами
        </AppText>
        <View className="flex-row flex-wrap gap-2">
          {[60, 90, 120, 180].map((seconds) => (
            <AppButton
              key={seconds}
              compact
              label={`${seconds} сек`}
              variant={restTimerSec === seconds ? 'primary' : 'secondary'}
              onPress={() => setRestTimerSec(seconds)}
              className="flex-1 min-w-[72px]"
            />
          ))}
        </View>
      </View>

      <DataBackupSection />

      <AiImportPromptSection unit={unit} />

      <AppButton label="Показать онбординг снова" variant="ghost" onPress={handleShowOnboarding} />
    </AppScreen>
  );
}