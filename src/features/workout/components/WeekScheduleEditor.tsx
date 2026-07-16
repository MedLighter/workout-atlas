import { useState } from 'react';
import { View } from 'react-native';
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
import { RadioCard } from '../../../shared/ui/RadioCard';
import { PressableScale } from '../../../shared/ui/PressableScale';
import { WorkoutTemplateCard, getTemplateStats } from '../../../shared/ui/WorkoutTemplateCard';
import { colors, radii } from '../../../shared/theme/tokens';
import { MOTION } from '../../../shared/ui/animations/motion';

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

  const activeDay = activeWeekday !== null ? program.days.find((item) => item.weekday === activeWeekday) : null;
  const isRestSelected = activeDay?.type === 'rest';

  return (
    <View>
      <View className="mb-3 px-1">
        <AppText variant="caption" className="text-accent mb-1">
          {formatWorkoutDaysSummary(program)}
        </AppText>
        <AppText variant="caption" muted>
          Нажми на день, чтобы назначить тренировку или отдых
        </AppText>
      </View>

      {showPresets && onApplyPreset ? (
        <View className="flex-row flex-wrap gap-2 mb-4">
          {SCHEDULE_PRESETS.map((preset) => (
            <PressableScale
              key={preset.id}
              onPress={() => handlePreset(preset.id)}
              scaleTo={MOTION.cardPressScale}
              style={{
                flexGrow: 1,
                flexBasis: '30%',
                minWidth: 96,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
                backgroundColor: colors.surfacePrimary,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <AppText variant="bodyM">{preset.label}</AppText>
              <AppText variant="caption" muted className="mt-0.5">
                {preset.subtitle}
              </AppText>
            </PressableScale>
          ))}
        </View>
      ) : null}

      <View className="flex-row gap-1.5 mb-3">
        {program.days.map((day) => {
          const isWorkout = day.type === 'workout';
          const isActive = activeWeekday === day.weekday;

          return (
            <PressableScale
              key={day.weekday}
              onPress={() => handleDayPress(day)}
              scaleTo={0.98}
              style={{
                flex: 1,
                borderRadius: radii.sm,
                borderWidth: 1,
                paddingHorizontal: 4,
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor: isActive
                  ? colors.accentSurfaceStrong
                  : isWorkout
                    ? colors.surfacePrimary
                    : colors.surfaceSoft,
                borderColor: isActive
                  ? colors.accentBorder
                  : isWorkout
                    ? colors.accentBorder
                    : colors.borderSubtle,
              }}
            >
              <AppText variant="caption" muted={!isWorkout && !isActive} className={isWorkout ? 'text-accent' : ''}>
                {WEEKDAY_LABELS[day.weekday]}
              </AppText>
              <View className="my-1.5">
                <Ionicons
                  name={isWorkout ? 'barbell-outline' : 'moon-outline'}
                  size={compact ? 16 : 18}
                  color={isWorkout ? colors.accentBright : colors.textMuted}
                />
              </View>
              <AppText
                variant="caption"
                numberOfLines={2}
                className="text-center"
                muted={!isWorkout}
                style={{ fontSize: 10, lineHeight: 12, color: isWorkout ? colors.accentBright : undefined }}
              >
                {isWorkout ? day.title.replace('Full Body ', '') : 'Отдых'}
              </AppText>
            </PressableScale>
          );
        })}
      </View>

      {activeWeekday !== null ? (
        <View
          className="rounded-2xl border p-4 mb-2"
          style={{ borderColor: colors.borderSubtle, backgroundColor: colors.surfaceSoft }}
        >
          <AppText variant="h3" className="mb-1">
            {WEEKDAY_NAMES[activeWeekday]}
          </AppText>
          <AppText variant="caption" muted className="mb-4">
            Выбери тренировку или поставь отдых
          </AppText>

          <View className="gap-2">
            <RadioCard
              icon="moon-outline"
              label="Отдых"
              description="Без тренировки в этот день"
              selected={isRestSelected}
              onPress={() => handleSetRest(activeWeekday)}
            />

            {templates.length === 0 ? (
              <AppText variant="caption" muted className="px-1 pt-1">
                Нет шаблонов — импортируй тренировку или создай программу
              </AppText>
            ) : (
              templates.map((template) => {
                const selected = activeDay?.type === 'workout' && activeDay.templateId === template.id;
                const { meta } = getTemplateStats(template);

                return (
                  <WorkoutTemplateCard
                    key={template.id}
                    mode="select"
                    title={template.title}
                    meta={meta}
                    selected={selected}
                    onPress={() => {
                      if (!activeDay) return;
                      handleSelectTemplate(activeDay, template);
                    }}
                  />
                );
              })
            )}
          </View>
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