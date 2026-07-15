import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { AppText } from '../../../shared/ui/AppText';
import { MOTION } from '../../../shared/ui/animations/motion';

interface ProgressStripProps {
  completed: number;
  total: number;
  percent: number;
}

export function ProgressStrip({ completed, total, percent }: ProgressStripProps) {
  const progress = useSharedValue(percent);

  useEffect(() => {
    progress.value = withSpring(percent, MOTION.spring);
  }, [percent, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="mb-1">
      <View className="flex-row items-center justify-between mb-2">
        <AppText variant="caption" muted>
          Сегодня: {total} упражнений
        </AppText>
        <AppText variant="caption">
          {completed}/{total}
        </AppText>
      </View>
      <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <Animated.View className="h-full bg-emerald-500 rounded-full" style={barStyle} />
      </View>
    </View>
  );
}