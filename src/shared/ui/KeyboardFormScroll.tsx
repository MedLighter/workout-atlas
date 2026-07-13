import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface KeyboardFormScrollProps extends ScrollViewProps {
  children: ReactNode;
  footerSpacing?: number;
  style?: StyleProp<ViewStyle>;
  withAvoidingView?: boolean;
}

export const KeyboardFormScroll = forwardRef<ScrollView, KeyboardFormScrollProps>(function KeyboardFormScroll(
  {
    children,
    footerSpacing = 24,
    contentContainerStyle,
    style,
    withAvoidingView = true,
    ...scrollProps
  },
  ref,
) {
  const { bottom } = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const scrollView = (
    <ScrollView
      ref={ref}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
      style={withAvoidingView ? undefined : style}
      contentContainerStyle={[
        { paddingBottom: bottom + footerSpacing + keyboardHeight },
        contentContainerStyle,
      ]}
      {...scrollProps}
    >
      {children}
    </ScrollView>
  );

  if (!withAvoidingView) {
    return scrollView;
  }

  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
    >
      {scrollView}
    </KeyboardAvoidingView>
  );
});

export function scrollInputIntoView(
  scrollRef: React.RefObject<ScrollView | null>,
  viewportY: number,
  viewportHeight: number,
) {
  scrollRef.current?.scrollTo({
    y: Math.max(0, viewportY - viewportHeight * 0.35),
    animated: true,
  });
}