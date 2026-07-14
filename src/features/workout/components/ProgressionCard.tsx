import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ProgressionSuggestion } from '../model/progression.types';
import {
  formatProgressionSuggestion,
  formatWeightDelta,
  getProgressionFillPercent,
} from '../utils/progression';
import { AppText } from '../../../shared/ui/AppText';

interface ProgressionCardProps {
  suggestion: ProgressionSuggestion;
  unit: string;
  variant?: 'compact' | 'full';
}

const trendMeta = {
  up: {
    icon: 'trending-up' as const,
    color: '#34D399',
    badge: 'bg-emerald-500/15 border-emerald-500/30',
    bar: 'bg-emerald-500',
    label: 'Рост',
  },
  hold: {
    icon: 'remove' as const,
    color: '#A1A1AA',
    badge: 'bg-zinc-800 border-zinc-700',
    bar: 'bg-zinc-500',
    label: 'Держим',
  },
  down: {
    icon: 'trending-down' as const,
    color: '#FBBF24',
    badge: 'bg-amber-500/10 border-amber-500/25',
    bar: 'bg-amber-500',
    label: 'Deload',
  },
};

export function ProgressionCard({ suggestion, unit, variant = 'full' }: ProgressionCardProps) {
  const meta = trendMeta[suggestion.trend];
  const delta = formatWeightDelta(suggestion, unit);
  const fill = getProgressionFillPercent(suggestion);

  if (variant === 'compact') {
    return (
      <View className={`self-start mt-2 px-2.5 py-1 rounded-full border flex-row items-center gap-1.5 ${meta.badge}`}>
        <Ionicons name={meta.icon} size={12} color={meta.color} />
        <AppText variant="caption" style={{ color: meta.color }}>
          {formatProgressionSuggestion(suggestion, unit)}
        </AppText>
      </View>
    );
  }

  return (
    <View className="mt-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
      <View className="px-3.5 py-3 flex-row items-start gap-3">
        <View
          className={`w-10 h-10 rounded-xl border items-center justify-center ${meta.badge}`}
        >
          <Ionicons name={meta.icon} size={18} color={meta.color} />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <AppText variant="caption" className="text-emerald-400/90">
              Прогрессия
            </AppText>
            <View className={`px-2 py-0.5 rounded-full border ${meta.badge}`}>
              <AppText variant="caption" style={{ color: meta.color }}>
                {meta.label}
              </AppText>
            </View>
          </View>

          <AppText variant="row" className="text-zinc-50 mb-0.5">
            {suggestion.weight} {unit} × {suggestion.reps}
          </AppText>
          <AppText variant="caption" muted>
            {suggestion.reason}
          </AppText>
        </View>
      </View>

      <View className="px-3.5 pb-3">
        <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
          <View className={`h-full rounded-full ${meta.bar}`} style={{ width: `${fill}%` }} />
        </View>

        <View className="flex-row items-center justify-between">
          <AppText variant="caption" muted>
            {suggestion.baselineWeight != null
              ? `Было ${suggestion.baselineWeight} ${unit} × ${suggestion.baselineReps ?? '—'}`
              : 'База из прошлой тренировки'}
          </AppText>
          {delta ? (
            <AppText variant="caption" style={{ color: meta.color }}>
              {delta}
            </AppText>
          ) : null}
        </View>

        {suggestion.basedOnDate ? (
          <AppText variant="caption" muted className="mt-1">
            Основано на {suggestion.basedOnDate}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}