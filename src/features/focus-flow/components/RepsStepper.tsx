import { Pressable, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText } from '../../../shared/ui/AppText';
import { colors } from '../../../shared/theme/tokens';

interface RepsStepperProps {
  value: number | undefined;
  onChange: (value: number) => void;
  onStep: (delta: number) => void;
}

export function RepsStepper({ value, onChange, onStep }: RepsStepperProps) {
  const display = value ?? 0;

  return (
    <View
      className="flex-row items-center justify-between rounded-lg border border-border-subtle px-2"
      style={{ minHeight: 70, backgroundColor: colors.surfacePrimary }}
    >
      <Pressable
        accessibilityLabel="Уменьшить повторы"
        onPress={() => onStep(-1)}
        className="items-center justify-center rounded-md active:opacity-70 border border-border-strong"
        style={{ width: 48, height: 48, backgroundColor: colors.surfaceElevated }}
      >
        <Ionicons name="remove" size={24} color={colors.textPrimary} />
      </Pressable>

      <View className="items-baseline justify-center flex-row flex-1 mx-2">
        <TextInput
          value={String(display)}
          onChangeText={(text) => {
            const parsed = parseInt(text, 10);
            if (!Number.isNaN(parsed)) onChange(parsed);
          }}
          keyboardType="number-pad"
          className="text-center font-bold text-content-primary"
          style={{
            fontSize: 43,
            lineHeight: 48,
            fontVariant: ['tabular-nums'],
            color: colors.textPrimary,
            minWidth: 58,
            paddingVertical: 0,
          }}
        />
        <AppText variant="bodyM" muted className="ml-1">повт.</AppText>
      </View>

      <Pressable
        accessibilityLabel="Увеличить повторы"
        onPress={() => onStep(1)}
        className="items-center justify-center rounded-md active:opacity-70 border border-border-strong"
        style={{ width: 48, height: 48, backgroundColor: colors.surfaceElevated }}
      >
        <Ionicons name="add" size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}
