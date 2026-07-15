import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';

interface WorkoutBottomBarProps {
  completed: number;
  total: number;
  percent: number;
  currentExerciseName?: string;
  bottomInset: number;
  onFinish: () => void;
}

export function WorkoutBottomBar({
  completed,
  total,
  percent,
  currentExerciseName,
  bottomInset,
  onFinish,
}: WorkoutBottomBarProps) {
  const remaining = total - completed;
  const canFinish = completed > 0;
  const isComplete = percent === 100;

  return (
    <Animated.View
      entering={FadeInUp.duration(240)}
      className="border-t border-zinc-800 bg-zinc-950/98 px-5 pt-3"
      style={{ paddingBottom: bottomInset + 12 }}
    >
      <View className="flex-row items-center justify-between gap-3 mb-2">
        <View className="flex-1">
          {currentExerciseName ? (
            <AppText variant="caption" className="text-emerald-400 mb-0.5" numberOfLines={1}>
              Сейчас: {currentExerciseName}
            </AppText>
          ) : null}
          <AppText variant="caption" muted>
            {isComplete
              ? 'Все упражнения отмечены'
              : remaining > 0
                ? `Осталось ${remaining} из ${total}`
                : `${completed}/${total} готово`}
          </AppText>
        </View>
        <AppText variant="caption" className="text-zinc-300">
          {percent}%
        </AppText>
      </View>

      <AppButton
        label={isComplete ? 'Завершить тренировку' : 'Завершить досрочно'}
        variant={isComplete ? 'primary' : 'secondary'}
        disabled={!canFinish}
        onPress={onFinish}
      />
    </Animated.View>
  );
}