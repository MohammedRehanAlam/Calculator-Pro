import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export const UnitConverter: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const converterItems = [
    { icon: '🎂', text: 'Age', screen: 'age-converter' },
    { icon: '📐', text: 'Area', screen: 'area-converter' },
    { icon: '⚖️', text: 'BMI', screen: 'bmi-converter' },
    { icon: '💾', text: 'Data', screen: 'data-converter' },
    { icon: '📅', text: 'Date', screen: 'date-converter' },
    { icon: '🏷️', text: 'Discount', screen: 'discount-converter' },
    { icon: '⚡', text: 'Energy', screen: 'energy-converter' },
    { icon: '📏', text: 'Length', screen: 'length-converter' },
    { icon: '⚖️', text: 'Mass', screen: 'weight-converter' },
    { icon: '🔢', text: 'Numeral', screen: 'numeral-converter' },
    { icon: '🌡️', text: 'Pressure', screen: 'pressure-converter' },
    { icon: '🏃', text: 'Speed', screen: 'speed-converter' },
    { icon: '🌡️', text: 'Temperature', screen: 'temperature-converter' },
    { icon: '⏰', text: 'Time', screen: 'time-converter' },
    { icon: '📦', text: 'Volume', screen: 'volume-converter' },
    { icon: '📊', text: 'Graphing', screen: 'graphing-calculator' },
  ];

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}` as any);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    converterContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: insets.top + 65 + 12, // Status bar + tab bar + 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    converterGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    converterButton: {
      width: screenWidth < 400 ? '48.5%' : '48.5%',
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
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.converterGrid, { marginBottom: 155 }]}>
          {converterItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.converterButton}
                        onPress={() => handleNavigate(item.screen)}
            >
              <Text style={styles.converterIcon}>{item.icon}</Text>
              <Text style={styles.converterText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
