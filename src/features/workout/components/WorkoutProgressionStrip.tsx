import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';

interface WorkoutProgressionStripProps {
  count: number;
}

export function WorkoutProgressionStrip({ count }: WorkoutProgressionStripProps) {
  if (count <= 0) return null;

  return (
    <View className="mb-3 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 px-3.5 py-2.5 flex-row items-center gap-2.5">
      <View className="w-8 h-8 rounded-full bg-emerald-500/10 items-center justify-center">
        <Ionicons name="trending-up" size={16} color="#34D399" />
      </View>
      <View className="flex-1">
        <AppText variant="caption" className="text-emerald-300">
          Прогрессия активна
        </AppText>
        <AppText variant="caption" muted>
          {count} {count === 1 ? 'упражнение' : count < 5 ? 'упражнения' : 'упражнений'} с целевым весом
        </AppText>
      </View>
    </View>
  );
}