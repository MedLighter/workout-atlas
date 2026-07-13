import { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TextInput,
  View,
  type ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ScheduleDay, WeeklyProgram, WorkoutSession } from '../model/workout.types';
import { WEEKDAY_NAMES, defaultWeeklyProgram } from '../model/workout.schedule';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { KeyboardFormScroll, scrollInputIntoView } from '../../../shared/ui/KeyboardFormScroll';

interface WeekPlanEditorModalProps {
  visible: boolean;
  program: WeeklyProgram;
  templates: WorkoutSession[];
  onClose: () => void;
  onUpdateDay: (
    weekday: number,
    update: { type: 'rest' } | { type: 'workout'; templateId: string; title: string },
  ) => void;
  onSetProgramName: (name: string) => void;
  onReset: () => void;
}

export function WeekPlanEditorModal({
  visible,
  program,
  templates,
  onClose,
  onUpdateDay,
  onSetProgramName,
  onReset,
}: WeekPlanEditorModalProps) {
  const { bottom, top } = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const nameFieldRef = useRef<View>(null);
  const [expandedWeekday, setExpandedWeekday] = useState<number | null>(null);
  const [programName, setProgramName] = useState(program.name);

  useEffect(() => {
    if (visible) {
      setProgramName(program.name);
      setExpandedWeekday(null);
    }
  }, [visible, program.name]);

  const toggleDay = (weekday: number) => {
    Keyboard.dismiss();
    setExpandedWeekday((current) => (current === weekday ? null : weekday));
  };

  const handleSaveName = () => {
    onSetProgramName(programName);
  };

  const handleSelect = (
    day: ScheduleDay,
    update: { type: 'rest' } | { type: 'workout'; templateId: string; title: string },
  ) => {
    Keyboard.dismiss();
    onUpdateDay(day.weekday, update);
    setExpandedWeekday(null);
  };

  const handleReset = () => {
    onReset();
    setProgramName(defaultWeeklyProgram.name);
    setExpandedWeekday(null);
  };

  const focusNameField = () => {
    nameFieldRef.current?.measureInWindow((_x, y, _w, h) => {
      scrollInputIntoView(scrollRef, y, h);
    });
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
              ref={scrollRef}
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
                Выбери день и назначь тренировку из библиотеки или отдых.
              </AppText>

              {program.days.map((day) => {
                const expanded = expandedWeekday === day.weekday;
                const isRest = day.type === 'rest';

                return (
                  <View
                    key={day.weekday}
                    className="mb-2 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
                  >
                    <Pressable
                      onPress={() => toggleDay(day.weekday)}
                      className="flex-row items-center px-4 py-3 active:bg-zinc-800/60"
                    >
                      <View className="flex-1">
                        <AppText variant="row" className="text-sm">
                          {WEEKDAY_NAMES[day.weekday]}
                        </AppText>
                        <AppText variant="caption" muted>
                          {isRest ? 'Отдых' : day.title}
                        </AppText>
                      </View>
                      <Ionicons
                        name={isRest ? 'moon-outline' : 'barbell-outline'}
                        size={18}
                        color={isRest ? '#71717A' : '#34D399'}
                      />
                      <Ionicons
                        name={expanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#71717A"
                        style={{ marginLeft: 8 }}
                      />
                    </Pressable>

                    {expanded ? (
                      <View className="px-4 pb-4 border-t border-zinc-800">
                        <Pressable
                          onPress={() => handleSelect(day, { type: 'rest' })}
                          className={`mt-3 px-3 py-2.5 rounded-xl border flex-row items-center gap-2 ${
                            isRest
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-zinc-950 border-zinc-800'
                          }`}
                        >
                          <Ionicons name="moon-outline" size={16} color="#A1A1AA" />
                          <AppText variant="body" className="text-sm">
                            Отдых
                          </AppText>
                        </Pressable>

                        <AppText variant="caption" muted className="mt-3 mb-2">
                          Тренировки из библиотеки
                        </AppText>

                        {templates.length === 0 ? (
                          <AppText variant="caption" muted>
                            Нет шаблонов — импортируй тренировку
                          </AppText>
                        ) : (
                          templates.map((template) => {
                            const selected =
                              day.type === 'workout' && day.templateId === template.id;
                            return (
                              <Pressable
                                key={template.id}
                                onPress={() =>
                                  handleSelect(day, {
                                    type: 'workout',
                                    templateId: template.id,
                                    title: template.title,
                                  })
                                }
                                className={`mb-2 px-3 py-2.5 rounded-xl border flex-row items-center justify-between ${
                                  selected
                                    ? 'bg-emerald-950/30 border-emerald-500/40'
                                    : 'bg-zinc-950 border-zinc-800'
                                }`}
                              >
                                <View className="flex-1 pr-2">
                                  <AppText variant="body" className="text-sm">
                                    {template.title}
                                  </AppText>
                                  <AppText variant="caption" muted>
                                    {template.exercises.length} упражнений
                                  </AppText>
                                </View>
                                {selected ? (
                                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                ) : null}
                              </Pressable>
                            );
                          })
                        )}
                      </View>
                    ) : null}
                  </View>
                );
              })}

              <View ref={nameFieldRef} className="mt-2 mb-2">
                <AppText variant="caption" muted className="mb-2">
                  Название плана
                </AppText>
                <TextInput
                  value={programName}
                  onChangeText={setProgramName}
                  onBlur={handleSaveName}
                  onFocus={focusNameField}
                  placeholder="Например, Full Body 3x"
                  placeholderTextColor="#71717A"
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    handleSaveName();
                    Keyboard.dismiss();
                  }}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-50 text-sm"
                />
              </View>

              <View className="gap-2 mt-2">
                <AppButton
                  label="Сохранить"
                  onPress={() => {
                    handleSaveName();
                    Keyboard.dismiss();
                    onClose();
                  }}
                />
                <AppButton label="Сбросить по умолчанию" variant="ghost" onPress={handleReset} />
              </View>
            </KeyboardFormScroll>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}