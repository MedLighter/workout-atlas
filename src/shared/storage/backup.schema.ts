import { z } from 'zod';
import { BACKUP_PROTOCOL_VERSION, type AppBackup, type BackupValidationResult } from './backup.types';

const persistEnvelopeSchema = z
  .object({
    state: z.unknown(),
    version: z.number().optional(),
  })
  .passthrough();

const backupSchema = z.object({
  protocolVersion: z.literal(BACKUP_PROTOCOL_VERSION),
  app: z.literal('workout-atlas'),
  exportedAt: z.string().datetime(),
  stores: z.object({
    settings: persistEnvelopeSchema,
    workout: persistEnvelopeSchema,
  }),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseBackupInput(input: unknown): BackupValidationResult {
  if (!isRecord(input)) {
    return {
      ok: false,
      issues: [{ type: 'error', message: 'Файл должен содержать JSON-объект.' }],
    };
  }

  const parsed = backupSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      issues: [{ type: 'error', message: 'Неверный формат бэкапа Workout Atlas.' }],
    };
  }

  const issues: BackupValidationResult['issues'] = [];
  const settingsState = parsed.data.stores.settings.state;
  const workoutState = parsed.data.stores.workout.state;

  if (!isRecord(settingsState)) {
    issues.push({ type: 'error', message: 'Секция настроек повреждена.' });
  }

  if (!isRecord(workoutState)) {
    issues.push({ type: 'error', message: 'Секция тренировок повреждена.' });
  }

  if (issues.some((issue) => issue.type === 'error')) {
    return { ok: false, issues };
  }

  return {
    ok: true,
    issues,
    backup: parsed.data as AppBackup,
  };
}