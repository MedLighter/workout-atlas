import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { AppText } from '../../../shared/ui/AppText';
import { colors } from '../../../shared/theme/tokens';
import type { Exercise } from '../../workout/model/workout.types';
import { getExerciseStatus } from '../../workout/utils/workoutStatus';
import { countCompletedExercises } from '../../workout/utils/focus-flow.logic';
import type { WorkoutSession } from '../../workout/model/workout.types';

interface ExerciseListSheetProps {
  visible: boolean;
  session: WorkoutSession;
  activeIndex: number;
  onClose: () => void;
  onSelect: (index: number) => void;
  onSkip: (exerciseId: string) => void;
}

export function ExerciseListSheet({
  visible,
  session,
  activeIndex,
  onClose,
  onSelect,
  onSkip,
}: ExerciseListSheetProps) {
  const done = countCompletedExercises(session);

  return (
    <BottomSheet visible={visible} onClose={onClose} scrollable>
      <AppText variant="h3" className="mb-1">
        {session.title}
      </AppText>
      <AppText variant="bodyM" muted className="mb-5">
        {done} из {session.exercises.length} выполнено
      </AppText>

      {session.exercises.map((exercise, index) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
          isActive={index === activeIndex}
          onPress={() => {
            onSelect(index);
            onClose();
          }}
          onSkip={() => onSkip(exercise.id)}
        />
      ))}
    </BottomSheet>
  );
}

function ExerciseRow({
  exercise,
  isActive,
  onPress,
  onSkip,
}: {
  exercise: Exercise;
  isActive: boolean;
  onPress: () => void;
  onSkip: () => void;
}) {
  const status = getExerciseStatus(exercise);
  const icon = status === 'done' ? '✓' : isActive ? '●' : '○';
  const completedSets = exercise.sets.filter((s) => s.completed).length;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center py-3 border-b border-border-subtle"
      style={{ opacity: status === 'done' ? 0.5 : 1 }}
    >
      <AppText
        variant="bodyL"
        className={`flex-1 ${isActive ? 'text-accent' : 'text-content-primary'}`}
      >
        {icon} {exercise.name}
      </AppText>
      <AppText variant="caption" muted className="mr-3">
        {completedSets}/{exercise.sets.length}
      </AppText>
      <Pressable onPress={onSkip} hitSlop={8} accessibilityLabel="Пропустить упражнение">
        <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
}