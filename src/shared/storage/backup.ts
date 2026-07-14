import { Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import kvStore from './kv-store';
import { parseBackupInput } from './backup.schema';
import { BACKUP_PROTOCOL_VERSION, type AppBackup, type BackupValidationResult } from './backup.types';
import { STORAGE_KEYS } from './storage-keys';

async function readPersistEnvelope(key: string): Promise<unknown | null> {
  const raw = await kvStore.getItem(key);
  if (!raw) return null;
  return JSON.parse(raw) as unknown;
}

function buildBackupFilename(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10);
  return `workout-atlas-backup-${stamp}.json`;
}

export async function exportAppBackup(): Promise<AppBackup> {
  const [settings, workout] = await Promise.all([
    readPersistEnvelope(STORAGE_KEYS.settings),
    readPersistEnvelope(STORAGE_KEYS.workout),
  ]);

  if (!settings || !workout) {
    throw new Error('Нет сохранённых данных для экспорта.');
  }

  return {
    protocolVersion: BACKUP_PROTOCOL_VERSION,
    app: 'workout-atlas',
    exportedAt: new Date().toISOString(),
    stores: {
      settings: settings as AppBackup['stores']['settings'],
      workout: workout as AppBackup['stores']['workout'],
    },
  };
}

export async function importAppBackup(input: unknown): Promise<BackupValidationResult> {
  const validation = parseBackupInput(input);
  if (!validation.ok || !validation.backup) {
    return validation;
  }

  await Promise.all([
    kvStore.setItem(STORAGE_KEYS.settings, JSON.stringify(validation.backup.stores.settings)),
    kvStore.setItem(STORAGE_KEYS.workout, JSON.stringify(validation.backup.stores.workout)),
  ]);

  const [{ useSettingsStore }, { useWorkoutStore }] = await Promise.all([
    import('../../features/settings/model/settings.store'),
    import('../../features/workout/model/workout.store'),
  ]);

  await Promise.all([useSettingsStore.persist.rehydrate(), useWorkoutStore.persist.rehydrate()]);

  return validation;
}

export async function exportBackupToFile(): Promise<string> {
  const backup = await exportAppBackup();
  const json = JSON.stringify(backup, null, 2);

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = buildBackupFilename();
    link.click();
    URL.revokeObjectURL(url);
    return 'Файл бэкапа скачан.';
  }

  await Clipboard.setStringAsync(json);
  return 'JSON бэкапа скопирован в буфер обмена.';
}

export async function readBackupFromJsonText(text: string): Promise<BackupValidationResult> {
  try {
    const parsed = JSON.parse(text) as unknown;
    return importAppBackup(parsed);
  } catch {
    return {
      ok: false,
      issues: [{ type: 'error', message: 'Не удалось прочитать JSON.' }],
    };
  }
}