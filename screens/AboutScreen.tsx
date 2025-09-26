import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';


export const AboutScreen: React.FC = () => {
  const { colors } = useTheme();

  const features = [
    { icon: '🔢', text: 'Basic Calculator with Scientific Functions' },
    { icon: '📐', text: 'Unit Converter (Length, Weight, Temperature, etc.)' },
    { icon: '💰', text: 'Financial Calculator (Loan, Investment, Mortgage)' },
    { icon: '📋', text: 'Calculation History with Export' },
    { icon: '⚙️', text: 'Customizable Settings (BODMAS/Left-to-Right)' },
    { icon: '🎨', text: 'Dark/Light Theme Support' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    aboutContainer: {
      flex: 1,
      paddingHorizontal: 16, // Increased padding for better spacing
      paddingTop: 16, // Increased top padding
      paddingBottom: 20, // Increased bottom padding
    },
    aboutHeader: {
      alignItems: 'center',
      marginBottom: 24, // Increased margin bottom
      paddingHorizontal: 8, // Added horizontal padding
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
      textAlign: 'center', // Center align text
    },
    appVersion: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      textAlign: 'center', // Center align text
    },
    aboutSection: {
      marginBottom: 20, // Increased margin bottom
      paddingHorizontal: 4, // Added horizontal padding
    },
    sectionTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
      marginBottom: 12, // Increased margin bottom
      textAlign: 'left', // Left align section titles
    },
    aboutText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      lineHeight: Typography.body.lineHeight * 1.4, // Increased line height for better readability
      marginBottom: 8, // 8px margin bottom
      textAlign: 'left', // Left align text
    },
    featureList: {
      gap: 12, // Increased gap between items
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'flex-start', // Changed to flex-start for better alignment
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: 4, // Added margin bottom
      ...Shadows.sm,
    },
    featureIcon: {
      fontSize: 24,
      marginRight: Spacing.md,
      marginTop: 2, // Added top margin for better alignment
      flexShrink: 0, // Prevent icon from shrinking
    },
    featureText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      flex: 1, // Take remaining space
      lineHeight: Typography.body.lineHeight * 1.3, // Increased line height
      textAlign: 'left', // Left align text
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
      textAlign: 'center', // Center align button text
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.aboutContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.aboutHeader}>
          {/* <Text style={styles.appIcon}>🧮</Text> */}
          <Text style={styles.appName}>Calculator Pro</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.sectionTitle}>About This App</Text>
          <Text style={styles.aboutText}>
            Calculator Pro is a comprehensive calculator application designed for everyday calculations, 
            unit conversions, and financial computations. It provides a modern, 
            intuitive interface for all your mathematical needs.
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

        <View style={[styles.aboutSection, { marginBottom: 65 }]}>
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
