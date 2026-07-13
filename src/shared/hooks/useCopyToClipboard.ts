import { useCallback, useRef, useState } from 'react';
import * as Clipboard from 'expo-clipboard';

export function useCopyToClipboard(resetMs = 2000) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string, key = 'default') => {
      await Clipboard.setStringAsync(text);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setCopiedKey(key);
      timeoutRef.current = setTimeout(() => {
        setCopiedKey(null);
        timeoutRef.current = null;
      }, resetMs);
    },
    [resetMs],
  );

  const isCopied = useCallback((key: string) => copiedKey === key, [copiedKey]);

  return { copy, isCopied, copiedKey };
}