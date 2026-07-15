import { View } from 'react-native';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';
import { StaggerItem } from '../../../shared/ui/animations/StaggerItem';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import type { WorkoutSession } from '../../workout/model/workout.types';

interface WorkoutPrepCardProps {
  session: WorkoutSession;
  restTimerSec: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onStart: () => void;
  onBack?: () => void;
}

function formatRest(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function WorkoutPrepCard({
  session,
  restTimerSec,
  soundEnabled,
  vibrationEnabled,
  onStart,
  onBack,
}: WorkoutPrepCardProps) {
  return (
    <View className="flex-1 justify-center">
      <FadeSlideIn>
        <AppText variant="caption" muted className="mb-2">
          Шаг 2 из 2
        </AppText>
        <AppText variant="h1" className="mb-2">
          Перед стартом
        </AppText>
        <AppText variant="bodyM" muted className="mb-6">
          {session.title} · {session.exercises.length} упражнений
        </AppText>
      </FadeSlideIn>

      <StaggerItem index={1}>
      <AppCard className="mb-8">
        <AppText variant="caption" muted className="mb-3">
          Проверь настройки
        </AppText>
        <PrepRow label="Таймер отдыха" value={formatRest(restTimerSec)} />
        <PrepRow label="Звук" value={soundEnabled ? 'Включён' : 'Выключен'} />
        <PrepRow label="Вибрация" value={vibrationEnabled ? 'Включена' : 'Выключена'} />
      </AppCard>
      </StaggerItem>

      <StaggerItem index={2}>
        <AppButton label="Начать тренировку" onPress={onStart} className="mb-3" />
      </StaggerItem>
      {onBack ? (
        <StaggerItem index={3}>
          <AppButton label="Назад" variant="ghost" onPress={onBack} />
        </StaggerItem>
      ) : null}
    </View>
  );
}

function PrepRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between py-2 border-b border-border-subtle last:border-b-0">
      <AppText variant="bodyM">{label}</AppText>
      <AppText variant="bodyM" muted>
        {value}
      </AppText>
    </View>
  );
}