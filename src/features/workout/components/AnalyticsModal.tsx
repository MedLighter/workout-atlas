import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Exercise } from '../model/workout.types';
import type { ProgressionSuggestion } from '../model/progression.types';
import { selectEstimatedOneRm } from '../model/workout.selectors';
import { ProgressionCard } from './ProgressionCard';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { MediaAssetView } from '../../media/components/MediaAssetView';
import { colors } from '../../../shared/theme/tokens';

interface AnalyticsModalProps {
  visible: boolean;
  exercise: Exercise | null;
  unit: string;
  progressionSuggestion?: ProgressionSuggestion | null;
  onClose: () => void;
}

export function AnalyticsModal({
  visible,
  exercise,
  unit,
  progressionSuggestion,
  onClose,
}: AnalyticsModalProps) {
  const { bottom } = useSafeAreaInsets();

  if (!exercise) return null;

  const oneRm = selectEstimatedOneRm(exercise);
  const oneRmDisplay = oneRm?.replace(' (оценка)', '') ?? null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/80 justify-end" onPress={onClose}>
        <Pressable
          className="border-t border-border-strong rounded-t-xl max-h-[92%]"
          style={{ backgroundColor: colors.bgSecondary }}
          onPress={(e) => e.stopPropagation()}
        >
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 rounded-full" style={{ backgroundColor: colors.borderStrong }} />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottom + 32 }}>
            <View className="flex-row items-center justify-between mb-4">
              <AppText variant="bodyL">Atlas</AppText>
              <Pressable onPress={onClose} className="w-9 h-9 rounded-full items-center justify-center" style={{ backgroundColor: colors.surfacePrimary }}>
                <Ionicons name="close" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            <AppText variant="h2" className="mb-1">{exercise.name}</AppText>
            <AppText variant="caption" muted className="mb-4">
              {[...(exercise.muscleGroups ?? []), ...(exercise.equipment ?? [])].join(' · ')}
            </AppText>

            <View className="flex-row gap-3 mb-3">
              <View className="flex-1">
                <MediaAssetView assets={exercise.media} role="exercise_demo" height={120} />
              </View>
              <View className="flex-1">
                <MediaAssetView assets={exercise.media} role="muscle_map" height={120} />
              </View>
            </View>

            <View className="flex-row gap-2 mb-4">
              <View className="flex-1 p-3 rounded-md border border-border-subtle" style={{ backgroundColor: colors.surfacePrimary }}>
                <AppText variant="caption" muted>1ПМ</AppText>
                <AppText variant="h3" tabular>{oneRmDisplay ? `${oneRmDisplay} ${unit}` : '—'}</AppText>
              </View>
              <View className="flex-1 p-3 rounded-md border border-border-subtle" style={{ backgroundColor: colors.surfacePrimary }}>
                <AppText variant="caption" muted>Лучший подход</AppText>
                <AppText variant="h3" tabular>
                  {exercise.history?.[0]?.sets?.[0]
                    ? `${exercise.history[0].sets[0].weight ?? '—'} ${unit} × ${exercise.history[0].sets[0].reps ?? '—'}`
                    : '—'}
                </AppText>
              </View>
            </View>

            {progressionSuggestion ? (
              <View className="mb-3">
                <AppText variant="caption" muted className="mb-2">
                  Прогрессия на следующий раз
                </AppText>
                <ProgressionCard suggestion={progressionSuggestion} unit={unit} variant="full" />
              </View>
            ) : null}

            {exercise.techniqueTips?.length ? (
              <View className="mb-3">
                <AppText variant="caption" muted className="mb-1">
                  Техника
                </AppText>
                {exercise.techniqueTips.map((tip) => (
                  <AppText key={tip} variant="body" className="mb-1">
                    · {tip}
                  </AppText>
                ))}
              </View>
            ) : null}

            {exercise.safetyNotes?.length ? (
              <View className="mb-3">
                <AppText variant="caption" className="text-amber-500 mb-1">
                  Безопасность
                </AppText>
                {exercise.safetyNotes.map((note) => (
                  <AppText key={note} variant="body" className="mb-1 text-amber-500/90">
                    · {note}
                  </AppText>
                ))}
              </View>
            ) : null}

            <View className="mb-2">
              <AppText variant="caption" muted className="mb-2">
                История
              </AppText>
              {exercise.history?.length ? (
                exercise.history.map((entry) => (
                  <View key={entry.id} className="mb-2 p-3 border border-border-subtle rounded-md" style={{ backgroundColor: colors.surfacePrimary }}>
                    <AppText variant="caption" className="mb-1">
                      {entry.date}
                    </AppText>
                    {entry.sets.map((set) => (
                      <AppText key={set.id} variant="body" muted>
                        {set.type}: {set.weight ?? '—'} {unit} x {set.reps ?? '—'}
                        {set.rpe ? ` @RPE ${set.rpe}` : ''}
                      </AppText>
                    ))}
                  </View>
                ))
              ) : (
                <AppText variant="body" muted>
                  История пока пуста
                </AppText>
              )}
            </View>

            <AppButton label="Закрыть" variant="secondary" onPress={onClose} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
