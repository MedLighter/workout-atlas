import { Pressable, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import { colors } from '../../../shared/theme/tokens';
import type { Exercise } from '../../workout/model/workout.types';
import { getExerciseStatus } from '../../workout/utils/workoutStatus';

interface WorkoutRouteProps {
  exercises: Exercise[];
  activeIndex: number;
  onPress: () => void;
}

export function WorkoutRoute({ exercises, activeIndex, onPress }: WorkoutRouteProps) {
  const prev = activeIndex > 0 ? exercises[activeIndex - 1] : null;
  const current = exercises[activeIndex];
  const next = activeIndex < exercises.length - 1 ? exercises[activeIndex + 1] : null;

  const statusIcon = (ex: Exercise, isCurrent: boolean) => {
    const status = getExerciseStatus(ex);
    if (status === 'done') return '✓';
    if (isCurrent) return '●';
    return '○';
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Маршрут тренировки"
      onPress={onPress}
      className="rounded-md px-4 py-3 border border-border-subtle active:opacity-80"
      style={{ backgroundColor: colors.surfacePrimary }}
    >
      <View className="flex-row flex-wrap items-center justify-center gap-2">
        {prev ? (
          <AppText variant="caption" muted>
            {statusIcon(prev, false)} {prev.name}
          </AppText>
        ) : null}
        {prev && current ? (
          <AppText variant="caption" muted>
            —
          </AppText>
        ) : null}
        {current ? (
          <AppText variant="caption" className="text-accent font-semibold">
            {statusIcon(current, true)} {current.name}
          </AppText>
        ) : null}
        {next && current ? (
          <AppText variant="caption" muted>
            —
          </AppText>
        ) : null}
        {next ? (
          <AppText variant="caption" muted>
            {statusIcon(next, false)} {next.name}
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}