import { TextInput, View } from 'react-native';
import { AppText } from './AppText';

interface NumberInputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  compact?: boolean;
}

export function NumberInput({
  value,
  onChangeText,
  label,
  placeholder,
  compact,
}: NumberInputProps) {
  return (
    <View className={compact ? 'flex-1' : 'w-full'}>
      {label ? <AppText variant="caption" muted className="mb-1">{label}</AppText> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#71717A"
        keyboardType="numeric"
        className={`bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-50 text-center ${compact ? 'px-2 py-2 text-sm' : 'px-3 py-3 text-base'}`}
      />
    </View>
  );
}