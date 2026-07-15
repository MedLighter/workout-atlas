import { useRef, useState, type ChangeEvent } from 'react';
import { Platform, TextInput, View } from 'react-native';
import { AppText } from '../../../shared/ui/AppText';
import { AppButton } from '../../../shared/ui/AppButton';
import { exportBackupToFile, readBackupFromJsonText } from '../../../shared/storage/backup';

type StatusTone = 'success' | 'error' | 'neutral';

interface StatusMessage {
  tone: StatusTone;
  text: string;
}

export function DataBackupSection() {
  const [status, setStatus] = useState<StatusMessage | null>(null);
  const [importText, setImportText] = useState('');
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setResult = (tone: StatusTone, text: string) => setStatus({ tone, text });

  const handleExport = async () => {
    setBusy('export');
    setStatus(null);
    try {
      const message = await exportBackupToFile();
      setResult('success', message);
    } catch (error) {
      setResult('error', error instanceof Error ? error.message : 'Не удалось экспортировать бэкап.');
    } finally {
      setBusy(null);
    }
  };

  const handleImportText = async () => {
    if (!importText.trim()) {
      setResult('error', 'Вставь JSON бэкапа или выбери файл.');
      return;
    }

    setBusy('import');
    setStatus(null);
    try {
      const result = await readBackupFromJsonText(importText.trim());
      if (!result.ok) {
        const message = result.issues.map((issue) => issue.message).join(' ');
        setResult('error', message || 'Бэкап не прошёл проверку.');
        return;
      }

      setImportText('');
      setResult('success', 'Бэкап импортирован. Данные восстановлены.');
    } catch (error) {
      setResult('error', error instanceof Error ? error.message : 'Не удалось импортировать бэкап.');
    } finally {
      setBusy(null);
    }
  };

  const handlePickFile = () => {
    if (Platform.OS !== 'web') return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setBusy('import');
    setStatus(null);
    try {
      const text = await file.text();
      const result = await readBackupFromJsonText(text);
      if (!result.ok) {
        const message = result.issues.map((issue) => issue.message).join(' ');
        setResult('error', message || 'Бэкап не прошёл проверку.');
        return;
      }

      setImportText('');
      setResult('success', 'Бэкап импортирован из файла.');
    } catch (error) {
      setResult('error', error instanceof Error ? error.message : 'Не удалось прочитать файл.');
    } finally {
      setBusy(null);
    }
  };

  const statusClass =
    status?.tone === 'success'
      ? 'border-emerald-500/30 bg-emerald-950/30'
      : status?.tone === 'error'
        ? 'border-red-500/30 bg-red-950/20'
        : 'border-zinc-700 bg-zinc-900/50';

  return (
    <View className="mb-6">
      <AppText variant="section" className="mb-1">
        Бэкап данных
      </AppText>
      <AppText variant="caption" muted className="mb-3">
        {Platform.OS === 'web'
          ? 'На PWA данные хранятся в IndexedDB. Экспортируй JSON, чтобы перенести их на другое устройство.'
          : 'Экспортируй JSON, чтобы сохранить тренировки и настройки.'}
      </AppText>

      <View className="gap-2 mb-3">
        <AppButton
          label={busy === 'export' ? 'Экспорт...' : 'Экспортировать бэкап'}
          variant="secondary"
          disabled={busy !== null}
          onPress={handleExport}
        />
        {Platform.OS === 'web' ? (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <AppButton
              label={busy === 'import' ? 'Импорт...' : 'Импортировать из файла'}
              variant="secondary"
              disabled={busy !== null}
              onPress={handlePickFile}
            />
          </>
        ) : null}
      </View>

      <AppText variant="caption" muted className="mb-2">
        Или вставь JSON бэкапа вручную
      </AppText>
      <TextInput
        value={importText}
        onChangeText={setImportText}
        placeholder='{"protocolVersion":"1.0",...}'
        placeholderTextColor="#71717A"
        multiline
        textAlignVertical="top"
        className="min-h-[120px] rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 text-sm mb-3"
      />
      <AppButton
        label={busy === 'import' ? 'Импорт...' : 'Импортировать из текста'}
        disabled={busy !== null}
        onPress={handleImportText}
      />

      {status ? (
        <View className={`mt-3 rounded-2xl border px-4 py-3 ${statusClass}`}>
          <AppText variant="caption" className={status.tone === 'error' ? 'text-red-400' : 'text-emerald-300'}>
            {status.text}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
