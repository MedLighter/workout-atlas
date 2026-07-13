import { View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';

interface ProgressStripProps {
  completed: number;
  total: number;
  percent: number;
}

export function ProgressStrip({ completed, total, percent }: ProgressStripProps) {
  return (
    <View className="mb-5">
      <View className="flex-row items-center justify-between mb-2">
        <AppText variant="caption" muted>
          Сегодня: {total} упражнений
        </AppText>
        <AppText variant="caption">
          {completed}/{total}
        </AppText>
      </View>
      <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <View
          className="h-full bg-emerald-500 rounded-full"
          style={{ width: `${percent}%` }}
        />
      </View>
    </View>
  );
}