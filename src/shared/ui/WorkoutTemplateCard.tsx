import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { IconButton } from './IconButton';
import { PressableScale } from './PressableScale';
import { colors, radii } from '../theme/tokens';
import { MOTION } from './animations/motion';
import type { WorkoutSession } from '../../features/workout/model/workout.types';

export function getTemplateStats(template: WorkoutSession) {
  const setCount = template.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  return {
    exerciseCount: template.exercises.length,
    setCount,
    meta: `${template.exercises.length} упражнений · ${setCount} подходов`,
  };
}

type WorkoutTemplateCardMode = 'browse' | 'select';

interface WorkoutTemplateCardProps {
  title: string;
  meta: string;
  mode: WorkoutTemplateCardMode;
  selected?: boolean;
  inSchedule?: boolean;
  scheduleLabel?: string;
  onPress: () => void;
  onDelete?: () => void;
}

function SelectionDot({ selected }: { selected: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: selected ? colors.accentPrimary : colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {selected ? (
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: colors.accentPrimary,
          }}
        />
      ) : null}
    </View>
  );
}

function TemplateIcon({ highlighted }: { highlighted: boolean }) {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: radii.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: highlighted ? colors.accentSurface : colors.surfaceElevated,
      }}
    >
      <Ionicons
        name="barbell-outline"
        size={21}
        color={highlighted ? colors.accentBright : colors.accentPrimary}
      />
    </View>
  );
}

export function WorkoutTemplateCard({
  title,
  meta,
  mode,
  selected = false,
  inSchedule = false,
  scheduleLabel,
  onPress,
  onDelete,
}: WorkoutTemplateCardProps) {
  const isSelected = mode === 'select' && selected;

  const cardStyle = {
    borderRadius: radii.md,
    borderWidth: 1,
    backgroundColor: isSelected ? colors.accentSurfaceStrong : colors.surfacePrimary,
    borderColor: isSelected ? colors.accentBorder : colors.borderSubtle,
  } as const;

  const content = (
    <View className="flex-row items-center gap-3 flex-1 min-w-0">
      <TemplateIcon highlighted={isSelected} />
      <View className="flex-1 min-w-0">
        <AppText variant="bodyL" numberOfLines={1}>
          {title}
        </AppText>
        <AppText variant="caption" muted className="mt-0.5">
          {meta}
        </AppText>
        {inSchedule && scheduleLabel ? (
          <View
            className="self-start mt-2 rounded-full px-2.5 py-1"
            style={{ backgroundColor: colors.accentSurface }}
          >
            <AppText variant="caption" className="text-accent">
              {scheduleLabel}
            </AppText>
          </View>
        ) : null}
      </View>
      {mode === 'select' ? <SelectionDot selected={selected} /> : null}
      {mode === 'browse' ? <Ionicons name="chevron-forward" size={18} color={colors.textMuted} /> : null}
    </View>
  );

  if (mode === 'browse') {
    return (
      <View className="flex-row items-stretch" style={cardStyle}>
        <PressableScale
          accessibilityRole="button"
          onPress={onPress}
          scaleTo={MOTION.cardPressScale}
          className="flex-1"
          style={{ paddingHorizontal: 14, paddingVertical: 13 }}
        >
          {content}
        </PressableScale>
        {onDelete ? (
          <View
            style={{
              width: 48,
              paddingRight: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton
              size={40}
              variant="ghost"
              accessibilityLabel={`Удалить шаблон ${title}`}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
            </IconButton>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      scaleTo={MOTION.cardPressScale}
      style={{ ...cardStyle, paddingHorizontal: 14, paddingVertical: 13 }}
    >
      {content}
    </PressableScale>
  );
}