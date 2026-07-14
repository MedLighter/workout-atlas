import { parseBackupInput } from '../shared/storage/backup.schema';
import { BACKUP_PROTOCOL_VERSION } from '../shared/storage/backup.types';

const validBackup = {
  protocolVersion: BACKUP_PROTOCOL_VERSION,
  app: 'workout-atlas',
  exportedAt: '2026-07-13T12:00:00.000Z',
  stores: {
    settings: {
      state: {
        unit: 'kg',
        restTimerSec: 90,
        trackingMode: 'detailed',
        onboardingComplete: true,
        aiImportPrompt: 'prompt',
      },
      version: 0,
    },
    workout: {
      state: {
        currentSession: null,
        templates: [],
        completedSessions: [],
        weeklyProgram: {
          id: 'program-1',
          name: 'Базовый план',
          days: [],
        },
        selectedWeekday: 0,
      },
      version: 0,
    },
  },
};

describe('parseBackupInput', () => {
  it('accepts a valid backup payload', () => {
    const result = parseBackupInput(validBackup);
    expect(result.ok).toBe(true);
    expect(result.backup?.app).toBe('workout-atlas');
  });

  it('rejects backups with wrong protocol version', () => {
    const result = parseBackupInput({
      ...validBackup,
      protocolVersion: '2.0',
    });
    expect(result.ok).toBe(false);
  });

  it('rejects backups with broken store sections', () => {
    const result = parseBackupInput({
      ...validBackup,
      stores: {
        settings: { state: null },
        workout: { state: [] },
      },
    });
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.type === 'error')).toBe(true);
  });
});