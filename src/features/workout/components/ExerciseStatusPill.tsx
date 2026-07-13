import { View } from 'react-native';
import type { ExerciseStatus } from '../model/workout.types';

interface ExerciseStatusPillProps {
  status: ExerciseStatus;
}

const statusConfig: Record<ExerciseStatus, { className: string; pulse?: boolean }> = {
  not_started: { className: 'border-zinc-600 bg-transparent' },
  in_progress: { className: 'border-emerald-500 bg-emerald-500/20', pulse: true },
  done: { className: 'border-emerald-500 bg-emerald-500' },
  skipped: { className: 'border-zinc-700 bg-zinc-800' },
};

export function ExerciseStatusPill({ status }: ExerciseStatusPillProps) {
  const config = statusConfig[status];
  return (
    <View
      className={`w-3 h-3 rounded-full border ${config.className} ${config.pulse ? 'opacity-90' : ''}`}
    />
  );
}