import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const FinancialCalculator: React.FC = () => {
  const { colors } = useTheme();

  const financialItems = [
    { icon: '📊', text: 'GST' },
    { icon: '💱', text: 'Currency' },
    { icon: '📈', text: 'Investment' },
    { icon: '💰', text: 'Loan' },
    { icon: '🏦', text: 'Mortgage' },
    { icon: '💳', text: 'Credit' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    financialContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    financialGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    financialButton: {
      width: screenWidth < 400 ? '45%' : '47%',
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 8, // 8px margin bottom
      alignItems: 'center',
      justifyContent: 'center',
      ...Shadows.sm,
    },
    financialIcon: {
      fontSize: 32, // 32px font size
      marginBottom: 4, // 4px margin bottom
    },
    financialText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.financialContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.financialGrid}>
          {financialItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.financialButton}>
              <Text style={styles.financialIcon}>{item.icon}</Text>
              <Text style={styles.financialText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
