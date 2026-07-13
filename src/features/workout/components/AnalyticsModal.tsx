import { Modal, Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Exercise } from '../model/workout.types';
import { selectEstimatedOneRm } from '../model/workout.selectors';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { MediaAssetView } from '../../media/components/MediaAssetView';

interface AnalyticsModalProps {
  visible: boolean;
  exercise: Exercise | null;
  unit: string;
  onClose: () => void;
}

export function AnalyticsModal({ visible, exercise, unit, onClose }: AnalyticsModalProps) {
  const { bottom } = useSafeAreaInsets();

  if (!exercise) return null;

  const oneRm = selectEstimatedOneRm(exercise);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
        <Pressable className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[88%]" onPress={(e) => e.stopPropagation()}>
          <View className="items-center pt-3 pb-2">
            <View className="w-10 h-1 bg-zinc-700 rounded-full" />
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: bottom + 32 }}>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="w-8 h-8 rounded-full bg-emerald-500/15 items-center justify-center">
                <Ionicons name="map" size={16} color="#34D399" />
              </View>
              <View className="flex-1">
                <AppText variant="section">{exercise.name}</AppText>
                <AppText variant="caption" className="text-emerald-400">
                  Atlas Layer · карта нагрузки
                </AppText>
              </View>
            </View>
            <AppText variant="body" muted className="mb-4">
              Демо, мышцы, история и оценка 1ПМ — всё по этому упражнению в одном месте.
            </AppText>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <MediaAssetView assets={exercise.media} role="exercise_demo" height={120} />
              </View>
              <View className="flex-1">
                <MediaAssetView assets={exercise.media} role="muscle_map" height={120} />
              </View>
            </View>

            {exercise.muscleGroups?.length ? (
              <View className="mb-3">
                <AppText variant="caption" muted className="mb-1">
                  Мышцы
                </AppText>
                <AppText variant="body">{exercise.muscleGroups.join(' · ')}</AppText>
              </View>
            ) : null}

            {exercise.equipment?.length ? (
              <View className="mb-3">
                <AppText variant="caption" muted className="mb-1">
                  Оборудование
                </AppText>
                <AppText variant="body">{exercise.equipment.join(' · ')}</AppText>
              </View>
            ) : null}

            {oneRm ? (
              <View className="mb-3 p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-xl">
                <AppText variant="caption" muted className="mb-1">
                  Estimated 1ПМ
                </AppText>
                <AppText variant="row" className="text-emerald-400">
                  {oneRm} {unit}
                </AppText>
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
                  <View key={entry.id} className="mb-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
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