import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { RadioCard } from '../../../shared/ui/RadioCard';
import { ProgressDots } from '../../../shared/ui/animations/ProgressDots';
import { BrandMark } from '../../../shared/ui/animations/BrandMark';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/tokens';
import { usePersistHydration } from '../../../shared/hooks/usePersistHydration';
import { useSettingsStore } from '../../settings/model/settings.store';
import {
  useOnboardingStore,
  type TrainingGoal,
  type ProgramChoice,
} from '../model/onboarding.store';

const GOALS: { id: TrainingGoal; label: string }[] = [
  { id: 'muscle', label: 'Набрать мышцы' },
  { id: 'strength', label: 'Стать сильнее' },
  { id: 'weight_loss', label: 'Снизить вес' },
  { id: 'maintain', label: 'Поддерживать форму' },
];

const PROGRAM_CHOICES: { id: ProgramChoice; label: string; description: string }[] = [
  { id: 'import', label: 'Да, добавлю свою', description: 'Текст, Markdown или JSON' },
  { id: 'generate', label: 'Нет, помогите создать', description: 'Короткий мастер' },
  { id: 'manual', label: 'Соберу вручную', description: 'Пустой шаблон' },
];

export function OnboardingScreen() {
  const router = useRouter();
  const hydrated = usePersistHydration(useSettingsStore.persist);
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);
  const step = useOnboardingStore((s) => s.step);
  const goal = useOnboardingStore((s) => s.goal);
  const programChoice = useOnboardingStore((s) => s.programChoice);
  const setStep = useOnboardingStore((s) => s.setStep);
  const setGoal = useOnboardingStore((s) => s.setGoal);
  const setProgramChoice = useOnboardingStore((s) => s.setProgramChoice);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);
  const setProfileGoal = useSettingsStore((s) => s.setGoal);
  const resetOnboardingFlow = useOnboardingStore((s) => s.reset);

  useEffect(() => {
    if (hydrated && onboardingComplete) {
      router.replace('/(tabs)');
    }
  }, [hydrated, onboardingComplete, router]);

  const skipOnboarding = () => {
    completeOnboarding();
    resetOnboardingFlow();
    router.replace('/(tabs)');
  };

  const finish = (path: string) => {
    if (goal) setProfileGoal(goal);
    completeOnboarding();
    resetOnboardingFlow();
    router.replace(path as never);
  };

  if (onboardingComplete) {
    return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
  }

  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bgPrimary, alignItems: 'center', justifyContent: 'center' }}>
        <BrandMark size={72} />
      </View>
    );
  }

  const goNext = () => setStep(step + 1);
  const goBack = () => setStep(Math.max(0, step - 1));

  return (
    <SafeScreen className="justify-between pb-6">
      <View className="pt-3">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <View className="w-9 h-9 rounded-full items-center justify-center mr-2" style={{ backgroundColor: colors.accentSurfaceStrong }}>
              <Ionicons name="barbell-outline" size={19} color={colors.accentBright} />
            </View>
            <AppText variant="bodyL">Workout Atlas</AppText>
          </View>
          <View className="flex-row items-center gap-4">
            <Pressable onPress={skipOnboarding} hitSlop={8} accessibilityRole="button" accessibilityLabel="Пропустить настройку">
              <AppText variant="caption" className="text-accent">
                Пропустить
              </AppText>
            </Pressable>
            <AppText variant="caption" muted>{step + 1} / 3</AppText>
          </View>
        </View>
        <ProgressDots count={3} activeIndex={step} />
      </View>

      <FadeSlideIn key={step} className="flex-1 justify-center">
        {step === 0 ? (
          <View className="items-center rounded-xl border border-border-subtle p-6" style={{ backgroundColor: colors.surfacePrimary }}>
            <View className="mb-8">
              <BrandMark />
            </View>
            <AppText variant="display" className="text-center mb-3">
              Focus Flow
            </AppText>
            <AppText variant="bodyL" muted className="text-center mb-2">
              Всегда понятно, что делать сейчас.
            </AppText>
            <AppText variant="bodyM" muted className="text-center max-w-[300px]">
              Соберём программу, проведём через каждый подход и покажем реальный прогресс — спокойно и без лишних шагов.
            </AppText>
          </View>
        ) : null}

        {step === 1 ? (
          <View className="rounded-xl border border-border-subtle p-4" style={{ backgroundColor: colors.surfaceSoft }}>
            <AppText variant="h1" className="mb-2">
              Для чего ты тренируешься?
            </AppText>
            <AppText variant="bodyM" muted className="mb-6">
              Выбери главную цель. Её можно изменить позже.
            </AppText>
            {GOALS.map((item) => (
              <RadioCard
                key={item.id}
                label={item.label}
                selected={goal === item.id}
                onPress={() => setGoal(item.id)}
              />
            ))}
          </View>
        ) : null}

        {step === 2 ? (
          <View className="rounded-xl border border-border-subtle p-4" style={{ backgroundColor: colors.surfaceSoft }}>
            <AppText variant="h1" className="mb-2">
              У тебя уже есть программа?
            </AppText>
            <AppText variant="bodyM" muted className="mb-6">
              Выбери удобный способ начать.
            </AppText>
            {PROGRAM_CHOICES.map((item) => (
              <RadioCard
                key={item.id}
                label={item.label}
                description={item.description}
                selected={programChoice === item.id}
                onPress={() => setProgramChoice(item.id)}
              />
            ))}
          </View>
        ) : null}
      </FadeSlideIn>

      <View>
        {step === 0 ? (
          <>
            <AppButton label="Начать настройку" onPress={goNext} className="mb-3" />
            <AppButton label="Пропустить — настрою позже" variant="ghost" onPress={skipOnboarding} />
          </>
        ) : null}

        {step === 1 ? (
          <View className="flex-row gap-3">
            <AppButton label="Назад" variant="ghost" onPress={goBack} className="flex-1" />
            <AppButton label="Далее" onPress={goNext} disabled={!goal} className="flex-[2]" />
          </View>
        ) : null}

        {step === 2 ? (
          <View className="flex-row gap-3">
            <AppButton label="Назад" variant="ghost" onPress={goBack} className="flex-1" />
            <AppButton
              label="Продолжить"
              disabled={!programChoice}
              onPress={() => {
                if (programChoice === 'import') finish('/import');
                else if (programChoice === 'generate') finish('/generator');
                else finish('/manual-program');
              }}
              className="flex-[2]"
            />
          </View>
        ) : null}
      </View>
    </SafeScreen>
  );
}
