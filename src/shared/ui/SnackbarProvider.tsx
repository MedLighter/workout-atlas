import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { MOTION } from './animations/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { colors } from '../theme/tokens';

type SnackbarVariant = 'default' | 'success' | 'error' | 'warning';

interface SnackbarMessage {
  id: number;
  text: string;
  variant: SnackbarVariant;
  action?: { label: string; onPress: () => void };
}

interface SnackbarContextValue {
  showSnackbar: (
    text: string,
    options?: { variant?: SnackbarVariant; action?: SnackbarMessage['action'] },
  ) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

const variantBg: Record<SnackbarVariant, string> = {
  default: colors.surfaceElevated,
  success: colors.accentSurface,
  error: 'rgba(240,93,94,0.15)',
  warning: 'rgba(244,183,64,0.15)',
};

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<SnackbarMessage | null>(null);
  let nextId = 0;

  const showSnackbar = useCallback(
    (
      text: string,
      options?: { variant?: SnackbarVariant; action?: SnackbarMessage['action'] },
    ) => {
      const id = ++nextId;
      setMessage({
        id,
        text,
        variant: options?.variant ?? 'default',
        action: options?.action,
      });
      setTimeout(() => {
        setMessage((current) => (current?.id === id ? null : current));
      }, 4000);
    },
    [],
  );

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {message ? (
        <Animated.View
          entering={FadeInDown.duration(MOTION.normal)
            .springify()
            .damping(MOTION.enter.damping)
            .stiffness(MOTION.enter.stiffness)}
          exiting={FadeOutDown.duration(MOTION.fast)}
          className="absolute left-5 right-5 rounded-md border border-border-subtle px-4 py-3.5"
          style={{
            bottom: insets.bottom + 16,
            backgroundColor: variantBg[message.variant],
          }}
        >
          <View className="flex-row items-center justify-between gap-3">
            <AppText variant="bodyM" className="flex-1 text-content-primary">
              {message.text}
            </AppText>
            {message.action ? (
              <Pressable onPress={message.action.onPress} hitSlop={8}>
                <AppText variant="bodyM" className="text-accent font-semibold">
                  {message.action.label}
                </AppText>
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}