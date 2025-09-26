import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme, ThemeMode } from '../contexts/ThemeContext';
import { useHistory } from '../contexts/HistoryContext';
import { Typography, Spacing, Shadows } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const SettingsScreen: React.FC = () => {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { clearHistory } = useHistory();
  
  // Settings state
  const [calculationMode, setCalculationMode] = useState<'bodmas' | 'left-to-right'>('left-to-right');
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('calculation-mode');
      const savedHaptic = await AsyncStorage.getItem('haptic-feedback');

      // Set default to 'left-to-right' if no saved mode exists
      if (savedMode) {
        const parsedMode = JSON.parse(savedMode) as 'bodmas' | 'left-to-right';
        setCalculationMode(parsedMode);
      } else {
        // Save the default mode to storage
        await AsyncStorage.setItem('calculation-mode', JSON.stringify('left-to-right'));
        setCalculationMode('left-to-right');
      }
      
      if (savedHaptic !== null) setHapticFeedback(JSON.parse(savedHaptic));
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSetting = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save setting:', error);
    }
  };

  const handleCalculationModeChange = (mode: 'bodmas' | 'left-to-right') => {
    setCalculationMode(mode);
    saveSetting('calculation-mode', mode);
  };

  const handleHapticFeedbackToggle = () => {
    const newValue = !hapticFeedback;
    setHapticFeedback(newValue);
    saveSetting('haptic-feedback', newValue);
  };

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };


  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all calculation history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive', 
          onPress: () => {
            clearHistory();
            Alert.alert('Success', 'History cleared successfully.');
          }
        }
      ]
    );
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenTitle: {
      color: colors.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: Typography.h3.fontWeight,
      textAlign: 'center',
      paddingVertical: 12, // 12px vertical padding
    },
    settingsContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    settingsSection: {
      marginBottom: 16, // 16px margin bottom
    },
    sectionTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
      marginBottom: 8, // 8px margin bottom
      paddingHorizontal: 2, // 2px horizontal padding
    },
    settingsList: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      overflow: 'hidden',
      ...Shadows.sm,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8, // 8px padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingText: {
      flex: 1,
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    settingValue: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      marginRight: Spacing.sm,
    },
    settingArrow: {
      color: colors.textSecondary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    toggleSwitch: {
      width: 50,
      height: 30,
      backgroundColor: colors.border,
      borderRadius: 15,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleActive: {
      width: 26,
      height: 26,
      backgroundColor: colors.text,
      borderRadius: 13,
      alignSelf: 'flex-end',
    },
    toggleSwitchActive: {
      backgroundColor: colors.primary,
    },
    toggleActiveActive: {
      alignSelf: 'flex-start',
    },
    modeSelector: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 4,
      marginTop: 8,
    },
    modeOption: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    modeOptionActive: {
      backgroundColor: colors.primary,
    },
    modeOptionText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    modeOptionTextActive: {
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      {/* <Text style={styles.screenTitle}>Settings</Text> */}
      <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          {/* <Text style={styles.sectionTitle}>Calculator</Text> */}
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Calculation Mode</Text>
            </View>
            <View style={styles.modeSelector}>
              <TouchableOpacity 
                style={[
                  styles.modeOption,
                  calculationMode === 'bodmas' && styles.modeOptionActive
                ]}
                onPress={() => handleCalculationModeChange('bodmas')}
              >
                <Text style={[
                  styles.modeOptionText,
                  calculationMode === 'bodmas' && styles.modeOptionTextActive
                ]}>
                  BODMAS
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modeOption,
                  calculationMode === 'left-to-right' && styles.modeOptionActive
                ]}
                onPress={() => handleCalculationModeChange('left-to-right')}
              >
                <Text style={[
                  styles.modeOptionText,
                  calculationMode === 'left-to-right' && styles.modeOptionTextActive
                ]}>
                  Left to Right
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Display</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Theme</Text>
              <View style={styles.modeSelector}>
                <TouchableOpacity 
                  style={[
                    styles.modeOption,
                    themeMode === 'system' && styles.modeOptionActive
                  ]}
                  onPress={() => handleThemeModeChange('system')}
                >
                  <Text style={[
                    styles.modeOptionText,
                    themeMode === 'system' && styles.modeOptionTextActive
                  ]}>
                    System
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modeOption,
                    themeMode === 'light' && styles.modeOptionActive
                  ]}
                  onPress={() => handleThemeModeChange('light')}
                >
                  <Text style={[
                    styles.modeOptionText,
                    themeMode === 'light' && styles.modeOptionTextActive
                  ]}>
                    Light
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.modeOption,
                    themeMode === 'dark' && styles.modeOptionActive
                  ]}
                  onPress={() => handleThemeModeChange('dark')}
                >
                  <Text style={[
                    styles.modeOptionText,
                    themeMode === 'dark' && styles.modeOptionTextActive
                  ]}>
                    Dark
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Haptic Feedback</Text>
              <TouchableOpacity 
                style={[
                  styles.toggleSwitch,
                  hapticFeedback && styles.toggleSwitchActive
                ]}
                onPress={handleHapticFeedbackToggle}
              >
                <View style={[
                  styles.toggleActive,
                  hapticFeedback && styles.toggleActiveActive
                ]} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[styles.settingsSection, { marginBottom: 65 }]}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
              <Text style={styles.settingText}>Clear History</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
