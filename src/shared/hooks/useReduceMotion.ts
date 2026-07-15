import { useSettingsStore } from '../../features/settings/model/settings.store';

export function useReduceMotion() {
  return useSettingsStore((s) => s.reduceMotion);
}