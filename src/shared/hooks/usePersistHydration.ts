import { useEffect, useState } from 'react';

type PersistApi = {
  hasHydrated: () => boolean;
  onFinishHydration: (fn: () => void) => () => void;
};

export function usePersistHydration(persist: PersistApi, timeoutMs = 2500): boolean {
  const [hydrated, setHydrated] = useState(() => persist.hasHydrated());

  useEffect(() => {
    if (persist.hasHydrated()) {
      setHydrated(true);
      return;
    }

    const unsub = persist.onFinishHydration(() => setHydrated(true));
    const fallback = setTimeout(() => setHydrated(true), timeoutMs);

    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, [persist, timeoutMs]);

  return hydrated;
}