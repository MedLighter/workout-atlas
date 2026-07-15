import { type ReactNode } from 'react';
import { View, type PressableProps } from 'react-native';
import { colors } from '../theme/tokens';
import { PressableScale } from './PressableScale';
import { StaggerItem } from './animations/StaggerItem';
import { MOTION } from './animations/motion';

interface AppCardProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  elevated?: boolean;
  /** Removes default padding — use when content (e.g. gradient) should fill the card edge-to-edge */
  flush?: boolean;
  /** Staggered entrance index for list items */
  enterIndex?: number;
  className?: string;
}

export function AppCard({
  children,
  elevated,
  flush,
  enterIndex,
  className,
  onPress,
  style,
  ...props
}: AppCardProps) {
  const base = `rounded-lg border border-border-subtle ${flush ? 'p-0 overflow-hidden' : `p-4 ${elevated ? 'bg-surface-elevated' : 'bg-surface'}`}`;
  const cardStyle = flush
    ? {
        backgroundColor: 'transparent' as const,
        shadowColor: elevated ? colors.accentPrimary : '#000',
        shadowOpacity: elevated ? 0.08 : 0.12,
        shadowRadius: elevated ? 22 : 12,
        shadowOffset: { width: 0, height: 8 },
        ...(style as object),
      }
    : {
        backgroundColor: elevated ? colors.surfaceElevated : colors.surfacePrimary,
        shadowColor: elevated ? colors.accentPrimary : '#000',
        shadowOpacity: elevated ? 0.08 : 0.12,
        shadowRadius: elevated ? 22 : 12,
        shadowOffset: { width: 0, height: 8 },
        ...(style as object),
      };

  const body = onPress ? (
    <PressableScale
      accessibilityRole="button"
      onPress={onPress}
      scaleTo={MOTION.cardPressScale}
      className={`${base} ${className ?? ''}`}
      style={cardStyle}
      {...props}
    >
      {children}
    </PressableScale>
  ) : (
    <View className={`${base} ${className ?? ''}`} style={cardStyle}>
      {children}
    </View>
  );

  if (enterIndex != null) {
    return <StaggerItem index={enterIndex}>{body}</StaggerItem>;
  }

  return body;
}