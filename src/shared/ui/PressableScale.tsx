import { type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type PressableScaleProps = Omit<PressableProps, 'style'> & {
  children: ReactNode;
  scaleTo?: number;
  style?: StyleProp<ViewStyle>;
};
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { MOTION } from './animations/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PressableScale({
  children,
  scaleTo = MOTION.pressScale,
  disabled,
  style,
  onPressIn,
  onPressOut,
  ...props
}: PressableScaleProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      style={[animatedStyle, style]}
      onPressIn={(event) => {
        if (!disabled && !reduceMotion) {
          scale.value = withSpring(scaleTo, MOTION.spring);
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (!reduceMotion) {
          scale.value = withSpring(1, MOTION.spring);
        }
        onPressOut?.(event);
      }}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}