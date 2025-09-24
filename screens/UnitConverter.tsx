import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const UnitConverter: React.FC = () => {
  const { colors } = useTheme();

  const converterItems = [
    { icon: '🎂', text: 'Age' },
    { icon: '📐', text: 'Area' },
    { icon: '⚖️', text: 'BMI' },
    { icon: '💾', text: 'Data' },
    { icon: '📅', text: 'Date' },
    { icon: '🏷️', text: 'Discount' },
    { icon: '📏', text: 'Length' },
    { icon: '⚖️', text: 'Mass' },
    { icon: '🔢', text: 'Numeral' },
    { icon: '🏃', text: 'Speed' },
    { icon: '🌡️', text: 'Temperature' },
    { icon: '⏰', text: 'Time' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    converterContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    converterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    converterButton: {
      width: screenWidth < 400 ? '30%' : '31%',
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 8, // 8px margin bottom
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.sm,
    },
    converterIcon: {
      fontSize: 28, // 28px font size
      marginBottom: 4, // 4px margin bottom
    },
    converterText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.converterGrid}>
          {converterItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.converterButton}>
              <Text style={styles.converterIcon}>{item.icon}</Text>
              <Text style={styles.converterText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
