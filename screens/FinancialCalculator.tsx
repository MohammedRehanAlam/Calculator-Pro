import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get('window');

export const FinancialCalculator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const financialItems = [
    { icon: '📊', text: 'GST', screen: 'gst-calculator' },
    { icon: '💱', text: 'Currency', screen: 'currency-calculator' },
    { icon: '📈', text: 'Investment', screen: 'investment-calculator' },
    { icon: '💰', text: 'Loan', screen: 'loan-calculator' },
    { icon: '🏦', text: 'Mortgage', screen: 'mortgage-calculator' },
    { icon: '💳', text: 'Credit', screen: 'credit-calculator' },
    { icon: '📊', text: 'Compound Interest', screen: 'compound-interest-calculator' },
    { icon: '🏖️', text: 'Retirement Planning', screen: 'retirement-planning-calculator' },
    { icon: '🧾', text: 'Tax Calculator', screen: 'tax-calculator' },
  ];

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}` as any);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    financialContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      // paddingTop: insets.top + 65 + 12, // Status bar + tab bar + 12px top padding
      paddingTop: 12,
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    financialGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    financialButton: {
      width: screenWidth < 400 ? '48.5%' : '48.5%',
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
        <View style={[styles.financialGrid, { marginBottom: 155 }]}>
          {financialItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.financialButton}
                        onPress={() => handleNavigate(item.screen)}
            >
              <Text style={styles.financialIcon}>{item.icon}</Text>
              <Text style={styles.financialText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
