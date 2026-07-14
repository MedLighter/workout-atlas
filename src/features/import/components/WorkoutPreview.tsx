import { View } from 'react-native';
import type { WorkoutImportDocument } from '../model/import.types';
import { isProgramImportDocument } from '../model/import.types';
import { WEEKDAY_LABELS } from '../../workout/model/workout.schedule';
import { PROGRESSION_CADENCE_LABELS } from '../../workout/model/progression.types';
import { AppText } from '../../../shared/ui/AppText';

interface WorkoutPreviewProps {
  document: WorkoutImportDocument;
}

export function WorkoutPreview({ document }: WorkoutPreviewProps) {
  if (isProgramImportDocument(document)) {
    const progression = document.progression;

    return (
      <View className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-2">
        <AppText variant="section" className="mb-1">
          {document.title}
        </AppText>
        <AppText variant="caption" muted className="mb-3">
          program · {document.unit} · {document.workouts.length} тренировок
        </AppText>

        <AppText variant="caption" className="text-emerald-400 mb-2">
          Расписание
        </AppText>
        {document.schedule.map((day) => (
          <AppText key={day.weekday} variant="caption" muted className="mb-1">
            {WEEKDAY_LABELS[day.weekday]} —{' '}
            {day.type === 'rest' ? 'отдых' : day.workoutTitle}
          </AppText>
        ))}

        {progression ? (
          <View className="mt-3 pt-3 border-t border-zinc-800">
            <AppText variant="caption" className="text-emerald-400 mb-1">
              Прогрессия
            </AppText>
            <AppText variant="caption" muted>
              {progression.enabled ? 'включена' : 'выключена'} · {progression.mode} ·{' '}
              {PROGRESSION_CADENCE_LABELS[progression.cadence]}
              {progression.cadence === 'every_n_sessions' && progression.cadenceEverySessions
                ? ` (${progression.cadenceEverySessions})`
                : ''}
            </AppText>
          </View>
        ) : null}

        <View className="mt-3 pt-3 border-t border-zinc-800">
          {document.workouts.map((workout, index) => (
            <View key={`${workout.title}-${index}`} className="mb-2">
              <AppText variant="row" className="text-sm">
                {workout.title}
              </AppText>
              <AppText variant="caption" muted>
                {workout.exercises.length} упражнений
              </AppText>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-2">
      <AppText variant="section" className="mb-1">
        {document.title}
      </AppText>
      <AppText variant="caption" muted className="mb-3">
        {document.documentType} · {document.unit}
        {document.estimatedDurationMin ? ` · ~${document.estimatedDurationMin} мин` : ''}
      </AppText>

      {document.exercises.map((exercise, index) => (
        <View key={`${exercise.name}-${index}`} className="py-2 border-t border-zinc-800">
          <AppText variant="row" className="text-base">
            {exercise.name}
          </AppText>
          <AppText variant="caption" muted>
            {(exercise.sets ?? []).length} подходов
            {exercise.muscleGroups?.length ? ` · ${exercise.muscleGroups.join(', ')}` : ''}
          </AppText>
        </View>
      ))}
    </View>
  );
}