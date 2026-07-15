import { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import type { ImportFormat } from '../model/import.parser';
import type { FocusedInputLayout } from '../../../shared/hooks/useScrollToFocusedInput';

interface ImportTextAreaProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  format: ImportFormat;
  onInputFocus?: (layout: FocusedInputLayout) => void;
}

const formatLabels: Record<ImportFormat, string> = {
  json: 'JSON',
  markdown: 'Markdown',
  unknown: 'Не определён',
};

export function ImportTextArea({
  value,
  onChangeText,
  onClear,
  format,
  onInputFocus,
}: ImportTextAreaProps) {
  const containerRef = useRef<View>(null);

  const measureFocus = () => {
    containerRef.current?.measureInWindow((_x, y, _width, height) => {
      onInputFocus?.({ windowY: y, height });
    });
  };

  return (
    <View ref={containerRef} className="mb-4">
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
        onFocus={measureFocus}
        placeholder="Вставь JSON от AI или Markdown-тренировку..."
        placeholderTextColor="#71717A"
        textAlignVertical="top"
        className="h-[160px] bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-zinc-50 text-sm leading-5"
      />
    </View>
  );
}