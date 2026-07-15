import { type ReactNode } from 'react';
import { View } from 'react-native';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import { FadeSlideIn } from './FadeSlideIn';
import { MOTION } from './motion';

interface StaggerItemProps {
  children: ReactNode;
  index?: number;
  direction?: 'up' | 'down' | 'right';
  className?: string;
}

export function StaggerItem({
  children,
  index = 0,
  direction = 'up',
  className,
}: StaggerItemProps) {
  const reduceMotion = useReduceMotion();

  if (reduceMotion) {
    return <View className={className}>{children}</View>;
  }

  return (
    <FadeSlideIn delay={index * MOTION.staggerStep} direction={direction} className={className}>
      {children}
    </FadeSlideIn>
  );
}