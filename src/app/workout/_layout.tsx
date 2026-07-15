import { Stack } from 'expo-router';
import { colors } from '../../shared/theme/tokens';

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
      }}
    >
      <Stack.Screen name="focus" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}