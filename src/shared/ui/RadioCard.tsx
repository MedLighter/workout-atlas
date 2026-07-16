import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from './AppText';
import { colors, radii } from '../theme/tokens';
import { PressableScale } from './PressableScale';
import { MOTION } from './animations/motion';

type SelectionMode = 'radio' | 'checkbox';

interface RadioCardProps {
  label: string;
  description?: string;
  meta?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  mode?: SelectionMode;
}

function SelectionIndicator({ selected, mode }: { selected: boolean; mode: SelectionMode }) {
  if (mode === 'checkbox') {
    return (
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 7,
          borderWidth: 2,
          borderColor: selected ? colors.accentPrimary : colors.borderStrong,
          backgroundColor: selected ? colors.accentPrimary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected ? <Ionicons name="checkmark" size={14} color={colors.bgPrimary} /> : null}
      </View>
    );
  }

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

export function RadioCard({
  label,
  description,
  meta,
  icon,
  selected,
  onPress,
  mode = 'radio',
}: RadioCardProps) {
  return (
    <PressableScale
      accessibilityRole={mode === 'checkbox' ? 'checkbox' : 'radio'}
      accessibilityState={{ selected, checked: mode === 'checkbox' ? selected : undefined }}
      onPress={onPress}
      scaleTo={MOTION.cardPressScale}
      style={{
        borderRadius: radii.md,
        borderWidth: 1,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: selected ? colors.accentSurfaceStrong : colors.surfacePrimary,
        borderColor: selected ? colors.accentBorder : colors.borderSubtle,
        minHeight: 64,
      }}
    >
      <View className="flex-row items-center gap-3">
        {icon ? (
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: radii.sm,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: selected ? colors.accentSurface : colors.surfaceElevated,
            }}
          >
            <Ionicons
              name={icon}
              size={20}
              color={selected ? colors.accentBright : colors.textMuted}
            />
          </View>
        ) : null}

        <View className="flex-1 pr-2">
          <AppText variant="bodyL">{label}</AppText>
          {description ? (
            <AppText variant="caption" muted className="mt-1">
              {description}
            </AppText>
          ) : null}
          {meta ? (
            <AppText variant="caption" muted className="mt-1">
              {meta}
            </AppText>
          ) : null}
        </View>

        <SelectionIndicator selected={selected} mode={mode} />
      </View>
    </PressableScale>
  );
}