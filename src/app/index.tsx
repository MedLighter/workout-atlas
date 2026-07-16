import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useSettingsStore } from '../features/settings/model/settings.store';
import { usePersistHydration } from '../shared/hooks/usePersistHydration';
import { colors } from '../shared/theme/tokens';

export default function Index() {
  const hydrated = usePersistHydration(useSettingsStore.persist);
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}