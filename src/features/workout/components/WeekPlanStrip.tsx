import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeeklyProgram } from '../model/workout.types';
import { WEEKDAY_LABELS, getMondayFirstWeekday } from '../model/workout.schedule';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';

interface WeekPlanStripProps {
  program: WeeklyProgram;
  selectedWeekday: number;
  onSelectDay: (weekday: number) => void;
  onEdit?: () => void;
}

export function WeekPlanStrip({ program, selectedWeekday, onSelectDay, onEdit }: WeekPlanStripProps) {
  const todayWeekday = getMondayFirstWeekday();

  return (
    <View className="mb-3">
      <View className="flex-row items-center justify-between mb-2 px-5">
        <AppText variant="caption" muted>
          План недели · {program.name}
        </AppText>
        <AppText variant="caption" className="text-emerald-400">
          {WEEKDAY_LABELS[todayWeekday]} — сегодня
        </AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {program.days.map((day) => {
          const selected = selectedWeekday === day.weekday;
          const isToday = todayWeekday === day.weekday;
          const isRest = day.type === 'rest';

          return (
            <Pressable
              key={day.weekday}
              onPress={() => onSelectDay(day.weekday)}
              className={`w-[72px] rounded-2xl border px-2 py-3 items-center active:opacity-90 ${
                selected
                  ? 'bg-emerald-950/50 border-emerald-500/40'
                  : isToday
                    ? 'bg-zinc-900 border-zinc-700'
                    : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <AppText
                variant="caption"
                className={selected ? 'text-emerald-400' : isToday ? 'text-zinc-200' : ''}
                muted={!selected && !isToday}
              >
                {WEEKDAY_LABELS[day.weekday]}
              </AppText>

              <View className="my-2">
                {isRest ? (
                  <Ionicons name="moon-outline" size={18} color={selected ? '#34D399' : '#71717A'} />
                ) : (
                  <Ionicons name="barbell-outline" size={18} color={selected ? '#34D399' : '#A1A1AA'} />
                )}
              </View>

              <AppText
                variant="caption"
                numberOfLines={2}
                className={`text-center text-[10px] leading-3 ${
                  selected ? 'text-emerald-300' : ''
                }`}
                muted={!selected}
              >
                {isRest ? 'Отдых' : day.title}
              </AppText>
            </Pressable>
          );
        })}
      </ScrollView>

      {onEdit ? (
        <View className="px-5 mt-3">
          <AppButton
            compact
            variant="secondary"
            label="Изменить план недели"
            onPress={onEdit}
          />
        </View>
      ) : null}
    </View>
  );
}