import { useRef } from 'react';
import { Pressable, View } from 'react-native';
import type { WorkoutSet } from '../model/workout.types';
import type { ProgressionSuggestion } from '../model/progression.types';
import { formatPreviousSet } from '../utils/workoutStatus';
import { AppText } from '../../../shared/ui/AppText';
import { NumberInput } from '../../../shared/ui/NumberInput';
import { CheckButton } from '../../../shared/ui/CheckButton';
import { AppButton } from '../../../shared/ui/AppButton';
import Animated, { FadeIn, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import type { FocusedInputLayout } from '../../../shared/hooks/useScrollToFocusedInput';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  unit: string;
  hasProgression?: boolean;
  progressionSuggestion?: ProgressionSuggestion | null;
  onUpdate: (patch: Partial<WorkoutSet>) => void;
  onCopyLast: () => void;
  onInputFocus?: (layout: FocusedInputLayout) => void;
}

export function SetRow({
  index,
  set,
  unit,
  hasProgression,
  progressionSuggestion,
  onUpdate,
  onCopyLast,
  onInputFocus,
}: SetRowProps) {
  const rowRef = useRef<View>(null);
  const previousLabel = formatPreviousSet(set.previousWeight, set.previousReps, unit);
  const completed = set.completed;
  const isWorking = set.type === 'working';
  const showTarget =
    hasProgression && isWorking && set.previousWeight != null && set.previousReps != null;
  const matchesTarget =
    showTarget && set.weight === set.previousWeight && set.reps === set.previousReps;

  const completedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(completed ? 0.72 : 1, { duration: 180 }),
  }));

  const measureFocus = () => {
    rowRef.current?.measureInWindow((_x, y, _width, height) => {
      onInputFocus?.({ windowY: y, height });
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(160)} style={completedStyle}>
      <View ref={rowRef}>
        <Pressable
          onPress={() => onUpdate({ completed: !completed })}
          className={`rounded-xl border px-3 py-2.5 mb-2 active:opacity-90 ${
            completed
              ? 'bg-emerald-950/20 border-emerald-500/20'
              : showTarget
                ? 'bg-zinc-900 border-emerald-500/15'
                : 'bg-zinc-900 border-zinc-800'
          }`}
        >
          <View className="flex-row items-center gap-2">
            <View
              className={`w-7 h-7 rounded-full items-center justify-center ${
                completed ? 'bg-emerald-500/20' : 'bg-zinc-800'
              }`}
            >
              <AppText variant="caption" className={completed ? 'text-emerald-300' : 'text-zinc-300'}>
                {index + 1}
              </AppText>
            </View>

            <Pressable className="flex-1 flex-row items-end gap-1.5" onPress={(e) => e.stopPropagation()}>
              <NumberInput
                compact
                value={set.weight?.toString() ?? ''}
                onChangeText={(text) => onUpdate({ weight: text ? Number(text) : undefined })}
                placeholder={set.previousWeight?.toString() ?? '—'}
                onMeasureFocus={measureFocus}
              />
              <AppText variant="caption" muted className="pb-2">
                ×
              </AppText>
              <NumberInput
                compact
                value={set.reps?.toString() ?? ''}
                onChangeText={(text) => onUpdate({ reps: text ? Number(text) : undefined })}
                placeholder={set.previousReps?.toString() ?? '—'}
                onMeasureFocus={measureFocus}
              />
            </Pressable>

            <AppButton
              compact
              variant={matchesTarget ? 'primary' : 'ghost'}
              label={showTarget ? '◎' : '↩'}
              onPress={onCopyLast}
              className="w-10"
            />
            <CheckButton checked={completed} onPress={() => onUpdate({ completed: !completed })} />
          </View>

          {previousLabel || set.rpe != null ? (
            <View className="flex-row items-center justify-between mt-1.5 pl-9">
              {previousLabel ? (
                <AppText variant="caption" muted>
                  {showTarget ? 'Цель' : 'Было'}: {previousLabel}
                </AppText>
              ) : (
                <View />
              )}
              {set.rpe != null ? (
                <AppText variant="caption" muted>
                  RPE {set.rpe}
                  {progressionSuggestion?.trend === 'up' && isWorking ? ' · ↑' : ''}
                </AppText>
              ) : null}
            </View>
          ) : null}
        </Pressable>
      </View>
    </Animated.View>
  );
}