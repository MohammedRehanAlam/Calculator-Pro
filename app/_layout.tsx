import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ThemeProvider as CustomThemeProvider } from '../contexts/ThemeContext';

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
      <CustomThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="length-converter" options={{ 
              title: 'Length Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="temperature-converter" options={{ 
              title: 'Temperature Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="weight-converter" options={{ 
              title: 'Weight Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="area-converter" options={{ 
              title: 'Area Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="speed-converter" options={{ 
              title: 'Speed Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="data-converter" options={{ 
              title: 'Data Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="age-converter" options={{ 
              title: 'Age Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="bmi-converter" options={{ 
              title: 'BMI Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="date-converter" options={{ 
              title: 'Date Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="discount-converter" options={{ 
              title: 'Discount Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="numeral-converter" options={{ 
              title: 'Numeral Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="time-converter" options={{ 
              title: 'Time Converter',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="gst-calculator" options={{ 
              title: 'GST Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="currency-calculator" options={{ 
              title: 'Currency Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="investment-calculator" options={{ 
              title: 'Investment Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="loan-calculator" options={{ 
              title: 'Loan Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="mortgage-calculator" options={{ 
              title: 'Mortgage Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="credit-calculator" options={{ 
              title: 'Credit Calculator',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="history" options={{ 
              title: 'History',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="settings" options={{ 
              title: 'Settings',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="about" options={{ 
              title: 'About',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="reset" options={{ 
              title: 'Reset',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
            <Stack.Screen name="export" options={{ 
              title: 'Export',
              headerStyle: {
                backgroundColor: colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7'
              }
            }} />
          </Stack>
          <StatusBar 
            style={colorScheme === 'dark' ? 'light' : 'dark'} 
            backgroundColor={colorScheme === 'dark' ? '#1C1C1E' : '#F2F2F7' } // '#000000' : '#FFFFFF'}
            translucent={false}
          />
        </ThemeProvider>
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}
