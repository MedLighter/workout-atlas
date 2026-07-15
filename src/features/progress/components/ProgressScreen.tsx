import { useState } from 'react';
import { View } from 'react-native';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppCard } from '../../../shared/ui/AppCard';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { PressableScale } from '../../../shared/ui/PressableScale';
import { StaggerItem } from '../../../shared/ui/animations/StaggerItem';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { estimateSessionVolume } from '../../workout/utils/focus-flow.logic';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../shared/theme/tokens';

type Period = 'week' | 'month' | 'quarter' | 'all';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'week', label: 'Неделя' },
  { id: 'month', label: 'Месяц' },
  { id: 'quarter', label: '3 месяца' },
  { id: 'all', label: 'Всё время' },
];

export function ProgressScreen() {
  const [period, setPeriod] = useState<Period>('week');
  const completedSessions = useWorkoutStore((s) => s.completedSessions);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);

  const targetPerWeek = weeklyProgram.days.filter((d) => d.type === 'workout').length;
  const thisWeekCount = completedSessions.filter((s) => {
    const date = new Date(s.date);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    return date >= weekAgo;
  }).length;

  if (completedSessions.length === 0) {
    return (
      <SafeScreen reserveTabBar>
        <EmptyState
          title="Здесь появится история"
          description="Заверши первую тренировку, чтобы увидеть динамику."
        />
      </SafeScreen>
    );
  }

  const latest = completedSessions[0];
  const volume = estimateSessionVolume(latest);

  return (
    <SafeScreen scrollable reserveTabBar>
      <StaggerItem index={0}>
        <View className="pt-2 mb-5">
          <AppText variant="h1">Прогресс</AppText>
          <AppText variant="caption" muted className="mt-1">
            История и объём нагрузки
          </AppText>
        </View>
      </StaggerItem>

      <StaggerItem index={1}>
        <View className="flex-row gap-2 mb-6">
          {PERIODS.map((p) => (
            <PressableScale key={p.id} onPress={() => setPeriod(p.id)} scaleTo={0.94}>
              <AppText
                variant="caption"
                className={`px-3 py-2 rounded-md ${period === p.id ? 'bg-accent-surface text-accent' : 'text-content-muted'}`}
              >
                {p.label}
              </AppText>
            </PressableScale>
          ))}
        </View>
      </StaggerItem>

      <FadeSlideIn key={period}>
        <AppCard elevated className="mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colors.accentSurfaceStrong }}>
              <Ionicons name="trending-up-outline" size={24} color={colors.accentBright} />
            </View>
            <View className="flex-1">
              <AppText variant="h3">{thisWeekCount} тренировки на этой неделе</AppText>
              <AppText variant="bodyM" muted>Цель: {targetPerWeek}</AppText>
            </View>
          </View>
        </AppCard>

        <AppCard className="mb-4">
          <AppText variant="h3" className="mb-2">Последняя тренировка</AppText>
          <AppText variant="bodyL">{latest.title}</AppText>
          <AppText variant="bodyM" muted>
            {latest.exercises.length} упражнений · {volume > 0 ? `Объём: ${volume.toLocaleString('ru-RU')} ${latest.unit}` : '—'}
          </AppText>
        </AppCard>
      </FadeSlideIn>

      <StaggerItem index={4}>
        <AppText variant="h3" className="mb-3">История</AppText>
      </StaggerItem>
      {completedSessions.slice(0, 10).map((session, index) => (
        <AppCard key={session.id} className="mb-3" enterIndex={5 + index}>
          <AppText variant="bodyL">{session.title}</AppText>
          <AppText variant="caption" muted>
            {session.date} · {session.exercises.reduce((s, e) => s + e.sets.filter((set) => set.completed).length, 0)} подходов
          </AppText>
        </AppCard>
      ))}
    </SafeScreen>
  );
}