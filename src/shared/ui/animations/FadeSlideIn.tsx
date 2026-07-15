import { type ReactNode } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, FadeInUp } from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { MOTION } from './motion';

type Direction = 'up' | 'down' | 'right' | 'fade';

interface FadeSlideInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const ENTER = {
  up: FadeInUp,
  down: FadeInDown,
  right: FadeInRight,
  fade: FadeIn,
} as const;

function buildEntering(direction: Direction, delay: number) {
  return ENTER[direction]
    .delay(delay)
    .duration(MOTION.enter.duration)
    .springify()
    .damping(MOTION.enter.damping)
    .stiffness(MOTION.enter.stiffness);
}

export function FadeSlideIn({
  children,
  direction = 'up',
  delay = 0,
  className,
}: FadeSlideInProps) {
  const reduceMotion = useReduceMotion();

  if (reduceMotion) {
    return <View className={className}>{children}</View>;
  }

  return (
    <Animated.View entering={buildEntering(direction, delay)} className={className}>
      {children}
    </Animated.View>
  );
}