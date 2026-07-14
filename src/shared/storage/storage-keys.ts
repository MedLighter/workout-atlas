export const STORAGE_KEYS = {
  settings: 'workout-atlas-settings',
  workout: 'workout-atlas-data',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];