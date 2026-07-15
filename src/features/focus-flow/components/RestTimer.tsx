import { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { colors } from '../../../shared/theme/tokens';
import { formatRestTime } from '../../workout/utils/focus-flow.logic';

interface RestTimerProps {
  endsAt: number;
  totalSec: number;
  nextLabel: string;
  onSkip: () => void;
  onExtend: () => void;
  onComplete: () => void;
}

export function RestTimer({ endsAt, totalSec, nextLabel, onSkip, onExtend, onComplete }: RestTimerProps) {
  const [remaining, setRemaining] = useState(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, Math.ceil((endsAt - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) onComplete();
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [endsAt, onComplete]);

  const progress = totalSec > 0 ? remaining / totalSec : 0;
  const size = 230;
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View className="flex-1 px-1 justify-between pb-2">
      <View className="flex-row justify-end pt-1">
        <Pressable
          onPress={onSkip}
          accessibilityLabel="Закрыть таймер отдыха"
          className="w-10 h-10 rounded-full items-center justify-center border border-border-subtle"
          style={{ backgroundColor: colors.surfacePrimary }}
        >
          <Ionicons name="close" size={21} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View className="items-center">
        <View className="items-center justify-center mb-6" style={{ width: size, height: size }}>
          <View
            style={{
              position: 'absolute',
              width: size + 36,
              height: size + 36,
              borderRadius: 999,
              backgroundColor: 'rgba(12,184,137,0.055)',
              shadowColor: colors.accentPrimary,
              shadowOpacity: 0.42,
              shadowRadius: 38,
            }}
          />
          <Svg width={size} height={size} style={{ position: 'absolute' }}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.borderSubtle}
              strokeWidth={stroke}
              fill="none"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.accentPrimary}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View className="items-center">
            <AppText variant="h2" className="mb-3">Отдых</AppText>
            <AppText variant="number" tabular style={{ fontSize: 58, lineHeight: 64 }}>
              {formatRestTime(remaining)}
            </AppText>
          </View>
        </View>

        <View
          className="w-full rounded-lg border border-border-subtle p-4 flex-row items-center"
          style={{ backgroundColor: colors.surfacePrimary }}
        >
          <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: colors.accentSurface }}>
            <Ionicons name="fitness-outline" size={20} color={colors.accentBright} />
          </View>
          <View className="flex-1">
            <AppText variant="caption" muted>Следующий подход</AppText>
            <AppText variant="bodyL" tabular>{nextLabel}</AppText>
          </View>
        </View>
      </View>

      <View>
        {remaining <= 0 ? (
          <AppButton label="Начать подход" onPress={onComplete} className="w-full mb-3" />
        ) : (
          <>
            <AppButton label="Пропустить отдых  »" variant="ghost" onPress={onSkip} className="w-full mb-3 border-accent-border" />
            <AppButton label="＋  Добавить 30 секунд" variant="secondary" onPress={onExtend} className="w-full" />
          </>
        )}
      </View>
    </View>
  );
}
