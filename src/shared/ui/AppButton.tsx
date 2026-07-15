import { ActivityIndicator, Platform, Pressable, View, type PressableProps, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { AppText } from './AppText';
import { MOTION } from './animations/motion';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { colors } from '../theme/tokens';
import { LinearGradient } from 'expo-linear-gradient';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonState = 'default' | 'loading' | 'success';

interface AppButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  compact?: boolean;
  loading?: boolean;
  success?: boolean;
}

const textClasses: Record<Variant, string> = {
  primary: 'text-white font-semibold',
  secondary: 'text-content-primary font-medium',
  ghost: 'text-content-secondary font-medium',
  danger: 'text-error font-medium',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function AppButton({
  label,
  variant = 'primary',
  compact,
  disabled,
  loading,
  success,
  className,
  onPressIn,
  onPressOut,
  ...props
}: AppButtonProps) {
  const reduceMotion = useReduceMotion();
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;
  const state: ButtonState = loading ? 'loading' : success ? 'success' : 'default';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const displayLabel = state === 'success' ? '✓ Готово' : label;
  const backgroundColor =
    variant === 'primary'
      ? colors.accentPrimary
      : variant === 'secondary'
        ? colors.surfacePrimary
        : variant === 'danger'
          ? 'rgba(240,93,94,0.15)'
          : 'transparent';
  const borderColor =
    variant === 'danger'
      ? 'rgba(240,93,94,0.4)'
      : variant === 'primary'
        ? 'transparent'
        : colors.borderSubtle;
  const webCursor: ViewStyle = Platform.OS === 'web' ? { cursor: 'pointer' } : {};

  return (
    <View
      className={className}
      style={{ alignSelf: compact ? 'auto' : 'stretch' }}
    >
      <AnimatedPressable
        accessibilityRole="button"
        disabled={isDisabled}
        style={[
          animatedStyle,
          {
            alignSelf: 'stretch',
            minWidth: compact ? 44 : undefined,
            minHeight: compact ? 44 : 56,
            paddingHorizontal: compact ? 12 : 16,
            paddingVertical: compact ? 10 : 14,
            overflow: 'hidden',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 16,
            borderWidth: variant === 'primary' ? 0 : 1,
            borderColor,
            backgroundColor,
            opacity: isDisabled ? 0.4 : 1,
            shadowColor: variant === 'primary' ? colors.accentPrimary : '#000',
            shadowOpacity: variant === 'primary' ? 0.22 : 0,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
          },
          webCursor,
        ]}
        onPressIn={(event) => {
          if (!isDisabled && !reduceMotion) {
            scale.value = withSpring(MOTION.pressScale, MOTION.spring);
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
        {variant === 'primary' ? (
          <LinearGradient
            colors={state === 'success' ? [colors.accentPressed, colors.accentDeep] : [colors.accentBright, colors.accentDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
          />
        ) : null}
        {state === 'loading' ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.bgPrimary : colors.textPrimary}
          />
        ) : (
          <AppText className={`text-sm ${textClasses[variant]}`}>{displayLabel}</AppText>
        )}
      </AnimatedPressable>
    </View>
  );
}
