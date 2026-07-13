import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardFormScroll } from './KeyboardFormScroll';

interface AppScreenProps {
  children: ReactNode;
  scrollable?: boolean;
  scrollProps?: ScrollViewProps;
  className?: string;
  padded?: boolean;
}

export function AppScreen({
  children,
  scrollable = false,
  scrollProps,
  className,
  padded = true,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();
  const paddingClass = padded ? 'px-5' : '';
  const content = (
    <View
      className={`flex-1 bg-zinc-950 ${paddingClass} ${className ?? ''}`}
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {children}
    </View>
  );

  if (scrollable) {
    return (
      <KeyboardAvoidingView
        className="flex-1 bg-zinc-950"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ paddingTop: insets.top }}
      >
        <KeyboardFormScroll
          className="flex-1 bg-zinc-950"
          contentContainerStyle={{ flexGrow: 1, ...(scrollProps?.contentContainerStyle as object) }}
          footerSpacing={insets.bottom + 16}
          {...scrollProps}
        >
          <View className={`flex-1 ${paddingClass}`}>{children}</View>
        </KeyboardFormScroll>
      </KeyboardAvoidingView>
    );
  }

  return content;
}