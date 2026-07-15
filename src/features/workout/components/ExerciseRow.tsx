import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp, Layout } from 'react-native-reanimated';
import type { FocusedInputLayout } from '../../../shared/hooks/useScrollToFocusedInput';
import type { Exercise, TrackingMode } from '../model/workout.types';
import type { ProgressionSuggestion } from '../model/progression.types';
import { ProgressionCard } from './ProgressionCard';
import { getExerciseStatus } from '../utils/workoutStatus';
import { AppText } from '../../../shared/ui/AppText';
import { ExerciseStatusPill } from './ExerciseStatusPill';
import { SetRow } from './SetRow';
import { AppButton } from '../../../shared/ui/AppButton';
import { CheckButton } from '../../../shared/ui/CheckButton';
import { AtlasButton } from './AtlasButton';

interface ExerciseRowProps {
  exercise: Exercise;
  unit: string;
  trackingMode: TrackingMode;
  progressionSuggestion?: ProgressionSuggestion | null;
  expanded: boolean;
  isActive?: boolean;
  onToggle: () => void;
  onOpenAtlas: () => void;
  onToggleSimple: () => void;
  onUpdateSet: (setId: string, patch: Partial<Exercise['sets'][number]>) => void;
  onCopyLast: (setId: string) => void;
  onAddSet: () => void;
  onSkip: () => void;
  onInputFocus?: (layout: FocusedInputLayout) => void;
}

export function ExerciseRow({
  exercise,
  unit,
  trackingMode,
  progressionSuggestion,
  expanded,
  isActive = false,
  onToggle,
  onOpenAtlas,
  onToggleSimple,
  onUpdateSet,
  onCopyLast,
  onAddSet,
  onSkip,
  onInputFocus,
}: ExerciseRowProps) {
  const status = getExerciseStatus(exercise);
  const completedSets = exercise.sets.filter((set) => set.completed).length;
  const isSimple = trackingMode === 'simple';
  const isDone = status === 'done';
  const isSkipped = status === 'skipped';

  if (isDone && !expanded && !isSimple) {
    return (
      <Animated.View layout={Layout.springify().damping(20)} className="mb-2">
        <Pressable
          onPress={onToggle}
          className="flex-row items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/60 px-4 py-3 active:bg-zinc-900"
        >
          <View className="w-3 h-3 rounded-full bg-emerald-500" />
          <AppText variant="row" className="flex-1 text-zinc-500 line-through">
            {exercise.name}
          </AppText>
          <AppText variant="caption" muted>
            {completedSets}/{exercise.sets.length}
          </AppText>
        </Pressable>
      </Animated.View>
    );
  }

  if (isSkipped && !expanded && !isSimple) {
    return (
      <Animated.View layout={Layout.springify().damping(20)} className="mb-2">
        <Pressable
          onPress={onToggle}
          className="flex-row items-center gap-3 rounded-xl border border-zinc-800/70 bg-zinc-950/40 px-4 py-3"
        >
          <View className="w-3 h-3 rounded-full border border-zinc-600" />
          <AppText variant="row" className="flex-1 text-zinc-500">
            {exercise.name}
          </AppText>
          <AppText variant="caption" muted>
            пропущено
          </AppText>
        </Pressable>
      </Animated.View>
    );
  }

  const statusLabel =
    status === 'done'
      ? 'Готово'
      : status === 'in_progress'
        ? `${completedSets}/${exercise.sets.length} подходов`
        : status === 'skipped'
          ? 'Пропущено'
          : isSimple
            ? 'Тап — выполнено'
            : isActive
              ? 'Текущее упражнение'
              : 'Раскрыть подходы';

  return (
    <Animated.View layout={Layout.springify().damping(20)} className="mb-2">
      <View
        className={`rounded-2xl border ${
          expanded || isActive
            ? 'bg-zinc-900 border-emerald-500/40'
            : 'bg-zinc-950 border-zinc-800'
        }`}
      >
        <Pressable
          onPress={isSimple ? onToggleSimple : onToggle}
          className="px-4 py-3.5 active:bg-zinc-900/80 rounded-2xl"
        >
          <View className="flex-row items-center gap-3">
            {isSimple ? (
              <CheckButton checked={status === 'done'} onPress={onToggleSimple} />
            ) : (
              <ExerciseStatusPill status={status} />
            )}

            <View className="flex-1">
              <AppText variant="row">{exercise.name}</AppText>
              <AppText
                variant="caption"
                className={isActive ? 'text-emerald-400' : ''}
                muted={!isActive}
              >
                {statusLabel}
              </AppText>
              {!expanded && !isDone && progressionSuggestion ? (
                <ProgressionCard suggestion={progressionSuggestion} unit={unit} variant="compact" />
              ) : null}
            </View>

            <View className="items-end gap-2">
              <AtlasButton compact onPress={onOpenAtlas} />
              {!isSimple ? (
                <View className="w-8 h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${exercise.sets.length ? (completedSets / exercise.sets.length) * 100 : 0}%`,
                    }}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>

        {!isSimple && expanded ? (
          <Animated.View
            entering={FadeInDown.duration(220)}
            exiting={FadeOutUp.duration(180)}
            className="px-4 pb-3 border-t border-zinc-800/80"
          >
            {progressionSuggestion ? (
              <ProgressionCard suggestion={progressionSuggestion} unit={unit} variant="full" />
            ) : null}
            {exercise.sets.map((set, index) => (
              <SetRow
                key={set.id}
                index={index}
                set={set}
                unit={unit}
                hasProgression={!!progressionSuggestion}
                progressionSuggestion={progressionSuggestion}
                onUpdate={(patch) => onUpdateSet(set.id, patch)}
                onCopyLast={() => onCopyLast(set.id)}
                onInputFocus={onInputFocus}
              />
            ))}
            <View className="flex-row gap-2 mt-1">
              <AppButton compact variant="secondary" label="+ Подход" onPress={onAddSet} className="flex-1" />
              <AppButton compact variant="ghost" label="Пропустить" onPress={onSkip} className="flex-1" />
            </View>
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}