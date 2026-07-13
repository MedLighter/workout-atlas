import { Pressable, View } from 'react-native';
import type { WorkoutSet } from '../model/workout.types';
import { formatPreviousSet } from '../utils/workoutStatus';
import { AppText } from '../../../shared/ui/AppText';
import { NumberInput } from '../../../shared/ui/NumberInput';
import { CheckButton } from '../../../shared/ui/CheckButton';
import { AppButton } from '../../../shared/ui/AppButton';

interface SetRowProps {
  index: number;
  set: WorkoutSet;
  unit: string;
  onUpdate: (patch: Partial<WorkoutSet>) => void;
  onCopyLast: () => void;
}

const SET_TYPE_LABELS: Record<WorkoutSet['type'], string> = {
  warmup: 'Разминка',
  working: 'Рабочий',
  drop: 'Дроп',
  amrap: 'AMRAP',
  failure: 'В отказ',
  backoff: 'Бэкофф',
};

export function SetRow({ index, set, unit, onUpdate, onCopyLast }: SetRowProps) {
  const previousLabel = formatPreviousSet(set.previousWeight, set.previousReps, unit);
  const completed = set.completed;

  return (
    <Pressable
      onPress={() => onUpdate({ completed: !completed })}
      className={`rounded-xl border px-3 py-3 mb-2 mt-2 active:opacity-90 ${
        completed
          ? 'bg-emerald-950/20 border-emerald-500/20'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="w-6 h-6 rounded-full bg-zinc-800 items-center justify-center">
            <AppText variant="caption" className="text-zinc-300">
              {index + 1}
            </AppText>
          </View>
          <AppText variant="caption" className={completed ? 'text-emerald-400' : ''} muted={!completed}>
            {SET_TYPE_LABELS[set.type]}
          </AppText>
        </View>
        <View className="flex-row items-center gap-2">
          {previousLabel ? (
            <AppText variant="caption" muted>
              Было: {previousLabel}
            </AppText>
          ) : null}
          <CheckButton checked={completed} onPress={() => onUpdate({ completed: !completed })} />
        </View>
      </View>

      <Pressable onPress={(e) => e.stopPropagation()}>
        <View className="flex-row items-end gap-2">
          <NumberInput
            compact
            label={`Вес (${unit})`}
            value={set.weight?.toString() ?? ''}
            onChangeText={(text) =>
              onUpdate({ weight: text ? Number(text) : undefined })
            }
            placeholder={set.previousWeight?.toString() ?? '—'}
          />
          <NumberInput
            compact
            label="Повторы"
            value={set.reps?.toString() ?? ''}
            onChangeText={(text) =>
              onUpdate({ reps: text ? Number(text) : undefined })
            }
            placeholder={set.previousReps?.toString() ?? '—'}
          />
          <AppButton
            compact
            variant="ghost"
            label="↩"
            onPress={onCopyLast}
            className="w-12"
          />
        </View>
      </Pressable>

      {set.rpe != null ? (
        <AppText variant="caption" muted className="mt-2">
          RPE {set.rpe}
        </AppText>
      ) : null}
    </Pressable>
  );
}