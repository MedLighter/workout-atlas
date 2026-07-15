import { useEffect, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { LoadingPulse } from '../../../shared/ui/animations/LoadingPulse';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { useScrollToFocusedInput } from '../../../shared/hooks/useScrollToFocusedInput';
import { useTabBarHeight } from '../../../shared/theme/layout';
import { useWorkoutStore } from '../model/workout.store';
import { selectProgressionSuggestion, selectWorkoutProgress } from '../model/workout.selectors';
import { ExerciseRow } from './ExerciseRow';
import { AnalyticsModal } from './AnalyticsModal';
import { WeekPlanStrip } from './WeekPlanStrip';
import { WeekPlanEditorModal } from './WeekPlanEditorModal';
import { WorkoutHeader } from './WorkoutHeader';
import { WorkoutBottomBar } from './WorkoutBottomBar';
import { useSettingsStore } from '../../settings/model/settings.store';
import { WEEKDAY_NAMES, getMondayFirstWeekday } from '../model/workout.schedule';
import type { Exercise } from '../model/workout.types';
import { getExerciseStatus } from '../utils/workoutStatus';

const BOTTOM_BAR_HEIGHT = 108;

export function WorkoutScreen() {
  const { bottom } = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const listRef = useRef<FlatList<Exercise>>(null);
  const unit = useSettingsStore((s) => s.unit);
  const trackingMode = useSettingsStore((s) => s.trackingMode);
  const progressionEnabled = useSettingsStore((s) => s.enabled);
  const progressionMode = useSettingsStore((s) => s.mode);
  const weightIncrementKg = useSettingsStore((s) => s.weightIncrementKg);
  const weightIncrementLb = useSettingsStore((s) => s.weightIncrementLb);
  const targetRpe = useSettingsStore((s) => s.targetRpe);
  const progressionCadence = useSettingsStore((s) => s.cadence);
  const cadenceEverySessions = useSettingsStore((s) => s.cadenceEverySessions);
  const storeHydrated = useWorkoutStore((s) => s.hydrated);
  const [hydrated, setHydrated] = useState(
    () => storeHydrated || useWorkoutStore.persist.hasHydrated(),
  );
  const currentSession = useWorkoutStore((s) => s.currentSession);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);
  const selectedWeekday = useWorkoutStore((s) => s.selectedWeekday);
  const expandedExerciseId = useWorkoutStore((s) => s.expandedExerciseId);
  const atlasExerciseId = useWorkoutStore((s) => s.atlasExerciseId);
  const initSession = useWorkoutStore((s) => s.initSession);
  const selectWeekday = useWorkoutStore((s) => s.selectWeekday);
  const loadWorkoutForWeekday = useWorkoutStore((s) => s.loadWorkoutForWeekday);
  const startUnplannedWorkout = useWorkoutStore((s) => s.startUnplannedWorkout);
  const toggleExpanded = useWorkoutStore((s) => s.toggleExpanded);
  const openAtlas = useWorkoutStore((s) => s.openAtlas);
  const closeAtlas = useWorkoutStore((s) => s.closeAtlas);
  const updateSet = useWorkoutStore((s) => s.updateSet);
  const copyLastSet = useWorkoutStore((s) => s.copyLastSet);
  const addSet = useWorkoutStore((s) => s.addSet);
  const toggleExerciseSimple = useWorkoutStore((s) => s.toggleExerciseSimple);
  const skipExercise = useWorkoutStore((s) => s.skipExercise);
  const finishWorkout = useWorkoutStore((s) => s.finishWorkout);
  const templates = useWorkoutStore((s) => s.templates);
  const updateScheduleDay = useWorkoutStore((s) => s.updateScheduleDay);
  const setWeeklyProgram = useWorkoutStore((s) => s.setWeeklyProgram);
  const resetWeeklyProgram = useWorkoutStore((s) => s.resetWeeklyProgram);
  const planEditorOpen = useWorkoutStore((s) => s.planEditorOpen);
  const openPlanEditor = useWorkoutStore((s) => s.openPlanEditor);
  const closePlanEditor = useWorkoutStore((s) => s.closePlanEditor);
  const completedSessions = useWorkoutStore((s) => s.completedSessions);

  const selectedDay = weeklyProgram.days.find((day) => day.weekday === selectedWeekday);
  const isRestDay = selectedDay?.type === 'rest';
  const todayWeekday = getMondayFirstWeekday();

  useEffect(() => {
    if (storeHydrated || useWorkoutStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    const unsub = useWorkoutStore.persist.onFinishHydration(() => setHydrated(true));
    const fallback = setTimeout(() => setHydrated(true), 2500);

    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, [storeHydrated]);

  useEffect(() => {
    if (hydrated) {
      initSession();
    }
  }, [hydrated, initSession]);

  const handleSelectDay = (weekday: number) => {
    selectWeekday(weekday);
    loadWorkoutForWeekday(weekday);
  };

  const progress = selectWorkoutProgress(currentSession);
  const progressionSettings = {
    enabled: progressionEnabled,
    mode: progressionMode,
    weightIncrementKg,
    weightIncrementLb,
    targetRpe,
    cadence: progressionCadence,
    cadenceEverySessions,
  };
  const progressionCount =
    currentSession?.exercises.filter((exercise) =>
      selectProgressionSuggestion(
        exercise,
        completedSessions,
        progressionSettings,
        currentSession.unit,
      ),
    ).length ?? 0;
  const atlasExercise =
    currentSession?.exercises.find((exercise) => exercise.id === atlasExerciseId) ?? null;
  const currentExercise =
    currentSession?.exercises.find((exercise) => exercise.id === expandedExerciseId) ??
    currentSession?.exercises.find(
      (exercise) =>
        getExerciseStatus(exercise) !== 'done' && getExerciseStatus(exercise) !== 'skipped',
    ) ??
    null;

  const { keyboardHeight, trackScroll, scrollToFocusedInput } = useScrollToFocusedInput(
    BOTTOM_BAR_HEIGHT + tabBarHeight,
  );

  useEffect(() => {
    if (!expandedExerciseId || !currentSession) return;

    const index = currentSession.exercises.findIndex((item) => item.id === expandedExerciseId);
    if (index < 0) return;

    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.25,
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [expandedExerciseId, currentSession?.id]);

  if (!hydrated) {
    return (
      <AppScreen>
        <LoadingPulse label="Подготавливаем тренировку..." />
      </AppScreen>
    );
  }

  const headerSubtitle = [
    WEEKDAY_NAMES[selectedWeekday],
    selectedWeekday === todayWeekday ? 'сегодня' : null,
    trackingMode === 'simple' ? 'быстрый режим' : 'детальный режим',
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <AppScreen padded={false}>
      <WorkoutHeader
        title={
          isRestDay
            ? 'День отдыха'
            : currentSession?.title ?? selectedDay?.title ?? 'Тренировка'
        }
        subtitle={headerSubtitle}
        completed={progress.completed}
        total={progress.total}
        percent={progress.percent}
        progressionCount={progressionEnabled ? progressionCount : 0}
        onEditPlan={openPlanEditor}
      />

      <WeekPlanStrip
        program={weeklyProgram}
        selectedWeekday={selectedWeekday}
        onSelectDay={handleSelectDay}
      />

      {currentSession ? (
        <KeyboardAvoidingView
          className="flex-1"
          style={{ minHeight: 0 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? tabBarHeight + 8 : 0}
        >
          <FlatList
            ref={listRef}
            style={{ flex: 1 }}
            data={currentSession.exercises}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            onScroll={(event) => trackScroll(event.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
            onScrollToIndexFailed={(info) => {
              listRef.current?.scrollToOffset({
                offset: info.averageItemLength * info.index,
                animated: true,
              });
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 12 + (keyboardHeight > 0 ? 12 : 0),
            }}
            renderItem={({ item }) => (
              <ExerciseRow
                exercise={item}
                unit={currentSession.unit}
                trackingMode={trackingMode}
                progressionSuggestion={selectProgressionSuggestion(
                  item,
                  completedSessions,
                  progressionSettings,
                  currentSession.unit,
                )}
                expanded={expandedExerciseId === item.id}
                isActive={expandedExerciseId === item.id}
                onToggle={() => toggleExpanded(item.id)}
                onOpenAtlas={() => openAtlas(item.id)}
                onToggleSimple={() => toggleExerciseSimple(item.id)}
                onUpdateSet={(setId, patch) => updateSet(item.id, setId, patch)}
                onCopyLast={(setId) => copyLastSet(item.id, setId)}
                onAddSet={() => addSet(item.id)}
                onSkip={() => skipExercise(item.id)}
                onInputFocus={(layout) => scrollToFocusedInput(listRef, layout)}
              />
            )}
          />

          <WorkoutBottomBar
            completed={progress.completed}
            total={progress.total}
            percent={progress.percent}
            currentExerciseName={
              trackingMode === 'detailed' ? currentExercise?.name : undefined
            }
            bottomInset={bottom}
            onFinish={finishWorkout}
          />
        </KeyboardAvoidingView>
      ) : isRestDay ? (
        <FadeSlideIn className="flex-1 px-5 items-center justify-center">
          <AppText variant="section" className="mb-2 text-center">
            Сегодня восстановление
          </AppText>
          <AppText variant="body" muted className="text-center mb-5">
            Отдых — часть программы. Начни внеплановую тренировку или выбери другой день.
          </AppText>
          <AppButton
            label="Внеплановая тренировка"
            variant="secondary"
            onPress={startUnplannedWorkout}
          />
        </FadeSlideIn>
      ) : (
        <FadeSlideIn className="flex-1 px-5 items-center justify-center gap-3">
          <AppText variant="section">Нет активной тренировки</AppText>
          <AppText variant="body" muted className="text-center">
            Выбери день с тренировкой в плане или импортируй из AI
          </AppText>
          <AppButton
            label="Загрузить тренировку"
            onPress={() => loadWorkoutForWeekday(selectedWeekday)}
          />
        </FadeSlideIn>
      )}

      <AnalyticsModal
        visible={!!atlasExerciseId}
        exercise={atlasExercise}
        unit={currentSession?.unit ?? unit}
        progressionSuggestion={
          atlasExercise
            ? selectProgressionSuggestion(
                atlasExercise,
                completedSessions,
                progressionSettings,
                currentSession?.unit ?? unit,
              )
            : null
        }
        onClose={closeAtlas}
      />

      <WeekPlanEditorModal
        visible={planEditorOpen}
        program={weeklyProgram}
        templates={templates}
        onClose={closePlanEditor}
        onUpdateDay={updateScheduleDay}
        onApplyPreset={setWeeklyProgram}
        onReset={resetWeeklyProgram}
      />
    </AppScreen>
  );
}