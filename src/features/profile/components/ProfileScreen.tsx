import { type ReactNode } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import { useSettingsStore } from '../../settings/model/settings.store';
import { AiImportPromptSection } from '../../settings/components/AiImportPromptSection';
import { DataBackupSection } from '../../settings/components/DataBackupSection';
import { ProgressionSection } from '../../settings/components/ProgressionSection';
import { StaggerItem } from '../../../shared/ui/animations/StaggerItem';

const GOAL_LABELS = {
  muscle: 'Набрать мышцы',
  strength: 'Стать сильнее',
  weight_loss: 'Снизить вес',
  maintain: 'Поддерживать форму',
};

export function ProfileScreen() {
  const router = useRouter();
  const unit = useSettingsStore((s) => s.unit);
  const restTimerSec = useSettingsStore((s) => s.restTimerSec);
  const goal = useSettingsStore((s) => s.goal);
  const skipWorkoutPrep = useSettingsStore((s) => s.skipWorkoutPrep);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const vibrationEnabled = useSettingsStore((s) => s.vibrationEnabled);
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const setUnit = useSettingsStore((s) => s.setUnit);
  const setRestTimerSec = useSettingsStore((s) => s.setRestTimerSec);
  const setSkipWorkoutPrep = useSettingsStore((s) => s.setSkipWorkoutPrep);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const setVibrationEnabled = useSettingsStore((s) => s.setVibrationEnabled);
  const setReduceMotion = useSettingsStore((s) => s.setReduceMotion);
  const resetOnboarding = useSettingsStore((s) => s.resetOnboarding);

  return (
    <SafeScreen scrollable reserveTabBar>
      <StaggerItem index={0}>
        <View className="pt-2 mb-5">
          <AppText variant="h1">Профиль</AppText>
          <AppText variant="caption" muted className="mt-1">
            Единицы, таймер, уведомления
          </AppText>
        </View>
      </StaggerItem>

      <Section title="Тренировки" enterIndex={1}>
        {goal ? (
          <AppText variant="bodyM" muted className="mb-3">Цель: {GOAL_LABELS[goal]}</AppText>
        ) : null}
        <AppText variant="caption" muted className="mb-2">Единицы веса</AppText>
        <View className="flex-row gap-2 mb-4">
          <AppButton compact label="kg" variant={unit === 'kg' ? 'primary' : 'secondary'} onPress={() => setUnit('kg')} className="flex-1" />
          <AppButton compact label="lb" variant={unit === 'lb' ? 'primary' : 'secondary'} onPress={() => setUnit('lb')} className="flex-1" />
        </View>
        <AppText variant="caption" muted className="mb-2">Таймер отдыха: {restTimerSec} сек</AppText>
        <View className="flex-row gap-2 mb-4">
          {[60, 90, 120, 180].map((sec) => (
            <AppButton key={sec} compact label={`${sec}`} variant={restTimerSec === sec ? 'primary' : 'secondary'} onPress={() => setRestTimerSec(sec)} className="flex-1" />
          ))}
        </View>
        <AppText variant="caption" muted className="mb-2">
          Пропускать экран «Перед стартом»
        </AppText>
        <AppButton
          compact
          label={skipWorkoutPrep ? 'Вкл' : 'Выкл'}
          variant="secondary"
          onPress={() => setSkipWorkoutPrep(!skipWorkoutPrep)}
          className="mb-4 self-start"
        />
        <ProgressionSection />
      </Section>

      <Section title="Интерфейс" enterIndex={2}>
        <AppButton compact label={soundEnabled ? 'Звук: вкл' : 'Звук: выкл'} variant="secondary" onPress={() => setSoundEnabled(!soundEnabled)} className="mb-2" />
        <AppButton compact label={vibrationEnabled ? 'Вибрация: вкл' : 'Вибрация: выкл'} variant="secondary" onPress={() => setVibrationEnabled(!vibrationEnabled)} className="mb-2" />
        <AppButton compact label={reduceMotion ? 'Меньше анимаций: вкл' : 'Меньше анимаций: выкл'} variant="secondary" onPress={() => setReduceMotion(!reduceMotion)} />
      </Section>

      <Section title="Данные" enterIndex={3}>
        <DataBackupSection />
        <AiImportPromptSection unit={unit} variant="compact" />
        <AppButton label="Пройти онбординг снова" variant="ghost" onPress={() => { resetOnboarding(); router.replace('/onboarding'); }} className="mt-4" />
      </Section>
    </SafeScreen>
  );
}

function Section({
  title,
  children,
  enterIndex = 0,
}: {
  title: string;
  children: ReactNode;
  enterIndex?: number;
}) {
  return (
    <StaggerItem index={enterIndex} className="mb-8">
      <AppText variant="h3" className="mb-3">{title}</AppText>
      <AppCard>{children}</AppCard>
    </StaggerItem>
  );
}
