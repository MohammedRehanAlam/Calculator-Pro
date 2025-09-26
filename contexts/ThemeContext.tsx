import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeContextType {
  isDark: boolean;
  colors: typeof Colors.dark;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  // Load theme mode from storage on mount
  useEffect(() => {
    loadThemeMode();
  }, []);

  // Update isDark based on theme mode and system scheme
  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    } else {
      setIsDark(themeMode === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  const loadThemeMode = async () => {
    try {
      const savedThemeMode = await AsyncStorage.getItem('theme-mode');
      if (savedThemeMode) {
        const parsedMode = JSON.parse(savedThemeMode) as ThemeMode;
        setThemeModeState(parsedMode);
      } else {
        // Set default to 'system' and save it
        await AsyncStorage.setItem('theme-mode', JSON.stringify('system'));
        setThemeModeState('system');
      }
    } catch (error) {
      console.error('Failed to load theme mode:', error);
      setThemeModeState('system');
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme-mode', JSON.stringify(mode));
      setThemeModeState(mode);
    } catch (error) {
      console.error('Failed to save theme mode:', error);
    }
  };

  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider value={{ isDark, colors, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
