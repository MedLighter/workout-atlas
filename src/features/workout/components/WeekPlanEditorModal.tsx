import { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { WeeklyProgram, WorkoutSession } from '../model/workout.types';

import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { KeyboardFormScroll } from '../../../shared/ui/KeyboardFormScroll';
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
  const { bottom, top } = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Keyboard.dismiss();
    }
  }, [visible]);

  const handleReset = () => {
    onReset();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={top}
      >
        <Pressable className="flex-1 bg-black/70 justify-end" onPress={onClose}>
          <Pressable
            className="bg-zinc-950 border-t border-zinc-800 rounded-t-3xl"
            style={{ maxHeight: '92%' }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center pt-3 pb-2">
              <View className="w-10 h-1 bg-zinc-700 rounded-full" />
            </View>

            <KeyboardFormScroll
              withAvoidingView={false}
              style={{ maxHeight: '100%' }}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              footerSpacing={bottom + 16}
            >
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="calendar-outline" size={20} color="#34D399" />
                <AppText variant="section">План недели</AppText>
              </View>
              <AppText variant="body" muted className="mb-4">
                Быстрые пресеты или ручная настройка по дням.
              </AppText>

              <WeekScheduleEditor
                program={program}
                templates={templates}
                onUpdateDay={onUpdateDay}
                onApplyPreset={onApplyPreset}
              />

              <View className="gap-2 mt-4">
                <AppButton
                  label="Готово"
                  onPress={() => {
                    Keyboard.dismiss();
                    onClose();
                  }}
                />
                <AppButton
                  label="Сбросить по умолчанию"
                  variant="ghost"
                  onPress={handleReset}
                />
              </View>
            </KeyboardFormScroll>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}