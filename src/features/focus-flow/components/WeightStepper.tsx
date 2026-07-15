import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';
import { colors } from '../../../shared/theme/tokens';

interface WeightStepperProps {
  value: number | undefined;
  unit: string;
  step: number;
  onChange: (value: number) => void;
  onStep: (delta: number) => void;
}

export function WeightStepper({ value, unit, step, onChange, onStep }: WeightStepperProps) {
  const display = value ?? 0;

  return (
    <View
      className="flex-row items-center justify-between rounded-lg border border-border-subtle px-2"
      style={{ minHeight: 70, backgroundColor: colors.surfacePrimary }}
    >
      <Pressable
        accessibilityLabel="Уменьшить вес"
        onPress={() => onStep(-step)}
        className="items-center justify-center rounded-md active:opacity-70 border border-border-strong"
        style={{ width: 48, height: 48, backgroundColor: colors.surfaceElevated }}
      >
        <Ionicons name="remove" size={24} color={colors.textPrimary} />
      </Pressable>

      <View className="items-baseline justify-center flex-row flex-1 mx-2">
        <TextInput
          value={String(display)}
          onChangeText={(text) => {
            const normalized = text.replace(',', '.');
            const parsed = parseFloat(normalized);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
          keyboardType="decimal-pad"
          className="text-center font-bold text-content-primary"
          style={{
            fontSize: 43,
            lineHeight: 48,
            fontVariant: ['tabular-nums'],
            color: colors.textPrimary,
            minWidth: 90,
            paddingVertical: 0,
          }}
        />
        <AppText variant="bodyM" muted className="ml-1">{unit}</AppText>
      </View>

      <Pressable
        accessibilityLabel="Увеличить вес"
        onPress={() => onStep(step)}
        className="items-center justify-center rounded-md active:opacity-70 border border-border-strong"
        style={{ width: 48, height: 48, backgroundColor: colors.surfaceElevated }}
      >
        <Ionicons name="add" size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}
