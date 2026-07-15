import { type ReactNode, useEffect } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  SlideInDown,
  SlideOutDown,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { MOTION } from './animations/motion';
import { colors } from '../theme/tokens';

const HANDLE_HEIGHT = 32;
const DISMISS_DISTANCE = 88;
const DISMISS_VELOCITY = 700;

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  maxHeightRatio?: number;
  scrollable?: boolean;
}

export function BottomSheet({
  visible,
  onClose,
  children,
  maxHeightRatio = 0.85,
  scrollable = false,
}: BottomSheetProps) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const maxHeight = height * maxHeightRatio;
  const scrollMaxHeight = maxHeight - HANDLE_HEIGHT;
  const contentBottom = insets.bottom + 12;

  const translateY = useSharedValue(0);
  const scrollOffset = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = 0;
      scrollOffset.value = 0;
    }
  }, [visible, scrollOffset, translateY]);

  const scrollNative = Gesture.Native();

  const pan = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-32, 32])
    .simultaneousWithExternalGesture(scrollNative)
    .onUpdate((event) => {
      if (scrollable && scrollOffset.value > 0) return;
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_DISTANCE || event.velocityY > DISMISS_VELOCITY) {
        runOnJS(onClose)();
        return;
      }
      translateY.value = withSpring(0, MOTION.spring);
    });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  const bodyStyle = {
    paddingHorizontal: 20,
    paddingBottom: contentBottom,
    flexGrow: 0 as const,
  };

  return (
    <Modal
      visible
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent={Platform.OS === 'android'}
    >
      <GestureHandlerRootView style={styles.root}>
        <Pressable style={styles.overlay} onPress={onClose} accessibilityLabel="Закрыть">
          <GestureDetector gesture={pan}>
            <Animated.View
              entering={SlideInDown.duration(MOTION.normal)
                .springify()
                .damping(MOTION.enter.damping)
                .stiffness(MOTION.enter.stiffness)}
              exiting={SlideOutDown.duration(MOTION.fast)}
              style={[styles.sheetHost, sheetStyle]}
            >
              <Pressable
                style={[styles.sheet, { maxHeight }]}
                onPress={(event) => event.stopPropagation()}
              >
                <View style={styles.header}>
                  <View style={styles.handle} />
                </View>

                {scrollable ? (
                  <GestureDetector gesture={scrollNative}>
                    <AnimatedScrollView
                      onScroll={scrollHandler}
                      scrollEventThrottle={16}
                      style={{ maxHeight: scrollMaxHeight, flexGrow: 0 }}
                      contentContainerStyle={bodyStyle}
                      showsVerticalScrollIndicator
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      bounces
                      overScrollMode="never"
                    >
                      {children}
                    </AnimatedScrollView>
                  </GestureDetector>
                ) : (
                  <View style={bodyStyle}>{children}</View>
                )}
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </Pressable>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheetHost: {
    width: '100%',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.surfaceElevated,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 6,
    minHeight: HANDLE_HEIGHT,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: colors.borderStrong,
  },
});