import { useEffect } from 'react';
import { Keyboard, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeeklyProgram, WorkoutSession } from '../model/workout.types';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { colors } from '../../../shared/theme/tokens';
import { WeekScheduleEditor } from './WeekScheduleEditor';

interface WeekPlanEditorModalProps {
  visible: boolean;
  program: WeeklyProgram;
  templates: WorkoutSession[];
  onClose: () => void;
  onUpdateDay: (
    weekday: number,
    update: { type: 'rest' } | { type: 'workout'; templateId: string; title: string },
  ) => void;
  onApplyPreset: (program: WeeklyProgram) => void;
  onReset: () => void;
}

export function WeekPlanEditorModal({
  visible,
  program,
  templates,
  onClose,
  onUpdateDay,
  onApplyPreset,
  onReset,
}: WeekPlanEditorModalProps) {
  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheet visible={visible} onClose={onClose} scrollable maxHeightRatio={0.92}>
      <View className="flex-row items-center gap-2 mb-1">
        <View
          className="w-9 h-9 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.accentSurface }}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.accentPrimary} />
        </View>
        <AppText variant="h2">План недели</AppText>
      </View>
      <AppText variant="bodyM" muted className="mb-4">
        Быстрые пресеты или ручная настройка по дням.
      </AppText>

      <WeekScheduleEditor
        program={program}
        templates={templates}
        onUpdateDay={onUpdateDay}
        onApplyPreset={onApplyPreset}
      />

      <View className="gap-2 mt-5">
        <AppButton
          label="Готово"
          onPress={() => {
            Keyboard.dismiss();
            onClose();
          }}
        />
        <AppButton label="Сбросить по умолчанию" variant="ghost" onPress={onReset} />
      </View>
    </BottomSheet>
  );
}