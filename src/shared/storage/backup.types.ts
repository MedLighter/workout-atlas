export const BACKUP_PROTOCOL_VERSION = '1.0' as const;

export interface PersistEnvelope<T = unknown> {
  state: T;
  version?: number;
}

export interface AppBackup {
  protocolVersion: typeof BACKUP_PROTOCOL_VERSION;
  app: 'workout-atlas';
  exportedAt: string;
  stores: {
    settings: PersistEnvelope;
    workout: PersistEnvelope;
  };
}

export type BackupValidationIssue =
  | { type: 'error'; message: string }
  | { type: 'warning'; message: string };

export interface BackupValidationResult {
  ok: boolean;
  issues: BackupValidationIssue[];
  backup?: AppBackup;
}