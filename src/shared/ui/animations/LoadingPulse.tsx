import { View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { AppText } from '../AppText';
import { BrandMark } from './BrandMark';

interface LoadingPulseProps {
  label?: string;
}

export function LoadingPulse({ label = 'Загрузка...' }: LoadingPulseProps) {
  return (
    <Animated.View entering={FadeIn.duration(240)} className="flex-1 items-center justify-center px-8">
      <BrandMark size={96} pulse />
      <Animated.View entering={FadeInUp.delay(120).duration(320)} className="mt-6 items-center">
        <AppText variant="section" className="mb-1 text-center">
          Workout Atlas
        </AppText>
        <AppText variant="body" muted className="text-center">
          {label}
        </AppText>
      </Animated.View>
    </Animated.View>
  );
}