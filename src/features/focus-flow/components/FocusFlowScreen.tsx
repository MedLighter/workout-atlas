import { useCallback, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MOTION } from '../../../shared/ui/animations/motion';
import { useReduceMotion } from '../../../shared/hooks/useReduceMotion';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import { ConfirmationDialog } from '../../../shared/ui/ConfirmationDialog';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { colors } from '../../../shared/theme/tokens';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { useSettingsStore } from '../../settings/model/settings.store';
import { AnalyticsModal } from '../../workout/components/AnalyticsModal';
import {
  getActiveExercise,
  getActiveSet,
  getBestSet,
  getPreviousResult,
  getElapsedMinutes,
} from '../../workout/utils/focus-flow.logic';
import { WeightStepper } from './WeightStepper';
import { RepsStepper } from './RepsStepper';
import { SetProgress } from './SetProgress';
import { WorkoutRoute } from './WorkoutRoute';
import { RestTimer } from './RestTimer';
import { ExerciseListSheet } from './ExerciseListSheet';

export function FocusFlowScreen() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [finishConfirm, setFinishConfirm] = useState(false);
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const reduceMotion = useReduceMotion();

  const unit = useSettingsStore((s) => s.unit);
  const weightStep = useSettingsStore((s) => (s.unit === 'kg' ? s.weightIncrementKg : s.weightIncrementLb));
  const restTimerSec = useSettingsStore((s) => s.restTimerSec);

  const currentSession = useWorkoutStore((s) => s.currentSession);
  const workoutPhase = useWorkoutStore((s) => s.workoutPhase);
  const activeExerciseIndex = useWorkoutStore((s) => s.activeExerciseIndex);
  const activeSetIndex = useWorkoutStore((s) => s.activeSetIndex);
  const restEndsAt = useWorkoutStore((s) => s.restEndsAt);
  const workoutStartedAt = useWorkoutStore((s) => s.workoutStartedAt);
  const pausedAt = useWorkoutStore((s) => s.pausedAt);
  const elapsedBeforePauseMs = useWorkoutStore((s) => s.elapsedBeforePauseMs);
  const atlasExerciseId = useWorkoutStore((s) => s.atlasExerciseId);

  const completeSet = useWorkoutStore((s) => s.completeSet);
  const skipRest = useWorkoutStore((s) => s.skipRest);
  const extendRest = useWorkoutStore((s) => s.extendRest);
  const selectSetIndex = useWorkoutStore((s) => s.selectSetIndex);
  const selectExerciseIndex = useWorkoutStore((s) => s.selectExerciseIndex);
  const adjustWeight = useWorkoutStore((s) => s.adjustWeight);
  const adjustReps = useWorkoutStore((s) => s.adjustReps);
  const setActiveWeight = useWorkoutStore((s) => s.setActiveWeight);
  const setActiveReps = useWorkoutStore((s) => s.setActiveReps);
  const pauseWorkout = useWorkoutStore((s) => s.pauseWorkout);
  const resumeWorkout = useWorkoutStore((s) => s.resumeWorkout);
  const goToNextExercise = useWorkoutStore((s) => s.goToNextExercise);
  const finishWorkoutEarly = useWorkoutStore((s) => s.finishWorkoutEarly);
  const discardWorkout = useWorkoutStore((s) => s.discardWorkout);
  const skipExercise = useWorkoutStore((s) => s.skipExercise);
  const openAtlas = useWorkoutStore((s) => s.openAtlas);
  const closeAtlas = useWorkoutStore((s) => s.closeAtlas);

  const exercise = getActiveExercise(currentSession, activeExerciseIndex);
  const activeSet = getActiveSet(exercise, activeSetIndex);
  const previous = exercise ? getPreviousResult(exercise) : null;

  const handleCompleteSet = useCallback(() => {
    setCompleteSuccess(true);
    completeSet();
    setTimeout(() => setCompleteSuccess(false), 600);
  }, [completeSet]);

  const handleRestComplete = useCallback(() => {
    skipRest();
  }, [skipRest]);

  useEffect(() => {
    if (workoutPhase === 'summary') {
      router.replace('/workout/summary');
    }
  }, [workoutPhase, router]);

  if (workoutPhase === 'summary') {
    return null;
  }

  if (!currentSession || !exercise) {
    router.replace('/(tabs)');
    return null;
  }

  if (workoutPhase === 'paused') {
    return (
      <SafeScreen className="justify-center px-6">
        <AppText variant="h2" className="text-center mb-2">
          Тренировка на паузе
        </AppText>
        <AppText variant="bodyM" muted className="text-center mb-2">
          {currentSession.title}
        </AppText>
        <AppText variant="bodyM" muted className="text-center mb-8">
          Прошло {getElapsedMinutes({ workoutStartedAt, pausedAt, elapsedBeforePauseMs } as never)} минут
        </AppText>
        <AppButton label="Продолжить" onPress={resumeWorkout} className="mb-3" />
        <AppButton
          label="Завершить тренировку"
          variant="secondary"
          onPress={() => setFinishConfirm(true)}
        />
        <ConfirmationDialog
          visible={finishConfirm}
          title="Завершить тренировку?"
          description={`Выполнено ${activeExerciseIndex} из ${currentSession.exercises.length} упражнений. Результаты будут сохранены.`}
          confirmLabel="Завершить"
          cancelLabel="Продолжить тренировку"
          onConfirm={() => {
            setFinishConfirm(false);
            finishWorkoutEarly();
            router.replace('/workout/summary');
          }}
          onCancel={() => setFinishConfirm(false)}
        />
      </SafeScreen>
    );
  }

  if (workoutPhase === 'rest' && restEndsAt) {
    const nextWeight = activeSet?.weight ?? activeSet?.previousWeight;
    const nextReps = activeSet?.reps ?? activeSet?.previousReps;
    const nextLabel =
      nextWeight != null
        ? `${nextWeight} ${unit} × ${nextReps ?? '—'}`
        : `${nextReps ?? '—'} повторов`;

    return (
      <SafeScreen edges={['top', 'bottom']}>
        <RestTimer
          endsAt={restEndsAt}
          totalSec={exercise.restSec ?? restTimerSec}
          nextLabel={nextLabel}
          onSkip={skipRest}
          onExtend={() => extendRest(30)}
          onComplete={handleRestComplete}
        />
      </SafeScreen>
    );
  }

  if (workoutPhase === 'exercise_complete') {
    const best = getBestSet(exercise);
    return (
      <SafeScreen className="justify-center px-6">
        <Animated.View
          entering={FadeIn.duration(MOTION.normal)
            .springify()
            .damping(MOTION.enter.damping)
            .stiffness(MOTION.enter.stiffness)}
        >
          <AppText variant="h2" className="text-center mb-2">
            {exercise.name} завершён
          </AppText>
          <AppText variant="bodyM" muted className="text-center mb-2">
            {exercise.sets.filter((s) => s.completed).length} подхода
          </AppText>
          {best ? (
            <AppText variant="bodyL" className="text-center text-accent mb-8">
              Лучший: {best.weight} {unit} × {best.reps}
            </AppText>
          ) : null}
          <AppButton label="Следующее упражнение" onPress={goToNextExercise} />
        </Animated.View>
      </SafeScreen>
    );
  }

  const atlasExercise = atlasExerciseId
    ? currentSession.exercises.find((e) => e.id === atlasExerciseId) ?? null
    : null;

  return (
    <SafeScreen edges={['top', 'bottom']} className="justify-between pb-4">
      <View>
        <View className="flex-row items-center justify-between mb-4 pt-1">
          <Pressable
            onPress={() => pauseWorkout()}
            accessibilityLabel="Назад"
            className="rounded-full items-center justify-center border border-border-subtle"
            style={{ width: 42, height: 42, backgroundColor: colors.surfacePrimary }}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View className="items-center flex-1">
            <AppText variant="bodyL">{currentSession.title}</AppText>
            <AppText variant="caption" muted>
              Упражнение {activeExerciseIndex + 1} из {currentSession.exercises.length}
            </AppText>
          </View>
          <Pressable
            onPress={() => setMenuOpen(true)}
            accessibilityLabel="Меню"
            className="rounded-full items-center justify-center border border-border-subtle"
            style={{ width: 42, height: 42, backgroundColor: colors.surfacePrimary }}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {reduceMotion ? (
          <View className="mb-4">
            <ExerciseHeader
              exercise={exercise}
              activeSetIndex={activeSetIndex}
              onOpenAtlas={() => openAtlas(exercise.id)}
            />
          </View>
        ) : (
          <Animated.View
            entering={FadeIn.duration(MOTION.normal)
              .springify()
              .damping(MOTION.enter.damping)
              .stiffness(MOTION.enter.stiffness)}
            key={`${activeExerciseIndex}-${activeSetIndex}`}
            className="mb-4"
          >
            <ExerciseHeader
              exercise={exercise}
              activeSetIndex={activeSetIndex}
              onOpenAtlas={() => openAtlas(exercise.id)}
            />
          </Animated.View>
        )}

        {previous ? (
          <View className="items-center mb-3">
            <AppCard className="min-w-[210px] py-2.5" onPress={() => openAtlas(exercise.id)}>
              <View className="flex-row items-center justify-between">
                <View>
                  <AppText variant="caption" muted>Прошлый раз</AppText>
                  <AppText variant="bodyL" tabular>
                    {previous.weight != null
                      ? `${previous.weight} ${unit} × ${previous.reps ?? '—'}`
                      : `${previous.reps ?? '—'} повторов`}
                  </AppText>
                </View>
                <Ionicons name="trending-up-outline" size={21} color={colors.textSecondary} />
              </View>
            </AppCard>
          </View>
        ) : null}

        {activeSet?.weight != null || activeSet?.previousWeight != null ? (
          <WeightStepper
            value={activeSet?.weight ?? activeSet?.previousWeight}
            unit={unit}
            step={weightStep}
            onChange={setActiveWeight}
            onStep={adjustWeight}
          />
        ) : null}

        <View className="mt-2">
          <RepsStepper
            value={activeSet?.reps ?? activeSet?.previousReps}
            onChange={setActiveReps}
            onStep={adjustReps}
          />
        </View>

        <View className="mt-3">
          <SetProgress
            sets={exercise.sets}
            activeIndex={activeSetIndex}
            onSelect={selectSetIndex}
          />
        </View>
      </View>

      <View>
        <AppButton
          label="Завершить подход"
          onPress={handleCompleteSet}
          success={completeSuccess}
          className="mb-2"
        />
        <WorkoutRoute
          exercises={currentSession.exercises}
          activeIndex={activeExerciseIndex}
          onPress={() => setListOpen(true)}
        />
      </View>

      <BottomSheet visible={menuOpen} onClose={() => setMenuOpen(false)}>
        <AppButton
          label="Список упражнений"
          variant="secondary"
          onPress={() => {
            setMenuOpen(false);
            setListOpen(true);
          }}
          className="mb-3"
        />
        <AppButton
          label="Пропустить упражнение"
          variant="secondary"
          onPress={() => {
            skipExercise(exercise.id);
            setMenuOpen(false);
            goToNextExercise();
          }}
          className="mb-3"
        />
        <AppButton
          label="Поставить на паузу"
          variant="secondary"
          onPress={() => {
            setMenuOpen(false);
            pauseWorkout();
          }}
          className="mb-3"
        />
        <AppButton
          label="Завершить тренировку"
          variant="danger"
          onPress={() => {
            setMenuOpen(false);
            setFinishConfirm(true);
          }}
        />
      </BottomSheet>

      <ConfirmationDialog
        visible={finishConfirm}
        title="Завершить тренировку?"
        description={`Выполнено ${activeExerciseIndex} из ${currentSession.exercises.length} упражнений. Результаты будут сохранены.`}
        confirmLabel="Завершить"
        cancelLabel="Продолжить тренировку"
        onConfirm={() => {
          setFinishConfirm(false);
          finishWorkoutEarly();
          router.replace('/workout/summary');
        }}
        onCancel={() => setFinishConfirm(false)}
      />

      <ExerciseListSheet
        visible={listOpen}
        session={currentSession}
        activeIndex={activeExerciseIndex}
        onClose={() => setListOpen(false)}
        onSelect={selectExerciseIndex}
        onSkip={skipExercise}
      />

      <AnalyticsModal
        visible={atlasExerciseId != null}
        exercise={atlasExercise}
        unit={unit}
        onClose={closeAtlas}
      />
    </SafeScreen>
  );
}

function ExerciseHeader({
  exercise,
  activeSetIndex,
  onOpenAtlas,
}: {
  exercise: { id: string; name: string; sets: unknown[] };
  activeSetIndex: number;
  onOpenAtlas: () => void;
}) {
  return (
    <>
      <AppText variant="bodyL" className="text-accent mb-1">
        Сейчас · подход {activeSetIndex + 1} из {exercise.sets.length}
      </AppText>
      <Pressable
        onPress={onOpenAtlas}
        className="flex-row items-center justify-between"
        accessibilityRole="button"
        accessibilityLabel={`${exercise.name}, подробнее`}
      >
        <AppText variant="h1" className="flex-1 pr-3">
          {exercise.name}
        </AppText>
        <Ionicons name="information-circle-outline" size={22} color={colors.textSecondary} />
      </Pressable>
    </>
  );
}
