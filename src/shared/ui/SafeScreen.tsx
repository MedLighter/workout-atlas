import { type ReactNode, type RefObject } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardFormScroll } from './KeyboardFormScroll';
import { useTabBarHeight } from '../theme/layout';
import { AppBackdrop } from './AppBackdrop';

interface SafeScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
  className?: string;
  padded?: boolean;
  reserveTabBar?: boolean;
  extraBottomSpacing?: number;
  scrollRef?: RefObject<ScrollView | null>;
  edges?: ('top' | 'bottom')[];
}

export function SafeScreen({
  children,
  scrollable = false,
  scrollProps,
  className,
  padded = true,
  reserveTabBar = false,
  extraBottomSpacing = 0,
  scrollRef,
  edges = ['top', 'bottom'],
}: SafeScreenProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useTabBarHeight();
  const bottomSpacing =
    (edges.includes('bottom') ? insets.bottom : 0) +
    16 +
    (reserveTabBar ? tabBarHeight : 0) +
    extraBottomSpacing;
  const paddingClass = padded ? 'px-5' : '';
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;

  const shell = (body: ReactNode) => (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <AppBackdrop />
      {body}
    </View>
  );

  if (scrollable) {
    return shell(
      <KeyboardAvoidingView
        style={{ flex: 1, minHeight: 0 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <KeyboardFormScroll
          ref={scrollRef}
          style={{ flex: 1, minHeight: 0 }}
          withAvoidingView={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop,
            ...(scrollProps?.contentContainerStyle as object),
          }}
          footerSpacing={bottomSpacing}
          {...scrollProps}
        >
          <View className={paddingClass}>{children}</View>
        </KeyboardFormScroll>
      </KeyboardAvoidingView>,
    );
  }

  return shell(
    <View
      className={`flex-1 ${paddingClass} ${className ?? ''}`}
      style={{ paddingTop, paddingBottom }}
    >
      {children}
    </View>,
  );
}