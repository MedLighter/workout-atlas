import { View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { MOTION } from './motion';

interface ProgressDotsProps {
  count: number;
  activeIndex: number;
}

function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(() => ({
    flex: 1,
    opacity: withSpring(active ? 1 : 0.5, MOTION.spring),
  }));

  return (
    <Animated.View
      style={style}
      className={`h-1 rounded-full ${active ? 'bg-accent' : 'bg-border-strong'}`}
    />
  );
}

export function ProgressDots({ count, activeIndex }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center gap-2 w-full">
      {Array.from({ length: count }, (_, index) => (
        <Dot key={index} active={index === activeIndex} />
      ))}
    </View>
  );
}
