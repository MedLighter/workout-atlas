import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';
import { ProgressStrip } from './ProgressStrip';

interface WorkoutHeaderProps {
  title: string;
  subtitle: string;
  completed: number;
  total: number;
  percent: number;
  progressionCount?: number;
  onEditPlan?: () => void;
}

export function WorkoutHeader({
  title,
  subtitle,
  completed,
  total,
  percent,
  progressionCount = 0,
  onEditPlan,
}: WorkoutHeaderProps) {
  return (
    <View className="px-5 pt-2 pb-3 border-b border-zinc-800/80 bg-zinc-950">
      <View className="flex-row items-start justify-between gap-3 mb-2">
        <View className="flex-1">
          <AppText variant="title" className="text-lg leading-6 mb-0.5">
            {title}
          </AppText>
          <AppText variant="caption" muted>
            {subtitle}
          </AppText>
        </View>
        {onEditPlan ? (
          <Pressable
            onPress={onEditPlan}
            accessibilityRole="button"
            accessibilityLabel="Изменить план недели"
            className="w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900 items-center justify-center active:bg-zinc-800"
          >
            <Ionicons name="calendar-outline" size={18} color="#A1A1AA" />
          </Pressable>
        ) : null}
      </View>

      <ProgressStrip completed={completed} total={total} percent={percent} />

      {progressionCount > 0 ? (
        <View className="mt-1 flex-row items-center gap-1.5">
          <Ionicons name="trending-up" size={14} color="#34D399" />
          <AppText variant="caption" className="text-emerald-400/90">
            Прогрессия · {progressionCount} целей
          </AppText>
        </View>
      ) : null}
    </View>
  );
}