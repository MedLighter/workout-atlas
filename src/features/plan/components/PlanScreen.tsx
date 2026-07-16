import { useState } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../../shared/ui/SafeScreen';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { AppCard } from '../../../shared/ui/AppCard';
import { ConfirmationDialog } from '../../../shared/ui/ConfirmationDialog';
import { WorkoutTemplateCard, getTemplateStats } from '../../../shared/ui/WorkoutTemplateCard';
import { useWorkoutStore } from '../../workout/model/workout.store';
import { WEEKDAY_LABELS, getMondayFirstWeekday } from '../../workout/model/workout.schedule';
import { WeekPlanEditorModal } from '../../workout/components/WeekPlanEditorModal';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../shared/theme/tokens';
import type { WorkoutSession } from '../../workout/model/workout.types';
import { TemplatePreviewSheet } from './TemplatePreviewSheet';
import { StaggerItem } from '../../../shared/ui/animations/StaggerItem';
import { FadeSlideIn } from '../../../shared/ui/animations/FadeSlideIn';

export function PlanScreen() {
  const router = useRouter();
  const [templateToView, setTemplateToView] = useState<WorkoutSession | null>(null);
  const [templateToDelete, setTemplateToDelete] = useState<WorkoutSession | null>(null);
  const weeklyProgram = useWorkoutStore((s) => s.weeklyProgram);
  const templates = useWorkoutStore((s) => s.templates);
  const planEditorOpen = useWorkoutStore((s) => s.planEditorOpen);
  const openPlanEditor = useWorkoutStore((s) => s.openPlanEditor);
  const closePlanEditor = useWorkoutStore((s) => s.closePlanEditor);
  const updateScheduleDay = useWorkoutStore((s) => s.updateScheduleDay);
  const setWeeklyProgram = useWorkoutStore((s) => s.setWeeklyProgram);
  const resetWeeklyProgram = useWorkoutStore((s) => s.resetWeeklyProgram);
  const removeTemplate = useWorkoutStore((s) => s.removeTemplate);

  const today = getMondayFirstWeekday();
  const nextWorkout = weeklyProgram.days.find(
    (d, i) => d.type === 'workout' && d.weekday >= today,
  ) ?? weeklyProgram.days.find((d) => d.type === 'workout');

  const workoutCount = weeklyProgram.days.filter((d) => d.type === 'workout').length;

  return (
    <SafeScreen scrollable reserveTabBar>
      <StaggerItem index={0}>
        <View className="mb-5 pt-2">
          <AppText variant="h1">План</AppText>
          <AppText variant="caption" muted className="mt-1">
            {workoutCount} тренировки в неделю
          </AppText>
        </View>
      </StaggerItem>

      <StaggerItem index={1}>
        <View className="flex-row justify-between mb-5">
          {WEEKDAY_LABELS.map((label, index) => {
            const day = weeklyProgram.days.find((d) => d.weekday === index);
            const isWorkout = day?.type === 'workout';
            const short = isWorkout ? day.title.replace('Full Body ', '') : '—';
            const isToday = index === today;
            return (
              <FadeSlideIn key={label} delay={index * 28} direction="down">
                <View className="items-center">
                  <AppText variant="caption" muted>{label}</AppText>
                  <View
                    className="w-9 h-9 rounded-full items-center justify-center mt-1 border"
                    style={{
                      backgroundColor: isToday ? colors.accentSurfaceStrong : colors.surfacePrimary,
                      borderColor: isToday ? colors.accentBorder : colors.borderSubtle,
                      transform: [{ scale: isToday ? 1.06 : 1 }],
                    }}
                  >
                    <AppText variant="caption" className={isWorkout ? 'text-accent' : ''}>{short}</AppText>
                  </View>
                </View>
              </FadeSlideIn>
            );
          })}
        </View>
      </StaggerItem>

      <AppCard elevated flush className="mb-6" enterIndex={2}>
        <LinearGradient
          colors={['rgba(12,84,69,0.58)', 'rgba(10,28,28,0.4)', colors.surfacePrimary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 18, width: '100%' }}
        >
          <AppText variant="h2">{weeklyProgram.name}</AppText>
          <AppText variant="bodyM" muted className="mb-1">{workoutCount} тренировки в неделю</AppText>
          {nextWorkout ? (
            <AppText variant="bodyM" muted className="mb-4">Следующая: {nextWorkout.title}</AppText>
          ) : null}
          <AppButton label="Открыть программу" onPress={openPlanEditor} className="mb-2" />
          <AppButton label="Изменить расписание" variant="ghost" onPress={openPlanEditor} />
        </LinearGradient>
      </AppCard>

      <StaggerItem index={3}>
        <AppText variant="h3" className="mb-3">Добавить программу</AppText>
        <AppButton label="Импортировать программу" variant="secondary" onPress={() => router.push('/import')} className="mb-3" />
        <AppButton label="Создать новую" variant="secondary" onPress={() => router.push('/generator')} className="mb-3" />
        <AppButton label="Собрать вручную" variant="ghost" onPress={() => router.push('/manual-program')} />
      </StaggerItem>

      {templates.length > 0 ? (
        <StaggerItem index={4} className="mt-6 mb-2">
          <AppText variant="h3">Шаблоны</AppText>
          <AppText variant="caption" muted className="mt-1">
            Нажми на шаблон, чтобы посмотреть упражнения
          </AppText>
        </StaggerItem>
      ) : null}
      <View className="gap-2">
        {templates.map((template, templateIndex) => {
          const scheduleDays = weeklyProgram.days.filter(
            (day) => day.type === 'workout' && day.templateId === template.id,
          );
          const { meta } = getTemplateStats(template);

          return (
            <StaggerItem key={template.id} index={5 + templateIndex}>
              <WorkoutTemplateCard
                mode="browse"
                title={template.title}
                meta={meta}
                inSchedule={scheduleDays.length > 0}
                scheduleLabel={
                  scheduleDays.length > 0
                    ? `В расписании: ${scheduleDays.map((day) => WEEKDAY_LABELS[day.weekday]).join(', ')}`
                    : undefined
                }
                onPress={() => setTemplateToView(template)}
                onDelete={() => setTemplateToDelete(template)}
              />
            </StaggerItem>
          );
        })}
      </View>

      <TemplatePreviewSheet
        visible={templateToView != null}
        template={templateToView}
        weeklyProgram={weeklyProgram}
        onClose={() => setTemplateToView(null)}
      />

      <ConfirmationDialog
        visible={templateToDelete != null}
        title="Удалить шаблон?"
        description={
          templateToDelete && weeklyProgram.days.some(
            (day) => day.type === 'workout' && day.templateId === templateToDelete.id,
          )
            ? `«${templateToDelete.title}» будет удалён. Дни с этой тренировкой в расписании станут днями отдыха.`
            : templateToDelete
              ? `«${templateToDelete.title}» будет удалён без возможности восстановления.`
              : undefined
        }
        confirmLabel="Удалить"
        destructive
        onConfirm={() => {
          if (templateToDelete) removeTemplate(templateToDelete.id);
          setTemplateToDelete(null);
        }}
        onCancel={() => setTemplateToDelete(null)}
      />

      <WeekPlanEditorModal
        visible={planEditorOpen}
        program={weeklyProgram}
        templates={templates}
        onClose={closePlanEditor}
        onUpdateDay={updateScheduleDay}
        onApplyPreset={setWeeklyProgram}
        onReset={resetWeeklyProgram}
      />
    </SafeScreen>
  );
}
