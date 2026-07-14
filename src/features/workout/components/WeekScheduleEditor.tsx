import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ScheduleDay, WeeklyProgram, WorkoutSession } from '../model/workout.types';
import {
  SCHEDULE_PRESETS,
  WEEKDAY_LABELS,
  WEEKDAY_NAMES,
  countWorkoutDays,
  createSchedulePreset,
  formatWorkoutDaysSummary,
  type ScheduleDayUpdate,
  type SchedulePresetId,
} from '../model/workout.schedule';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';

interface WeekScheduleEditorProps {
  program: WeeklyProgram;
  templates: WorkoutSession[];
  onUpdateDay: (weekday: number, update: ScheduleDayUpdate) => void;
  onApplyPreset?: (program: WeeklyProgram) => void;
  showPresets?: boolean;
  compact?: boolean;
}

export function WeekScheduleEditor({
  program,
  templates,
  onUpdateDay,
  onApplyPreset,
  showPresets = true,
  compact = false,
}: WeekScheduleEditorProps) {
  const [activeWeekday, setActiveWeekday] = useState<number | null>(null);
  const defaultTemplate = templates[0];

  const handlePreset = (presetId: SchedulePresetId) => {
    if (!onApplyPreset) return;
    onApplyPreset(createSchedulePreset(presetId));
    setActiveWeekday(null);
  };

  const handleDayPress = (day: ScheduleDay) => {
    if (day.type === 'workout') {
      setActiveWeekday((current) => (current === day.weekday ? null : day.weekday));
      return;
    }

    if (!defaultTemplate) {
      setActiveWeekday(day.weekday);
      return;
    }

    onUpdateDay(day.weekday, {
      type: 'workout',
      templateId: defaultTemplate.id,
      title: defaultTemplate.title,
    });
    setActiveWeekday(day.weekday);
  };

  const handleSelectTemplate = (day: ScheduleDay, template: WorkoutSession) => {
    onUpdateDay(day.weekday, {
      type: 'workout',
      templateId: template.id,
      title: template.title,
    });
    setActiveWeekday(null);
  };

  const handleSetRest = (weekday: number) => {
    onUpdateDay(weekday, { type: 'rest' });
    setActiveWeekday(null);
  };

  return (
    <View>
      <View className="mb-3 px-1">
        <AppText variant="caption" className="text-emerald-400 mb-1">
          {formatWorkoutDaysSummary(program)}
        </AppText>
        <AppText variant="caption" muted>
          Нажми на день, чтобы назначить тренировку или отдых
        </AppText>
      </View>

      {showPresets && onApplyPreset ? (
        <View className="flex-row flex-wrap gap-2 mb-4">
          {SCHEDULE_PRESETS.map((preset) => (
            <Pressable
              key={preset.id}
              onPress={() => handlePreset(preset.id)}
              className="flex-1 min-w-[96px] rounded-2xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 active:bg-zinc-800"
            >
              <AppText variant="row" className="text-sm mb-0.5">
                {preset.label}
              </AppText>
              <AppText variant="caption" muted>
                {preset.subtitle}
              </AppText>
            </Pressable>
          ))}
        </View>
      ) : null}

      <View className="flex-row gap-2 mb-3">
        {program.days.map((day) => {
          const isWorkout = day.type === 'workout';
          const isActive = activeWeekday === day.weekday;

          return (
            <Pressable
              key={day.weekday}
              onPress={() => handleDayPress(day)}
              className={`flex-1 rounded-2xl border px-1.5 py-2.5 items-center active:opacity-90 ${
                isActive
                  ? 'bg-emerald-950/50 border-emerald-500/40'
                  : isWorkout
                    ? 'bg-zinc-900 border-emerald-500/20'
                    : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <AppText
                variant="caption"
                className={isWorkout ? 'text-emerald-400' : ''}
                muted={!isWorkout}
              >
                {WEEKDAY_LABELS[day.weekday]}
              </AppText>
              <View className="my-1.5">
                <Ionicons
                  name={isWorkout ? 'barbell-outline' : 'moon-outline'}
                  size={compact ? 16 : 18}
                  color={isWorkout ? '#34D399' : '#71717A'}
                />
              </View>
              <AppText
                variant="caption"
                numberOfLines={2}
                className={`text-center text-[10px] leading-3 ${isWorkout ? 'text-emerald-300' : ''}`}
                muted={!isWorkout}
              >
                {isWorkout ? day.title : 'Отдых'}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {activeWeekday !== null ? (
        <View className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 mb-2">
          <AppText variant="section" className="mb-1">
            {WEEKDAY_NAMES[activeWeekday]}
          </AppText>
          <AppText variant="caption" muted className="mb-3">
            Выбери тренировку или поставь отдых
          </AppText>

          <AppButton
            compact
            variant="secondary"
            label="Отдых"
            onPress={() => handleSetRest(activeWeekday)}
            className="mb-3"
          />

          {templates.length === 0 ? (
            <AppText variant="caption" muted>
              Нет шаблонов — импортируй тренировку в библиотеку
            </AppText>
          ) : (
            <View className="gap-2">
              {templates.map((template) => {
                const day = program.days.find((item) => item.weekday === activeWeekday);
                const selected = day?.type === 'workout' && day.templateId === template.id;

                return (
                  <Pressable
                    key={template.id}
                    onPress={() => {
                      if (!day) return;
                      handleSelectTemplate(day, template);
                    }}
                    className={`rounded-xl border px-3 py-2.5 flex-row items-center justify-between ${
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
              })}
            </View>
          )}
        </View>
      ) : null}

      {countWorkoutDays(program) === 0 ? (
        <AppText variant="caption" muted className="px-1">
          Можно начать без плана и настроить позже в настройках.
        </AppText>
      ) : null}
    </View>
  );
}