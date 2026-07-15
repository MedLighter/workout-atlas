import { useCallback, useRef } from 'react';
import { Dimensions } from 'react-native';
import type { FlatList, ScrollView } from 'react-native';
import { useKeyboardInset } from './useKeyboardInset';

type ScrollTarget = ScrollView | FlatList<any> | null;

export interface FocusedInputLayout {
  windowY: number;
  height: number;
}

export function useScrollToFocusedInput(extraBottomObstruction = 0, clearance = 28) {
  const keyboardHeight = useKeyboardInset();
  const scrollOffsetRef = useRef(0);

  const trackScroll = useCallback((offsetY: number) => {
    scrollOffsetRef.current = offsetY;
  }, []);

  const scrollToFocusedInput = useCallback(
    (scrollRef: React.RefObject<ScrollTarget>, layout: FocusedInputLayout) => {
      if (!scrollRef.current || keyboardHeight <= 0) return;

      const windowHeight = Dimensions.get('window').height;
      const visibleBottom =
        windowHeight - keyboardHeight - extraBottomObstruction - clearance;
      const inputBottom = layout.windowY + layout.height;

      if (inputBottom <= visibleBottom) return;

      const delta = inputBottom - visibleBottom;
      const nextOffset = scrollOffsetRef.current + delta;

      if ('scrollToOffset' in scrollRef.current) {
        scrollRef.current.scrollToOffset({ offset: nextOffset, animated: true });
        scrollOffsetRef.current = nextOffset;
        return;
      }

      if ('scrollTo' in scrollRef.current) {
        scrollRef.current.scrollTo({ y: nextOffset, animated: true });
        scrollOffsetRef.current = nextOffset;
      }
    },
    [clearance, extraBottomObstruction, keyboardHeight],
  );

  return {
    keyboardHeight,
    trackScroll,
    scrollToFocusedInput,
  };
}
