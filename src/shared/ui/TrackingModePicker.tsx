import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { TrackingMode } from '../../features/workout/model/workout.types';
import { AppText } from './AppText';
import { MOTION } from './animations/motion';

interface TrackingModePickerProps {
  value: TrackingMode;
  onChange: (mode: TrackingMode) => void;
}

const OPTIONS: {
  id: TrackingMode;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'simple',
    title: 'Быстро',
    description: 'Одним тапом отмечаешь упражнение. Минимум экранов.',
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'detailed',
    title: 'Детально',
    description: 'Вес, повторы, подходы. Для прогрессии.',
    icon: 'barbell-outline',
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ModeCard({
  selected,
  title,
  description,
  icon,
  onPress,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(MOTION.pressScale, MOTION.spring);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, MOTION.spring);
      }}
      style={cardStyle}
      className={`rounded-2xl border p-4 flex-row gap-3 active:opacity-90 ${
        selected ? 'bg-emerald-950/40 border-emerald-500/50' : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          selected ? 'bg-emerald-500/20' : 'bg-zinc-800'
        }`}
      >
        <Ionicons name={icon} size={20} color={selected ? '#34D399' : '#A1A1AA'} />
      </View>
      <View className="flex-1">
        <AppText variant="row" className="text-sm mb-0.5">
          {title}
        </AppText>
        <AppText variant="caption" muted>
          {description}
        </AppText>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={22} color="#10B981" /> : null}
    </AnimatedPressable>
  );
}

export function TrackingModePicker({ value, onChange }: TrackingModePickerProps) {
  return (
    <View className="gap-2">
      {OPTIONS.map((option) => (
        <ModeCard
          key={option.id}
          selected={value === option.id}
          title={option.title}
          description={option.description}
          icon={option.icon}
          onPress={() => onChange(option.id)}
        />
      ))}
    </View>
  );
}