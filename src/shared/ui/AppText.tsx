import { Text, type TextProps, type TextStyle } from 'react-native';
import { typography } from '../theme/tokens';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyL'
  | 'bodyM'
  | 'caption'
  | 'number'
  | 'title'
  | 'section'
  | 'row'
  | 'body';

interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
  tabular?: boolean;
}

const variantStyles: Record<Variant, TextStyle> = {
  display: typography.display,
  h1: typography.h1,
  h2: typography.h2,
  h3: typography.h3,
  bodyL: typography.bodyL,
  bodyM: typography.bodyM,
  caption: typography.caption,
  number: { ...typography.number, fontVariant: ['tabular-nums'] },
  title: typography.h1,
  section: typography.h3,
  row: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  body: typography.bodyM,
};

const variantColors: Record<Variant, string> = {
  display: 'text-content-primary',
  h1: 'text-content-primary',
  h2: 'text-content-primary',
  h3: 'text-content-primary',
  bodyL: 'text-content-primary',
  bodyM: 'text-content-secondary',
  caption: 'text-content-muted',
  number: 'text-content-primary',
  title: 'text-content-primary',
  section: 'text-content-primary',
  row: 'text-content-primary',
  body: 'text-content-secondary',
};

export function AppText({
  variant = 'bodyM',
  muted,
  tabular,
  className,
  style,
  ...props
}: AppTextProps) {
  const mutedClass = muted ? 'text-content-muted' : variantColors[variant];
  const tabularStyle: TextStyle | undefined = tabular ? { fontVariant: ['tabular-nums'] } : undefined;

  return (
    <Text
      className={`${mutedClass} ${className ?? ''}`}
      style={[variantStyles[variant], tabularStyle, style]}
      {...props}
    />
  );
}