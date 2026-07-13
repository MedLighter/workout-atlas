import { Pressable, type PressableProps } from 'react-native';
import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface AppButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  compact?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-emerald-500 active:bg-emerald-400',
  secondary: 'bg-zinc-800 border border-zinc-700 active:bg-zinc-700',
  ghost: 'bg-transparent border border-zinc-700 active:bg-zinc-900',
  danger: 'bg-red-500/20 border border-red-500/40 active:bg-red-500/30',
};

const textClasses: Record<Variant, string> = {
  primary: 'text-zinc-950 font-semibold',
  secondary: 'text-zinc-50 font-medium',
  ghost: 'text-zinc-300 font-medium',
  danger: 'text-red-500 font-medium',
};

export function AppButton({
  label,
  variant = 'primary',
  compact,
  disabled,
  className,
  ...props
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={`rounded-xl items-center justify-center ${compact ? 'px-3 py-2' : 'px-4 py-3.5'} ${variantClasses[variant]} ${disabled ? 'opacity-40' : ''} ${className ?? ''}`}
      {...props}
    >
      <AppText className={`text-sm ${textClasses[variant]}`}>{label}</AppText>
    </Pressable>
  );
}