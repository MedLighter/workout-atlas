import { type ReactNode } from 'react';
import { View } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';
import { FadeSlideIn } from './animations/FadeSlideIn';
import { StaggerItem } from './animations/StaggerItem';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  children?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  children,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12">
      <FadeSlideIn>
        {children}
        <AppText variant="h2" className="text-center mb-2">
          {title}
        </AppText>
        {description ? (
          <AppText variant="bodyM" muted className="text-center mb-8 max-w-[280px]">
            {description}
          </AppText>
        ) : null}
      </FadeSlideIn>
      {actionLabel && onAction ? (
        <StaggerItem index={1} className="w-full max-w-[320px]">
          <AppButton label={actionLabel} onPress={onAction} className="mb-3" />
        </StaggerItem>
      ) : null}
      {secondaryLabel && onSecondary ? (
        <StaggerItem index={2}>
          <AppButton label={secondaryLabel} variant="ghost" onPress={onSecondary} />
        </StaggerItem>
      ) : null}
    </View>
  );
}