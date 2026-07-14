import type { ConfigContext, ExpoConfig } from 'expo/config';

const GITHUB_PAGES_BASE_PATH = 'workout-atlas';

function normalizeBasePath(path: string): string {
  const trimmed = path.replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '';
}

function resolveBaseUrl(): string {
  const fromEnv = process.env.EXPO_BASE_PATH?.trim();
  if (fromEnv) {
    return normalizeBasePath(fromEnv);
  }

  if (process.env.GITHUB_PAGES === 'true') {
    return normalizeBasePath(GITHUB_PAGES_BASE_PATH);
  }

  return '';
}

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Workout Atlas',
  slug: 'workout-atlas',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  backgroundColor: '#09090B',
  primaryColor: '#10B981',
  platforms: ['ios', 'android', 'web'],
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#09090B',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.workoutatlas.app',
  },
  android: {
    versionCode: 1,
    backgroundColor: '#09090B',
    softwareKeyboardLayoutMode: 'resize',
    adaptiveIcon: {
      backgroundColor: '#0B1018',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'com.workoutatlas.app',
  },
  web: {
    bundler: 'metro',
    output: 'single',
    favicon: './assets/favicon.png',
    name: 'Workout Atlas',
    shortName: 'Atlas',
    lang: 'ru',
    themeColor: '#09090B',
    backgroundColor: '#09090B',
    display: 'standalone',
    orientation: 'portrait',
    description: 'Твой атлас нагрузки — быстрый трекинг тренировок и глубокая аналитика',
    startUrl: '.',
    scope: resolveBaseUrl() || '/',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#09090B',
    },
  },
  scheme: 'workout-atlas',
  plugins: [
    [
      'expo-router',
      {
        root: 'src/app',
      },
    ],
    'expo-sqlite',
    'expo-font',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#09090B',
        image: './assets/splash-icon.png',
        imageWidth: 200,
      },
    ],
  ],
  experiments: {
    baseUrl: resolveBaseUrl(),
  },
});