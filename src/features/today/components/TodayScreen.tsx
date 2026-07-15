import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { LoadingPulse } from '../../../shared/ui/animations/LoadingPulse';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { StaggerItem } from '../../../shared/ui/animations/StaggerItem';
import { PressableScale } from '../../../shared/ui/PressableScale';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { useSettingsStore } from '../../settings/model/settings.store';
import { getMondayFirstWeekday, WEEKDAY_NAMES } from '../../workout/model/workout.schedule';
import { resolveTodayState, getNextWorkoutDay } from '../utils/todayStatus';
import { WorkoutPrepCard } from './WorkoutPrepCard';
import { WorkoutSummaryScreen } from '../../focus-flow/components/WorkoutSummaryScreen';
import { colors } from '../../../shared/theme/tokens';

export function TodayScreen() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(
    () => useWorkoutStore.getState().hydrated || useWorkoutStore.persist.hasHydrated(),
  );

  const storeHydrated = useWorkoutStore((s) => s.hydrated);
  const templates = useWorkoutStore((s) => s.templates);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);
  const currentSession = useWorkoutStore((s) => s.currentSession);
  const workoutPhase = useWorkoutStore((s) => s.workoutPhase);
  const loadWorkoutForWeekday = useWorkoutStore((s) => s.loadWorkoutForWeekday);
  const prepareWorkout = useWorkoutStore((s) => s.prepareWorkout);
  const cancelWorkoutPrep = useWorkoutStore((s) => s.cancelWorkoutPrep);
  const startWorkout = useWorkoutStore((s) => s.startWorkout);
  const resumeWorkout = useWorkoutStore((s) => s.resumeWorkout);
  const startUnplannedWorkout = useWorkoutStore((s) => s.startUnplannedWorkout);
  const initSession = useWorkoutStore((s) => s.initSession);

  const skipPrep = useSettingsStore((s) => s.skipWorkoutPrep);
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const vibrationEnabled = useSettingsStore((s) => s.vibrationEnabled);
  const restTimerSec = useSettingsStore((s) => s.restTimerSec);

  const todayWeekday = getMondayFirstWeekday();
  const todayPlan = weeklyProgram.days.find((d) => d.weekday === todayWeekday);
  const state = resolveTodayState({
    hydrated,
    templates,
    weeklyProgram,
    workoutPhase,
    currentSession,
  });

  useEffect(() => {
    if (storeHydrated || useWorkoutStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useWorkoutStore.persist.onFinishHydration(() => setHydrated(true));
    const fallback = setTimeout(() => setHydrated(true), 2500);
    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, [storeHydrated]);

  useEffect(() => {
    if (hydrated) initSession();
  }, [hydrated, initSession]);

  useEffect(() => {
    if (state === 'active') {
      router.replace('/workout/focus');
    }
  }, [state, router]);

  const handleStart = () => {
    if (!currentSession) loadWorkoutForWeekday(todayWeekday);
    if (skipPrep) {
      startWorkout(true);
      router.push('/workout/focus');
    } else {
      prepareWorkout();
    }
  };

  if (state === 'loading') {
    return (
      <SafeScreen reserveTabBar className="justify-center items-center">
        <LoadingPulse />
      </SafeScreen>
    );
  }

  if (state === 'summary') {
    return <WorkoutSummaryScreen />;
  }

  if (state === 'empty') {
    return (
      <SafeScreen reserveTabBar>
        <EmptyState
          title="Начнём с первой программы"
          description="Ответь на несколько вопросов или добавь готовый план."
          actionLabel="Создать программу"
          onAction={() => router.push('/generator')}
        />
        <View className="px-5 -mt-4">
          <AppButton
            label="Импортировать"
            variant="secondary"
            onPress={() => router.push('/import')}
            className="w-full max-w-[320px] self-center mb-3"
          />
          <AppButton
            label="Собрать вручную"
            variant="ghost"
            onPress={() => router.push('/manual-program')}
            className="self-center"
          />
        </View>
      </SafeScreen>
    );
  }

  if (state === 'rest') {
    const next = getNextWorkoutDay(weeklyProgram, todayWeekday);
    return (
      <SafeScreen reserveTabBar>
        <FadeSlideIn>
          <AppText variant="h1" className="mb-2">
            Сегодня восстановление
          </AppText>
          {next ? (
            <AppText variant="bodyM" muted className="mb-8">
              Следующая тренировка:{'\n'}
              {next.day.title}
              {next.offset === 1 ? ' · завтра' : ` · через ${next.offset} дн.`}
            </AppText>
          ) : null}
          <AppButton
            label="Посмотреть следующую тренировку"
            variant="secondary"
            onPress={() => router.push('/(tabs)/plan')}
            className="mb-3"
          />
          <AppButton
            label="Внеплановая тренировка"
            variant="ghost"
            onPress={() => {
              startUnplannedWorkout();
              prepareWorkout();
            }}
          />
        </FadeSlideIn>
      </SafeScreen>
    );
  }

  if (state === 'paused') {
    return (
      <SafeScreen reserveTabBar className="justify-center">
        <FadeSlideIn>
        <AppText variant="h2" className="text-center mb-2">
          Тренировка на паузе
        </AppText>
        <AppText variant="bodyM" muted className="text-center mb-8">
          {currentSession?.title}
        </AppText>
        <AppButton
          label="Продолжить"
          onPress={() => {
            resumeWorkout();
            router.push('/workout/focus');
          }}
          className="mb-3"
        />
        <AppButton
          label="Завершить тренировку"
          variant="secondary"
          onPress={() => router.push('/workout/focus')}
        />
        </FadeSlideIn>
      </SafeScreen>
    );
  }

  if (state === 'prep' && currentSession) {
    return (
      <SafeScreen reserveTabBar>
        <WorkoutPrepCard
          session={currentSession}
          restTimerSec={restTimerSec}
          soundEnabled={soundEnabled}
          vibrationEnabled={vibrationEnabled}
          onStart={() => {
            startWorkout();
            router.push('/workout/focus');
          }}
          onBack={cancelWorkoutPrep}
        />
      </SafeScreen>
    );
  }

  const previewExercises = currentSession?.exercises.slice(0, 3) ?? [];

  return (
    <SafeScreen reserveTabBar scrollable>
      <StaggerItem index={0}>
        <View className="flex-row items-center justify-between mb-5 pt-2">
          <View>
            <AppText variant="h1">Сегодня</AppText>
            <AppText variant="caption" muted className="mt-1">
              {WEEKDAY_NAMES[todayWeekday]} · тренировка по плану
            </AppText>
          </View>
          <PressableScale
            accessibilityLabel="Открыть план"
            onPress={() => router.push('/(tabs)/plan')}
            className="w-11 h-11 rounded-md items-center justify-center border border-border-subtle"
            style={{ backgroundColor: colors.surfacePrimary }}
          >
            <Ionicons name="calendar-clear-outline" size={20} color={colors.textPrimary} />
          </PressableScale>
        </View>
      </StaggerItem>

      <AppCard elevated flush className="mb-4" enterIndex={1}>
          <LinearGradient
            colors={['rgba(12,84,69,0.58)', 'rgba(10,28,28,0.4)', colors.surfacePrimary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 18, width: '100%' }}
          >
            <AppText variant="h2" className="mb-1">
              {currentSession?.title ?? todayPlan?.title ?? 'Тренировка'}
            </AppText>
            <AppText variant="bodyM" muted className="mb-5">
              {currentSession?.exercises.length ?? 0} упражнений · ~{' '}
              {Math.round((currentSession?.exercises.length ?? 5) * 11)} мин
            </AppText>

            <View className="rounded-md border border-border-subtle overflow-hidden mb-4" style={{ backgroundColor: 'rgba(6,12,14,0.58)' }}>
              {previewExercises.map((ex, index) => (
                <FadeSlideIn
                  key={ex.id}
                  delay={100 + index * 32}
                  className={`flex-row items-center px-3 py-3 ${index < previewExercises.length - 1 ? 'border-b border-border-subtle' : ''}`}
                >
                  <Ionicons
                    name={index === 0 ? 'barbell-outline' : index === 1 ? 'body-outline' : 'fitness-outline'}
                    size={18}
                    color={index === 0 ? colors.accentBright : colors.textSecondary}
                  />
                  <AppText variant="bodyM" className="flex-1 ml-3" muted={index > 0}>
                    {ex.name}
                  </AppText>
                  {index === 0 ? (
                    <AppText variant="caption" className="text-accent">
                      сначала
                    </AppText>
                  ) : (
                    <AppText variant="caption" muted>
                      {ex.sets.length}×
                    </AppText>
                  )}
                </FadeSlideIn>
              ))}
              {(currentSession?.exercises.length ?? 0) > 3 ? (
                <View className="flex-row items-center px-3 py-3 border-t border-border-subtle">
                  <Ionicons name="add" size={17} color={colors.textMuted} />
                  <AppText variant="caption" muted className="ml-3">
                    ещё {(currentSession?.exercises.length ?? 0) - 3} упражнения
                  </AppText>
                </View>
              ) : null}
            </View>

            <AppButton label="Начать тренировку" onPress={handleStart} />
            {!skipPrep ? (
              <AppText variant="caption" muted className="text-center mt-3">
                Дальше — проверка таймера и уведомлений
              </AppText>
            ) : null}
          </LinearGradient>
        </AppCard>

      <StaggerItem index={2}>
        <AppButton
          label="Изменить тренировку"
          variant="ghost"
          onPress={() => router.push('/(tabs)/plan')}
        />
      </StaggerItem>
    </SafeScreen>
  );
}
