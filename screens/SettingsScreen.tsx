import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const SettingsScreen: React.FC = () => {
  const { colors } = useTheme();

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
      backgroundColor: colors.primary,
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Settings</Text>
      <ScrollView style={styles.settingsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Display</Text>
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Dark Mode</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleActive} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Show History</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleActive} />
              </TouchableOpacity>
            </View>
            <View style={styles.settingItem}>
              <Text style={styles.settingText}>Haptic Feedback</Text>
              <TouchableOpacity style={styles.toggleSwitch}>
                <View style={styles.toggleActive} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Calculator</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Decimal Places</Text>
              <Text style={styles.settingValue}>Auto</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Number Format</Text>
              <Text style={styles.settingValue}>US</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Auto Clear</Text>
              <Text style={styles.settingValue}>Off</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.settingsList}>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Clear History</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>Export Data</Text>
              <Text style={styles.settingArrow}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
