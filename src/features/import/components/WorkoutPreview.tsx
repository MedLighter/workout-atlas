import { View } from 'react-native';
import type { WorkoutImportDocument } from '../model/import.types';
import { AppText } from '../../../shared/ui/AppText';

interface WorkoutPreviewProps {
  document: WorkoutImportDocument;
}

export function WorkoutPreview({ document }: WorkoutPreviewProps) {
  return (
    <View className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4">
      <AppText variant="section" className="mb-1">
        {document.title}
      </AppText>
      <AppText variant="caption" muted className="mb-3">
        {document.documentType} · {document.unit}
        {document.estimatedDurationMin ? ` · ~${document.estimatedDurationMin} мин` : ''}
      </AppText>

      {document.exercises.map((exercise, index) => (
        <View
          key={`${exercise.name}-${index}`}
          className="py-2 border-t border-zinc-800"
        >
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