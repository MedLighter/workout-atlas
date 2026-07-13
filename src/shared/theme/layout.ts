import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_PADDING_TOP = 8;
export const TAB_BAR_PADDING_BOTTOM = 8;
export const TAB_BAR_CONTENT_HEIGHT = 48;

export function useTabBarHeight() {
  const { bottom } = useSafeAreaInsets();
  return (
    TAB_BAR_PADDING_TOP + TAB_BAR_CONTENT_HEIGHT + TAB_BAR_PADDING_BOTTOM + bottom
  );
}