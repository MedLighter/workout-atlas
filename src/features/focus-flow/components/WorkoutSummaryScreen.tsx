import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import { useWorkoutStore } from '../../workout/model/workout.store';
import {
  countCompletedSets,
  estimateSessionVolume,
  getElapsedMinutes,
} from '../../workout/utils/focus-flow.logic';

export function WorkoutSummaryScreen() {
  const router = useRouter();
  const completedSessions = useWorkoutStore((s) => s.completedSessions);
  const lastFinishedSessionId = useWorkoutStore((s) => s.lastFinishedSessionId);
  const workoutStartedAt = useWorkoutStore((s) => s.workoutStartedAt);
  const dismissSummary = useWorkoutStore((s) => s.dismissSummary);
  const setWorkoutFeedback = useWorkoutStore((s) => s.setWorkoutFeedback);
  const workoutFeedback = useWorkoutStore((s) => s.workoutFeedback);

  const session = completedSessions.find((s) => s.id === lastFinishedSessionId) ?? completedSessions[0];

  if (!session) {
    router.replace('/(tabs)');
    return null;
  }

  const sets = countCompletedSets(session);
  const volume = estimateSessionVolume(session);
  const minutes = workoutStartedAt ? getElapsedMinutes({
    workoutStartedAt,
    pausedAt: null,
    elapsedBeforePauseMs: 0,
  } as never) : 0;

  const handleDone = () => {
    dismissSummary();
    router.replace('/(tabs)');
  };

  return (
    <SafeScreen scrollable className="pb-8">
      <AppText variant="h1" className="mb-2">
        Тренировка завершена
      </AppText>

      <AppCard elevated className="mb-6 mt-4">
        <AppText variant="bodyL">{session.exercises.length} упражнений</AppText>
        <AppText variant="bodyM" muted>
          {sets} подходов · {minutes || '—'} минут
        </AppText>
        {volume > 0 ? (
          <AppText variant="bodyM" muted className="mt-1">
            Объём: {volume.toLocaleString('ru-RU')} {session.unit}
          </AppText>
        ) : null}
      </AppCard>

      <AppText variant="h3" className="mb-3">
        Как прошла тренировка?
      </AppText>
      <View className="flex-row gap-2 mb-6">
        {(['easy', 'normal', 'hard'] as const).map((level) => {
          const labels = { easy: 'Слишком легко', normal: 'Нормально', hard: 'Слишком тяжело' };
          return (
            <AppButton
              key={level}
              compact
              label={labels[level]}
              variant={workoutFeedback === level ? 'primary' : 'secondary'}
              onPress={() => setWorkoutFeedback(level)}
              className="flex-1"
            />
          );
        })}
      </View>

      <AppButton label="Готово" onPress={handleDone} />
    </SafeScreen>
  );
}