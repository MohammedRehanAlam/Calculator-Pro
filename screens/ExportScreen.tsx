import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const ExportScreen: React.FC = () => {
  const { colors } = useTheme();

  const exportOptions = [
    {
      icon: '📋',
      title: 'Calculation History',
      description: 'Export all your calculation history',
    },
    {
      icon: '📊',
      title: 'Statistics Report',
      description: 'Generate usage statistics',
    },
    {
      icon: '⚙️',
      title: 'Settings Backup',
      description: 'Backup your app settings',
    },
  ];

  const shareOptions = [
    { icon: '📤', text: 'Share via Email' },
    { icon: '💬', text: 'Share via Message' },
    { icon: '📁', text: 'Save to Files' },
    { icon: '📋', text: 'Copy to Clipboard' },
  ];

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
    exportContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    exportSection: {
      marginBottom: 16, // 16px margin bottom
    },
    sectionTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
      marginBottom: 8, // 8px margin bottom
      paddingHorizontal: 2, // 2px horizontal padding
    },
    exportOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 8, // 8px margin bottom
      ...Shadows.sm,
    },
    exportIcon: {
      fontSize: 28, // 28px font size
      marginRight: 8, // 8px margin right
    },
    exportContent: {
      flex: 1,
    },
    exportTitle: {
      color: colors.text,
      fontSize: Typography.bodyBold.fontSize,
      fontWeight: '600',
      marginBottom: 2, // 2px margin bottom
    },
    exportDesc: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
    },
    exportArrow: {
      color: colors.textSecondary,
      fontSize: 20,
      fontWeight: 'bold',
    },
    shareOption: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
      ...Shadows.sm,
    },
    shareIcon: {
      fontSize: 24,
      marginRight: Spacing.md,
    },
    shareText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    exportInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceSecondary,
      padding: Spacing.md,
      borderRadius: BorderRadius.md,
      marginTop: Spacing.lg,
      marginBottom: Spacing.lg + 12,
    },
    infoIcon: {
      fontSize: 20,
      marginRight: Spacing.md,
    },
    infoText: {
      flex: 1,
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Export Data</Text>
      <ScrollView style={styles.exportContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Options</Text>
          {exportOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.exportOption}>
              <Text style={styles.exportIcon}>{option.icon}</Text>
              <View style={styles.exportContent}>
                <Text style={styles.exportTitle}>{option.title}</Text>
                <Text style={styles.exportDesc}>{option.description}</Text>
              </View>
              <Text style={styles.exportArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Share Options</Text>
          {shareOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.shareOption}>
              <Text style={styles.shareIcon}>{option.icon}</Text>
              <Text style={styles.shareText}>{option.text}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.exportInfo}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Exported data will be saved in CSV format and can be opened in any spreadsheet application.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
