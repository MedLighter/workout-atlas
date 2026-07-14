import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { useSettingsStore } from '../model/settings.store';
import type { ProgressionMode } from '../../workout/model/progression.types';

const MODE_OPTIONS: {
  id: ProgressionMode;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    id: 'linear',
    title: 'Линейная',
    description: 'Закрыл все рабочие подходы — добавляем шаг к весу',
    icon: 'add-circle-outline',
  },
  {
    id: 'rpe',
    title: 'По RPE',
    description: 'Корректируем вес по субъективной нагрузке прошлого раза',
    icon: 'pulse-outline',
  },
];

export function ProgressionSection() {
  const unit = useSettingsStore((s) => s.unit);
  const enabled = useSettingsStore((s) => s.enabled);
  const mode = useSettingsStore((s) => s.mode);
  const weightIncrementKg = useSettingsStore((s) => s.weightIncrementKg);
  const weightIncrementLb = useSettingsStore((s) => s.weightIncrementLb);
  const targetRpe = useSettingsStore((s) => s.targetRpe);
  const setProgressionEnabled = useSettingsStore((s) => s.setProgressionEnabled);
  const setProgressionMode = useSettingsStore((s) => s.setProgressionMode);
  const setWeightIncrementKg = useSettingsStore((s) => s.setWeightIncrementKg);
  const setWeightIncrementLb = useSettingsStore((s) => s.setWeightIncrementLb);
  const setTargetRpe = useSettingsStore((s) => s.setTargetRpe);

  const increment = unit === 'kg' ? weightIncrementKg : weightIncrementLb;
  const incrementOptions = unit === 'kg' ? [1.25, 2.5, 5] : [2.5, 5, 10];

  const setIncrement = (value: number) => {
    if (unit === 'kg') setWeightIncrementKg(value);
    else setWeightIncrementLb(value);
  };

  return (
    <View className="mb-6">
      <View className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <View className="px-4 py-4 border-b border-zinc-800/80 flex-row items-start gap-3">
          <View className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center">
            <Ionicons name="analytics-outline" size={18} color="#34D399" />
          </View>
          <View className="flex-1">
            <AppText variant="section" className="mb-1">
              Прогрессия
            </AppText>
            <AppText variant="caption" muted>
              Следующая тренировка подстраивается под прошлый результат
            </AppText>
          </View>
          <Pressable
            onPress={() => setProgressionEnabled(!enabled)}
            className={`w-12 h-7 rounded-full border justify-center px-0.5 ${
              enabled ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-zinc-800 border-zinc-700'
            }`}
          >
            <View
              className={`w-5 h-5 rounded-full ${enabled ? 'bg-emerald-400 self-end' : 'bg-zinc-500 self-start'}`}
            />
          </Pressable>
        </View>

        {enabled ? (
          <View className="p-4 gap-4">
            <View>
              <AppText variant="caption" muted className="mb-2">
                Режим
              </AppText>
              <View className="gap-2">
                {MODE_OPTIONS.map((option) => {
                  const selected = mode === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => setProgressionMode(option.id)}
                      className={`rounded-2xl border px-3.5 py-3 flex-row items-center gap-3 active:opacity-90 ${
                        selected
                          ? 'bg-emerald-950/30 border-emerald-500/35'
                          : 'bg-zinc-950 border-zinc-800'
                      }`}
                    >
                      <View
                        className={`w-9 h-9 rounded-full items-center justify-center ${
                          selected ? 'bg-emerald-500/15' : 'bg-zinc-800'
                        }`}
                      >
                        <Ionicons
                          name={option.icon}
                          size={18}
                          color={selected ? '#34D399' : '#A1A1AA'}
                        />
                      </View>
                      <View className="flex-1">
                        <AppText variant="row" className="text-sm">
                          {option.title}
                        </AppText>
                        <AppText variant="caption" muted>
                          {option.description}
                        </AppText>
                      </View>
                      {selected ? <Ionicons name="checkmark-circle" size={20} color="#10B981" /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View>
              <AppText variant="caption" muted className="mb-2">
                Шаг веса ({unit})
              </AppText>
              <View className="flex-row flex-wrap gap-2">
                {incrementOptions.map((value) => (
                  <AppButton
                    key={value}
                    compact
                    label={`+${value}`}
                    variant={increment === value ? 'primary' : 'secondary'}
                    onPress={() => setIncrement(value)}
                    className="flex-1 min-w-[72px]"
                  />
                ))}
              </View>
            </View>

            {mode === 'rpe' ? (
              <View>
                <AppText variant="caption" muted className="mb-2">
                  Целевой RPE
                </AppText>
                <View className="flex-row gap-2">
                  {[7, 8, 9].map((value) => (
                    <AppButton
                      key={value}
                      compact
                      label={String(value)}
                      variant={targetRpe === value ? 'primary' : 'secondary'}
                      onPress={() => setTargetRpe(value)}
                      className="flex-1"
                    />
                  ))}
                </View>
                <AppText variant="caption" muted className="mt-2">
                  Ниже цели — добавим вес. Выше — снизим или удержим.
                </AppText>
              </View>
            ) : null}
          </View>
        ) : (
          <View className="px-4 py-3">
            <AppText variant="caption" muted>
              Включи прогрессию, чтобы видеть целевой вес на каждом упражнении.
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}