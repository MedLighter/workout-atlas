import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { TrackingMode } from '../../features/workout/model/workout.types';
import { AppText } from './AppText';

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
    description: 'Одним тапом — упражнение выполнено. Идеально для фокуса на процессе.',
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'detailed',
    title: 'Детально',
    description: 'Вес, повторы и каждый подход. Для прогрессии и аналитики.',
    icon: 'barbell-outline',
  },
];

export function TrackingModePicker({ value, onChange }: TrackingModePickerProps) {
  return (
    <View className="gap-2">
      {OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <Pressable
            key={option.id}
            onPress={() => onChange(option.id)}
            className={`rounded-2xl border p-4 flex-row gap-3 active:opacity-90 ${
              selected
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                selected ? 'bg-emerald-500/20' : 'bg-zinc-800'
              }`}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={selected ? '#34D399' : '#A1A1AA'}
              />
            </View>
            <View className="flex-1">
              <AppText variant="row" className="text-sm mb-0.5">
                {option.title}
              </AppText>
              <AppText variant="caption" muted>
                {option.description}
              </AppText>
            </View>
            {selected ? <Ionicons name="checkmark-circle" size={22} color="#10B981" /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}