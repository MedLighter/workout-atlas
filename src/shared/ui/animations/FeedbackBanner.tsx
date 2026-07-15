import { View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../AppText';

interface FeedbackBannerProps {
  tone: 'success' | 'error' | 'warning';
  message: string;
}

const TONE_STYLES = {
  success: {
    container: 'bg-emerald-500/10 border-emerald-500/30',
    text: 'text-emerald-400',
    icon: 'checkmark-circle' as const,
    color: '#34D399',
    entering: ZoomIn.springify().damping(16),
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30',
    text: 'text-red-400',
    icon: 'close-circle' as const,
    color: '#F87171',
    entering: FadeInDown.duration(260),
  },
  warning: {
    container: 'bg-amber-500/10 border-amber-500/30',
    text: 'text-amber-400',
    icon: 'alert-circle' as const,
    color: '#FBBF24',
    entering: FadeInUp.duration(260),
  },
};

export function FeedbackBanner({ tone, message }: FeedbackBannerProps) {
  const styles = TONE_STYLES[tone];

  return (
    <Animated.View entering={styles.entering} className={`p-3 rounded-xl border ${styles.container}`}>
      <View className="flex-row items-start gap-2">
        <Ionicons name={styles.icon} size={18} color={styles.color} />
        <AppText variant="body" className={`flex-1 ${styles.text}`}>
          {message}
        </AppText>
      </View>
    </Animated.View>
  );
}