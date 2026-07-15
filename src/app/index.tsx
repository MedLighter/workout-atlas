import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useSettingsStore } from '../features/settings/model/settings.store';
import { colors } from '../shared/theme/tokens';

export default function Index() {
  const [hydrated, setHydrated] = useState(() => useSettingsStore.persist.hasHydrated());
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  useEffect(() => {
    if (useSettingsStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    const unsub = useSettingsStore.persist.onFinishHydration(() => setHydrated(true));
    const fallback = setTimeout(() => setHydrated(true), 2500);
    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, []);

  if (!hydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.bgPrimary }} />;
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}