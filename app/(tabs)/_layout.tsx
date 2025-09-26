import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          height: 65,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
        headerShown: false, // Hide default headers for tab screens
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calculator',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>☰</Text>,
        }}
      />
      <Tabs.Screen
        name="converter"
        options={{
          title: 'Converter',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⊞</Text>,
        }}
      />
      <Tabs.Screen
        name="financial"
        options={{
          title: 'Financial',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>$</Text>,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⋮</Text>,
        }}
      />
    </Tabs>
  );
}
