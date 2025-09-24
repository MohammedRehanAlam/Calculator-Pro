import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const AboutScreen: React.FC = () => {
  const { colors } = useTheme();

  const features = [
    { icon: '🔢', text: 'Basic Calculator with History' },
    { icon: '📐', text: 'Unit Converter' },
    { icon: '💰', text: 'Financial Calculator' },
    { icon: '📤', text: 'Export & Share' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    aboutContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    aboutHeader: {
      alignItems: 'center',
      marginBottom: 16, // 16px margin bottom
    },
    appIcon: {
      fontSize: 80, // 80px font size
      marginBottom: 8, // 8px margin bottom
    },
    appName: {
      color: colors.text,
      fontSize: Typography.h2.fontSize,
      fontWeight: Typography.h2.fontWeight,
      marginBottom: 4, // 4px margin bottom
    },
    appVersion: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    aboutSection: {
      marginBottom: 16, // 16px margin bottom
    },
    sectionTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
      marginBottom: 8, // 8px margin bottom
      paddingHorizontal: 2, // 2px horizontal padding
    },
    aboutText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight,
      marginBottom: 8, // 8px margin bottom
    },
    featureList: {
      gap: 8, // 8px gap between items
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      ...Shadows.sm,
    },
    featureIcon: {
      fontSize: 24,
      marginRight: Spacing.md,
    },
    featureText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    supportButton: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      alignItems: 'center',
      ...Shadows.sm,
    },
    supportButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.aboutContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutHeader}>
          <Text style={styles.appIcon}>🧮</Text>
          <Text style={styles.appName}>Calculator Pro</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <Text style={styles.aboutText}>
            Calculator Pro is a comprehensive calculator application designed for everyday calculations, 
            unit conversions, and financial computations. Built with React Native and Expo, it provides 
            a modern, intuitive interface for all your mathematical needs.
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featureList}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Developer</Text>
          <Text style={styles.aboutText}>
            Developed with ❤️ using React Native and Expo. 
            Built for cross-platform compatibility and modern user experience.
          </Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Rate This App</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
