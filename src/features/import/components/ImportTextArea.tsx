import { TextInput, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import type { ImportFormat } from '../model/import.parser';

interface ImportTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  format: ImportFormat;
}

const formatLabels: Record<ImportFormat, string> = {
  json: 'JSON',
  markdown: 'Markdown',
  unknown: 'Не определён',
};

export function ImportTextArea({ value, onChangeText, onClear, format }: ImportTextAreaProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <AppText variant="caption" muted>
          Вставьте JSON или Markdown
        </AppText>
        <View className="flex-row items-center gap-2">
          <AppText variant="caption" className="text-emerald-400">
            {formatLabels[format]}
          </AppText>
          {value.length > 0 && onClear ? (
            <AppButton compact variant="ghost" label="Очистить" onPress={onClear} />
          ) : null}
        </View>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline
        scrollEnabled
        placeholder="Вставь JSON от AI или Markdown-тренировку..."
        placeholderTextColor="#71717A"
        textAlignVertical="top"
        className="h-[140px] bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-50 text-sm leading-5"
      />
    </View>
  );
}