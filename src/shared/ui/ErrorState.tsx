import { View } from 'react-native';
import { AppText } from './AppText';
import { AppButton } from './AppButton';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Не удалось загрузить данные',
  description = 'Проверь подключение и попробуй снова.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-12 px-6">
      <AppText variant="h3" className="text-center mb-2">
        {title}
      </AppText>
      <AppText variant="bodyM" muted className="text-center mb-8">
        {description}
      </AppText>
      {onRetry ? <AppButton label="Повторить" onPress={onRetry} className="min-w-[200px]" /> : null}
    </View>
  );
}