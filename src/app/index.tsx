import { Redirect } from 'expo-router';
import { useSettingsStore } from '../features/settings/model/settings.store';

export default function Index() {
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}