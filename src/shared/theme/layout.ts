import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_PADDING_TOP = 8;
export const TAB_BAR_PADDING_BOTTOM = 10;
export const TAB_BAR_CONTENT_HEIGHT = 54;
export const TAB_BAR_LABEL_LINE_HEIGHT = 14;

/** Import footer: pt-3 + button + pb-3 + border */
export const IMPORT_ACTION_BAR_HEIGHT = 76;
export const IMPORT_SCROLL_END_PADDING = 20;

export function useTabBarHeight() {
  const { bottom } = useSafeAreaInsets();
  return (
    TAB_BAR_PADDING_TOP + TAB_BAR_CONTENT_HEIGHT + TAB_BAR_PADDING_BOTTOM + bottom
  );
}
