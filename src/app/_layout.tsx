import 'react-native-gesture-handler';
import '../../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SnackbarProvider } from '../shared/ui/SnackbarProvider';
import { colors } from '../shared/theme/tokens';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bgPrimary }}>
      <SafeAreaProvider>
        <SnackbarProvider>
          <StatusBar style="light" translucent />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bgPrimary },
              cardStyle: { backgroundColor: colors.bgPrimary },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="generator" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="import" />
            <Stack.Screen name="manual-program" />
          </Stack>
        </SnackbarProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}