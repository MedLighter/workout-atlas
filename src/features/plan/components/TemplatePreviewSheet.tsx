import { View } from 'react-native';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { AppText } from '../../../shared/ui/AppText';
import { WEEKDAY_LABELS } from '../../workout/model/workout.schedule';
import { formatPreviousSet } from '../../workout/utils/workoutStatus';
import type { Exercise, WeeklyProgram, WorkoutSession, WorkoutSet } from '../../workout/model/workout.types';
import { colors } from '../../../shared/theme/tokens';

interface TemplatePreviewSheetProps {
  visible: boolean;
  template: WorkoutSession | null;
  weeklyProgram?: WeeklyProgram;
  onClose: () => void;
}

function formatSetLine(set: WorkoutSet, unit: string, index: number): string {
  const weight = set.weight ?? set.previousWeight;
  const reps = set.reps ?? set.previousReps;
  const withWeight = formatPreviousSet(weight, reps, unit);
  if (withWeight) return withWeight;
  if (reps != null) return `${reps} повт.`;
  return `подход ${index + 1}`;
}

function summarizeSets(exercise: Exercise, unit: string): string {
  return exercise.sets.map((set, index) => formatSetLine(set, unit, index)).join(' · ');
}

export function TemplatePreviewSheet({
  visible,
  template,
  weeklyProgram,
  onClose,
}: TemplatePreviewSheetProps) {
  const totalSets = template?.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0) ?? 0;
  const scheduleDays =
    template && weeklyProgram
      ? weeklyProgram.days.filter(
          (day) => day.type === 'workout' && day.templateId === template.id,
        )
      : [];

  return (
    <BottomSheet visible={visible && template != null} onClose={onClose} scrollable maxHeightRatio={0.82}>
      {template ? (
        <>
      <AppText variant="h2" className="mb-1">
        {template.title}
      </AppText>
      <AppText variant="bodyM" muted className="mb-4">
        {template.exercises.length} упражнений · {totalSets} подходов · {template.unit}
      </AppText>

      {scheduleDays.length > 0 ? (
        <View
          className="rounded-md border border-border-subtle px-3 py-2.5 mb-4"
          style={{ backgroundColor: colors.accentSurface }}
        >
          <AppText variant="caption" className="text-accent mb-1">
            В расписании
          </AppText>
          <AppText variant="bodyM">
            {scheduleDays.map((day) => WEEKDAY_LABELS[day.weekday]).join(', ')}
          </AppText>
        </View>
      ) : null}

      <AppText variant="caption" muted className="mb-2">
        Состав
      </AppText>

      {template.exercises.map((exercise, index) => (
        <View
          key={exercise.id}
          className={`py-3 ${index < template.exercises.length - 1 ? 'border-b border-border-subtle' : ''}`}
        >
          <AppText variant="bodyL" className="mb-1">
            {index + 1}. {exercise.name}
          </AppText>
          <AppText variant="caption" muted>
            {summarizeSets(exercise, template.unit)}
          </AppText>
          {exercise.muscleGroups?.length ? (
            <AppText variant="caption" muted className="mt-1">
              {exercise.muscleGroups.join(' · ')}
            </AppText>
          ) : null}
        </View>
      ))}
        </>
      ) : null}
    </BottomSheet>
  );
}