import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const ResetScreen: React.FC = () => {
  const { colors } = useTheme();

  const resetOptions = [
    {
      icon: '📋',
      title: 'Clear History Only',
      description: 'Remove all calculation history',
      buttonText: 'Clear',
      isDanger: false,
    },
    {
      icon: '⚙️',
      title: 'Reset Settings',
      description: 'Restore default settings',
      buttonText: 'Reset',
      isDanger: false,
    },
    {
      icon: '🗑️',
      title: 'Reset Everything',
      description: 'Clear history and reset settings',
      buttonText: 'Reset All',
      isDanger: true,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    resetHeader: {
      alignItems: 'center',
      paddingHorizontal: 12, // 12px horizontal padding
      paddingVertical: 12, // 12px vertical padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resetIcon: {
      fontSize: 60, // 60px font size
      marginBottom: 8, // 8px margin bottom
    },
    screenTitle: {
      color: colors.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: Typography.h3.fontWeight,
    },
    resetSubtitle: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      textAlign: 'center',
      lineHeight: Typography.body.lineHeight,
      marginTop: 8, // 8px margin top
    },
    resetOptions: {
      paddingHorizontal: 12, // 12px horizontal padding
      paddingVertical: 12, // 12px vertical padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
      gap: 8, // 8px gap between items
    },
    resetOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      ...Shadows.sm,
    },
    resetOptionIcon: {
      fontSize: 32, // 32px font size
      marginRight: 8, // 8px margin right
    },
    resetOptionContent: {
      flex: 1,
    },
    resetOptionTitle: {
      color: colors.text,
      fontSize: Typography.bodyBold.fontSize,
      fontWeight: '600',
      marginBottom: 2, // 2px margin bottom
    },
    resetOptionDesc: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
    },
    resetButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingVertical: 8, // 8px vertical padding
      borderRadius: 8, // 8px border radius
    },
    resetButtonDanger: {
      backgroundColor: colors.error,
    },
    resetButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
    },
    resetWarning: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      marginHorizontal: 12, // 12px horizontal margin
      marginBottom: 16, // 16px margin bottom
      padding: 8, // 8px padding
      borderRadius: 12, // 12px border radius
    },
    warningIcon: {
      fontSize: 24, // 24px font size
      marginRight: 8, // 8px margin right
    },
    warningText: {
      flex: 1,
      color: colors.warning,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.resetHeader}>
        <Text style={styles.resetIcon}>🔄</Text>
        <Text style={styles.screenTitle}>Reset Calculator</Text>
        <Text style={styles.resetSubtitle}>
          This will clear all your calculation history and reset all settings to default values.
        </Text>
      </View>

      <ScrollView style={styles.resetOptions} showsVerticalScrollIndicator={false}>
        {resetOptions.map((option, index) => (
          <View key={index} style={styles.resetOption}>
            <Text style={styles.resetOptionIcon}>{option.icon}</Text>
            <View style={styles.resetOptionContent}>
              <Text style={styles.resetOptionTitle}>{option.title}</Text>
              <Text style={styles.resetOptionDesc}>{option.description}</Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.resetButton,
                option.isDanger && styles.resetButtonDanger
              ]}
            >
              <Text style={styles.resetButtonText}>{option.buttonText}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.resetWarning}>
        <Text style={styles.warningIcon}>⚠️</Text>
        <Text style={styles.warningText}>
          This action cannot be undone. Make sure to export your data if needed.
        </Text>
      </View>
    </View>
  );
};
