import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_CONTENT_HEIGHT,
  TAB_BAR_PADDING_BOTTOM,
  TAB_BAR_PADDING_TOP,
} from '../../shared/theme/layout';

export default function TabsLayout() {
  const { bottom } = useSafeAreaInsets();
  const tabBarHeight =
    TAB_BAR_PADDING_TOP + TAB_BAR_CONTENT_HEIGHT + TAB_BAR_PADDING_BOTTOM + bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#09090B',
          borderTopColor: '#27272A',
          height: tabBarHeight,
          paddingBottom: TAB_BAR_PADDING_BOTTOM + bottom,
          paddingTop: TAB_BAR_PADDING_TOP,
        },
        tabBarActiveTintColor: '#10B981',
        tabBarInactiveTintColor: '#71717A',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="today-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="import"
        options={{
          title: 'Import',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}