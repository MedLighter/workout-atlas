import { TextInput, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import type { ImportFormat } from '../model/import.parser';

interface ImportTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  format: ImportFormat;
}

const formatLabels: Record<ImportFormat, string> = {
  json: 'JSON',
  markdown: 'Markdown',
  unknown: 'Не определён',
};

export function ImportTextArea({ value, onChangeText, format }: ImportTextAreaProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <AppText variant="caption" muted>
          Вставьте JSON или Markdown
        </AppText>
        <AppText variant="caption" className="text-emerald-400">
          {formatLabels[format]}
        </AppText>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        multiline
        placeholder="Вставь JSON от AI или Markdown-тренировку..."
        placeholderTextColor="#71717A"
        textAlignVertical="top"
        className="min-h-[200px] bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-50 text-sm leading-5"
      />
    </View>
  );
}