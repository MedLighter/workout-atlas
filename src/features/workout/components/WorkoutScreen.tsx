import { useEffect } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppScreen } from '../../../shared/ui/AppScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { useWorkoutStore } from '../model/workout.store';
import { selectWorkoutProgress } from '../model/workout.selectors';
import { ProgressStrip } from './ProgressStrip';
import { ExerciseRow } from './ExerciseRow';
import { AnalyticsModal } from './AnalyticsModal';
import { WeekPlanStrip } from './WeekPlanStrip';
import { WeekPlanEditorModal } from './WeekPlanEditorModal';
import { useSettingsStore } from '../../settings/model/settings.store';
import { WEEKDAY_NAMES, getMondayFirstWeekday } from '../model/workout.schedule';

const FINISH_BAR_HEIGHT = 88;

export function WorkoutScreen() {
  const { bottom } = useSafeAreaInsets();
  const unit = useSettingsStore((s) => s.unit);
  const trackingMode = useSettingsStore((s) => s.trackingMode);
  const hydrated = useWorkoutStore((s) => s.hydrated);
  const currentSession = useWorkoutStore((s) => s.currentSession);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);
  const selectedWeekday = useWorkoutStore((s) => s.selectedWeekday);
  const expandedExerciseId = useWorkoutStore((s) => s.expandedExerciseId);
  const atlasExerciseId = useWorkoutStore((s) => s.atlasExerciseId);
  const initSession = useWorkoutStore((s) => s.initSession);
  const selectWeekday = useWorkoutStore((s) => s.selectWeekday);
  const loadWorkoutForWeekday = useWorkoutStore((s) => s.loadWorkoutForWeekday);
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
  const setProgramName = useWorkoutStore((s) => s.setProgramName);
  const resetWeeklyProgram = useWorkoutStore((s) => s.resetWeeklyProgram);
  const planEditorOpen = useWorkoutStore((s) => s.planEditorOpen);
  const openPlanEditor = useWorkoutStore((s) => s.openPlanEditor);
  const closePlanEditor = useWorkoutStore((s) => s.closePlanEditor);

  const selectedDay = weeklyProgram.days.find((day) => day.weekday === selectedWeekday);
  const isRestDay = selectedDay?.type === 'rest';
  const todayWeekday = getMondayFirstWeekday();

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
  const atlasExercise =
    currentSession?.exercises.find((exercise) => exercise.id === atlasExerciseId) ?? null;

  if (!hydrated) {
    return (
      <AppScreen>
        <View className="flex-1 items-center justify-center">
          <AppText variant="body" muted>
            Загрузка...
          </AppText>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen padded={false}>
      <View className="px-5 pt-2 pb-2">
        <AppText variant="caption" muted className="mb-1">
          Workout Atlas
        </AppText>
        <AppText variant="title" className="mb-1">
          {isRestDay ? 'День отдыха' : currentSession?.title ?? selectedDay?.title ?? 'Тренировка'}
        </AppText>
        <AppText variant="caption" muted>
          {WEEKDAY_NAMES[selectedWeekday]}
          {selectedWeekday === todayWeekday ? ' · сегодня' : ''}
          {trackingMode === 'simple' ? ' · быстрый режим' : ' · детальный режим'}
        </AppText>
      </View>

      <WeekPlanStrip
        program={weeklyProgram}
        selectedWeekday={selectedWeekday}
        onSelectDay={handleSelectDay}
        onEdit={openPlanEditor}
      />

      {isRestDay ? (
        <View className="flex-1 px-5 items-center justify-center">
          <AppText variant="section" className="mb-2 text-center">
            Сегодня восстановление
          </AppText>
          <AppText variant="body" muted className="text-center mb-5">
            Отдых — часть программы. Выбери другой день в плане или начни внеплановую тренировку.
          </AppText>
          <AppButton
            label="Внеплановая тренировка"
            variant="secondary"
            onPress={() => loadWorkoutForWeekday(0)}
          />
        </View>
      ) : !currentSession ? (
        <View className="flex-1 px-5 items-center justify-center gap-3">
          <AppText variant="section">Нет активной тренировки</AppText>
          <AppText variant="body" muted className="text-center">
            Выбери день с тренировкой в плане или импортируй из AI
          </AppText>
          <AppButton label="Загрузить Full Body A" onPress={() => loadWorkoutForWeekday(0)} />
        </View>
      ) : (
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
          <View className="px-5 pb-3">
            <ProgressStrip {...progress} />
          </View>

          <FlatList
            data={currentSession.exercises}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: progress.percent === 100 ? FINISH_BAR_HEIGHT + bottom + 16 : bottom + 16,
            }}
            renderItem={({ item }) => (
              <ExerciseRow
                exercise={item}
                unit={currentSession.unit}
                trackingMode={trackingMode}
                expanded={expandedExerciseId === item.id}
                onToggle={() => toggleExpanded(item.id)}
                onOpenAtlas={() => openAtlas(item.id)}
                onToggleSimple={() => toggleExerciseSimple(item.id)}
                onUpdateSet={(setId, patch) => updateSet(item.id, setId, patch)}
                onCopyLast={(setId) => copyLastSet(item.id, setId)}
                onAddSet={() => addSet(item.id)}
                onSkip={() => skipExercise(item.id)}
              />
            )}
          />

          {progress.percent === 100 ? (
            <View
              className="absolute left-0 right-0 px-5 pt-3 bg-zinc-950/95 border-t border-zinc-800"
              style={{ bottom: 0, paddingBottom: bottom + 12 }}
            >
              <AppButton label="Завершить тренировку" onPress={finishWorkout} />
            </View>
          ) : null}
        </KeyboardAvoidingView>
      )}

      <AnalyticsModal
        visible={!!atlasExerciseId}
        exercise={atlasExercise}
        unit={currentSession?.unit ?? unit}
        onClose={closeAtlas}
      />

      <WeekPlanEditorModal
        visible={planEditorOpen}
        program={weeklyProgram}
        templates={templates}
        onClose={closePlanEditor}
        onUpdateDay={updateScheduleDay}
        onSetProgramName={setProgramName}
        onReset={resetWeeklyProgram}
      />
    </AppScreen>
  );
}