import { Pressable, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { WeeklyProgram } from '../model/workout.types';
import { WEEKDAY_LABELS, getMondayFirstWeekday } from '../model/workout.schedule';
import { AppText } from '../../../shared/ui/AppText';

interface WeekPlanStripProps {
  program: WeeklyProgram;
  selectedWeekday: number;
  onSelectDay: (weekday: number) => void;
}

export function WeekPlanStrip({ program, selectedWeekday, onSelectDay }: WeekPlanStripProps) {
  const todayWeekday = getMondayFirstWeekday();

  return (
    <View className="pb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 6 }}
      >
        {program.days.map((day) => {
          const selected = selectedWeekday === day.weekday;
          const isToday = todayWeekday === day.weekday;
          const isRest = day.type === 'rest';

          return (
            <Pressable
              key={day.weekday}
              onPress={() => onSelectDay(day.weekday)}
              className={`min-w-[52px] rounded-xl border px-2 py-2 items-center active:opacity-90 ${
                selected
                  ? 'bg-emerald-950/50 border-emerald-500/40'
                  : isToday
                    ? 'bg-zinc-900 border-zinc-700'
                    : 'bg-zinc-950 border-zinc-800'
              }`}
            >
              <AppText
                variant="caption"
                className={`text-[11px] ${selected ? 'text-emerald-400' : isToday ? 'text-zinc-200' : ''}`}
                muted={!selected && !isToday}
              >
                {WEEKDAY_LABELS[day.weekday].slice(0, 2)}
              </AppText>

              <View className="my-1">
                {isRest ? (
                  <Ionicons name="moon-outline" size={14} color={selected ? '#34D399' : '#71717A'} />
                ) : (
                  <Ionicons name="barbell-outline" size={14} color={selected ? '#34D399' : '#A1A1AA'} />
                )}
              </View>

              {isToday ? (
                <View className="w-1 h-1 rounded-full bg-emerald-500" />
              ) : (
                <View className="w-1 h-1" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}