import { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MOTION } from './motion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface BrandMarkProps {
  size?: number;
  pulse?: boolean;
}

export function BrandMark({ size = 88, pulse = true }: BrandMarkProps) {
  const glow = useSharedValue(0.35);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!pulse) return;

    glow.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: MOTION.slow, easing: Easing.inOut(Easing.quad) }),
        withTiming(0.35, { duration: MOTION.slow, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
    scale.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: MOTION.slow }),
        withTiming(1, { duration: MOTION.slow }),
      ),
      -1,
      false,
    );
  }, [glow, pulse, scale]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: 0.25 + glow.value * 0.35,
  }));

  const animatedCircleProps = useAnimatedProps(() => ({
    opacity: 0.55 + glow.value * 0.45,
  }));

  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      <Animated.View
        className="absolute rounded-full bg-emerald-500"
        style={[{ width: size, height: size }, ringStyle]}
      />
      <Svg width={size} height={size} viewBox="0 0 88 88">
        <AnimatedCircle
          cx="44"
          cy="24"
          r="10"
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          animatedProps={animatedCircleProps}
        />
        <Path
          d="M44 34 L44 52 M30 42 L58 42 M34 66 L44 52 L54 66 M34 66 L34 76 M54 66 L54 76"
          fill="none"
          stroke="#34D399"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}