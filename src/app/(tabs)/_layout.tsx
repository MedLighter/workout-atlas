import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_CONTENT_HEIGHT,
  TAB_BAR_LABEL_LINE_HEIGHT,
  TAB_BAR_PADDING_BOTTOM,
  TAB_BAR_PADDING_TOP,
} from '../../shared/theme/layout';
import { colors } from '../../shared/theme/tokens';

const TAB_ICON_SIZE = 22;

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const webTabBarExtra = Platform.OS === 'web' ? 4 : 0;
  const tabBarHeight =
    TAB_BAR_PADDING_TOP +
    TAB_BAR_CONTENT_HEIGHT +
    TAB_BAR_PADDING_BOTTOM +
    bottom +
    webTabBarExtra;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: 'transparent' },
        tabBarStyle: {
          backgroundColor: '#070B0D',
          borderTopColor: colors.borderSubtle,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: TAB_BAR_PADDING_BOTTOM + bottom + webTabBarExtra,
          paddingTop: TAB_BAR_PADDING_TOP,
        },
        tabBarActiveTintColor: colors.accentPrimary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: TAB_BAR_LABEL_LINE_HEIGHT,
          fontWeight: '600',
          marginTop: 2,
          ...(Platform.OS === 'web'
            ? { paddingBottom: 2, marginBottom: 0 }
            : { marginBottom: 1 }),
        },
        tabBarItemStyle: {
          paddingTop: 2,
          paddingBottom: Platform.OS === 'web' ? 2 : 0,
        },
        tabBarIconStyle: {
          marginBottom: 1,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Сегодня',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'today' : 'today-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'План',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Прогресс',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'stats-chart' : 'stats-chart-outline'}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="import" options={{ href: null }} />
      <Tabs.Screen name="library" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}