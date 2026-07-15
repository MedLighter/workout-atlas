import { forwardRef, useRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';

interface NumberInputProps extends Omit<TextInputProps, 'keyboardType' | 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
  onMeasureFocus?: () => void;
}

export const NumberInput = forwardRef<TextInput, NumberInputProps>(function NumberInput(
  {
    value,
    onChangeText,
    label,
    placeholder,
    compact,
    onMeasureFocus,
    onFocus,
    ...props
  },
  ref,
) {
  const fallbackRef = useRef<TextInput>(null);
  const inputRef = ref ?? fallbackRef;

  return (
    <View className={compact ? 'flex-1' : 'w-full'}>
      {label ? (
        <AppText variant="caption" muted className="mb-1">
          {label}
        </AppText>
      ) : null}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#71717A"
        keyboardType="numeric"
        returnKeyType="done"
        onFocus={(event) => {
          onFocus?.(event);
          onMeasureFocus?.();
        }}
        className={`bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 text-center ${compact ? 'px-2 py-2 text-sm' : 'px-3 py-3 text-base'}`}
        {...props}
      />
    </View>
  );
});