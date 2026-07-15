import { View } from 'react-native';
import type { ValidationMessage } from '../model/import.types';
import { FeedbackBanner } from '../../../shared/ui/animations/FeedbackBanner';

interface ValidationBannerProps {
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  success?: boolean;
}

export function ValidationBanner({ errors, warnings, success }: ValidationBannerProps) {
  if (success && errors.length === 0) {
    return (
      <View className="mb-4">
        <FeedbackBanner tone="success" message="JSON проверен — можно импортировать" />
      </View>
    );
  }

  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <View className="gap-2 mb-4">
      {errors.map((item, index) => (
        <FeedbackBanner key={`error-${index}`} tone="error" message={item.message} />
      ))}
      {warnings.map((item, index) => (
        <FeedbackBanner key={`warn-${index}`} tone="warning" message={item.message} />
      ))}
    </View>
  );
}