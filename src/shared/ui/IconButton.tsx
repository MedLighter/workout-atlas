import { type ReactNode } from 'react';
import { type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '../theme/tokens';
import { PressableScale } from './PressableScale';

interface IconButtonProps extends Omit<PressableProps, 'style'> {
  children: ReactNode;
  size?: number;
  variant?: 'default' | 'ghost' | 'accent';
  style?: StyleProp<ViewStyle>;
}

export function IconButton({
  children,
  size = 44,
  variant = 'default',
  disabled,
  className,
  style,
  ...props
}: IconButtonProps) {
  const bg =
    variant === 'accent'
      ? colors.accentSurface
      : variant === 'ghost'
        ? 'transparent'
        : colors.surfacePrimary;

  return (
    <PressableScale
      accessibilityRole="button"
      disabled={disabled}
      className={`items-center justify-center rounded-md ${className ?? ''}`}
      style={[
        {
          minWidth: size,
          minHeight: size,
          width: size,
          height: size,
          backgroundColor: bg,
          opacity: disabled ? 0.4 : 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </PressableScale>
  );
}