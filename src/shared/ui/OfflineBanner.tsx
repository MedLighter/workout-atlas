import { View } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../theme/tokens';

interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({
  message = 'Работаем офлайн. Тренировка сохранится на устройстве.',
}: OfflineBannerProps) {
  return (
    <View
      className="rounded-md px-4 py-3 mb-4 border border-border-subtle"
      style={{ backgroundColor: colors.accentSurface }}
    >
      <AppText variant="bodyM" className="text-content-secondary">
        {message}
      </AppText>
    </View>
  );
}