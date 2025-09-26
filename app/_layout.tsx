import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import * as SystemUI from 'expo-system-ui';
import 'react-native-reanimated';

import { ThemeProvider as CustomThemeProvider, useTheme } from '../contexts/ThemeContext';
import { HistoryProvider } from '../contexts/HistoryContext';

// Component to handle status bar and system UI based on theme
function AppContent() {
  const { isDark } = useTheme();

  // Configure system UI for solid navigation bar
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      SystemUI.setBackgroundColorAsync(isDark ? '#000000' : '#FFFFFF');
    }
  }, [isDark]);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="length-converter" options={{ 
          title: 'Length Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="temperature-converter" options={{ 
          title: 'Temperature Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="weight-converter" options={{ 
          title: 'Weight Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="area-converter" options={{ 
          title: 'Area Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="speed-converter" options={{ 
          title: 'Speed Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="data-converter" options={{ 
          title: 'Data Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="age-converter" options={{ 
          title: 'Age Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="bmi-converter" options={{ 
          title: 'BMI Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="date-converter" options={{ 
          title: 'Date Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="discount-converter" options={{ 
          title: 'Discount Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="numeral-converter" options={{ 
          title: 'Numeral Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="time-converter" options={{ 
          title: 'Time Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="gst-calculator" options={{ 
          title: 'GST Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="currency-calculator" options={{ 
          title: 'Currency Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="investment-calculator" options={{ 
          title: 'Investment Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="loan-calculator" options={{ 
          title: 'Loan Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="mortgage-calculator" options={{ 
          title: 'Mortgage Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="credit-calculator" options={{ 
          title: 'Credit Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="history" options={{ 
          title: 'History',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="settings" options={{ 
          title: 'Settings',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="about" options={{ 
          title: 'About',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="energy-converter" options={{ 
          title: 'Energy Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="pressure-converter" options={{ 
          title: 'Pressure Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="volume-converter" options={{ 
          title: 'Volume Converter',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="graphing-calculator" options={{ 
          title: 'Graphing Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="compound-interest-calculator" options={{ 
          title: 'Compound Interest Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="retirement-planning-calculator" options={{ 
          title: 'Retirement Planning Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
        <Stack.Screen name="tax-calculator" options={{ 
          title: 'Tax Calculator',
          headerStyle: {
            backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7'
          }
        }} />
      </Stack>
      <StatusBar 
        style={isDark ? 'light' : 'dark'} 
        backgroundColor={isDark ? '#1C1C1E' : '#F2F2F7'}
        translucent={false}
      />
    </>
  );
}

// Component to provide navigation theme based on app theme
function NavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  
  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      {children}
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <HistoryProvider>
          <NavigationThemeProvider>
            <AppContent />
          </NavigationThemeProvider>
        </HistoryProvider>
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}
