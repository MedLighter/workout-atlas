import { View } from 'react-native';
import type { ValidationMessage } from '../model/import.types';
import { AppText } from '../../../shared/ui/AppText';

interface ValidationBannerProps {
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

export function ValidationBanner({ errors, warnings }: ValidationBannerProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <View className="gap-2 mb-4">
      {errors.map((item, index) => (
        <View key={`error-${index}`} className="p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <AppText variant="body" className="text-red-500">
            {item.message}
          </AppText>
        </View>
      ))}
      {warnings.map((item, index) => (
        <View key={`warn-${index}`} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <AppText variant="body" className="text-amber-500">
            {item.message}
          </AppText>
        </View>
      ))}
    </View>
  );
}