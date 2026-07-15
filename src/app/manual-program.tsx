import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../shared/ui/SafeScreen';
import { AppText } from '../shared/ui/AppText';
import { AppButton } from '../shared/ui/AppButton';
import { TextField } from '../shared/ui/TextField';
import { useState } from 'react';
import { useWorkoutStore } from '../features/workout/model/workout.store';
import { useSettingsStore } from '../features/settings/model/settings.store';

export default function ManualProgramRoute() {
  const router = useRouter();
  const [name, setName] = useState('Моя программа');
  const [daysPerWeek, setDaysPerWeek] = useState('3');
  const setWeeklyProgram = useWorkoutStore((s) => s.setWeeklyProgram);
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const handleCreate = () => {
    const count = Math.min(7, Math.max(1, parseInt(daysPerWeek, 10) || 3));
    const days = Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      type: weekday < count ? ('workout' as const) : ('rest' as const),
      title: weekday < count ? `День ${weekday + 1}` : 'Отдых',
    }));
    setWeeklyProgram({ id: 'program-manual', name, days });
    completeOnboarding();
    router.replace('/(tabs)/plan');
  };

  return (
    <SafeScreen className="justify-center">
      <AppText variant="h1" className="mb-6">Новая программа</AppText>
      <TextField label="Название" value={name} onChangeText={setName} className="mb-4" />
      <TextField
        label="Тренировок в неделю"
        value={daysPerWeek}
        onChangeText={setDaysPerWeek}
        keyboardType="number-pad"
        className="mb-8"
      />
      <AppButton label="Добавить тренировочный день" onPress={handleCreate} />
    </SafeScreen>
  );
}