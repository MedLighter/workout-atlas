import { View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { AppText } from './AppText';
import { colors } from '../theme/tokens';
import { Ionicons } from '@expo/vector-icons';
import { PressableScale } from './PressableScale';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { MOTION } from './animations/motion';

interface RadioCardProps {
  label: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioCard({ label, description, selected, onPress }: RadioCardProps) {
  const reduceMotion = useReduceMotion();

  return (
    <PressableScale
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      scaleTo={MOTION.cardPressScale}
      className="rounded-md border px-4 py-3 mb-3"
      style={{
        backgroundColor: selected ? colors.accentSurfaceStrong : colors.surfacePrimary,
        borderColor: selected ? colors.accentBorder : colors.borderSubtle,
        minHeight: 56,
      }}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <AppText variant="bodyL" className="text-content-primary">
            {label}
          </AppText>
          {description ? (
            <AppText variant="caption" muted className="mt-1">
              {description}
            </AppText>
          ) : null}
        </View>
        {selected ? (
          reduceMotion ? (
            <Ionicons name="checkmark-circle" size={21} color={colors.accentBright} />
          ) : (
            <Animated.View
              entering={ZoomIn.duration(MOTION.fast)
                .springify()
                .damping(MOTION.enter.damping)
                .stiffness(MOTION.enter.stiffness)}
            >
              <Ionicons name="checkmark-circle" size={21} color={colors.accentBright} />
            </Animated.View>
          )
        ) : (
          <View className="h-5 w-5 rounded-full border-2" style={{ borderColor: colors.borderStrong }} />
        )}
      </View>
    </PressableScale>
  );
}