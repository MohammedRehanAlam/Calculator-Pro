import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Configure system UI for solid navigation bar
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(colorScheme === 'dark' ? '#000000' : '#FFFFFF');
    }
  }, [colorScheme]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
        <StatusBar 
          style={colorScheme === 'dark' ? 'light' : 'dark'} 
          backgroundColor={colorScheme === 'dark' ? '#000000' : '#FFFFFF'}
          translucent={false}
        />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
