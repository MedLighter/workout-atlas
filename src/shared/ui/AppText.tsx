import { Text, type TextProps } from 'react-native';

type Variant = 'title' | 'section' | 'row' | 'body' | 'caption';

interface AppTextProps extends TextProps {
  variant?: Variant;
  muted?: boolean;
}

const variantClasses: Record<Variant, string> = {
  title: 'text-[28px] leading-[34px] font-bold text-zinc-50',
  section: 'text-[18px] leading-6 font-semibold text-zinc-50',
  row: 'text-base leading-[22px] font-semibold text-zinc-50',
  body: 'text-sm leading-5 text-zinc-300',
  caption: 'text-xs leading-4 font-medium text-zinc-400',
};

export function AppText({ variant = 'body', muted, className, ...props }: AppTextProps) {
  const mutedClass = muted ? 'text-zinc-500' : '';
  return (
    <Text
      className={`${variantClasses[variant]} ${mutedClass} ${className ?? ''}`}
      {...props}
    />
  );
}