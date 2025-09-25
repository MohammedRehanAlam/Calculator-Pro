import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();

  const historyItems = [
    { calculation: '200,000 ÷ 12', result: '16,666.6667', time: '2 minutes ago' },
    { calculation: '105 × 14', result: '1,470', time: '5 minutes ago' },
    { calculation: '8.02 ÷ 10', result: '0.802', time: '10 minutes ago' },
    { calculation: '0.802 × 4', result: '3.208', time: '12 minutes ago' },
    { calculation: '39,000 ÷ 12', result: '3,250', time: '15 minutes ago' },
    { calculation: '55,000 ÷ 12', result: '4,583.33333', time: '20 minutes ago' },
    { calculation: '705 ÷ 45', result: '15.6666667', time: '25 minutes ago' },
    { calculation: '5,650 ÷ 12', result: '470.833333', time: '30 minutes ago' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    historyScreenContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
    },
    historyList: {
      gap: 8, // 8px gap between items
      paddingTop: 12, // 12px top padding to match bottom padding
      paddingBottom: 12, // 12px bottom padding to match top padding
    },
    historyItem: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      borderLeftWidth: 3, // 3px left border
      borderLeftColor: colors.primary,
      ...Shadows.sm,
    },
    historyCalculation: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      marginBottom: 2, // 2px margin bottom
    },
    historyResult: {
      color: colors.primary,
      fontSize: Typography.bodyBold.fontSize,
      fontWeight: '600',
      marginBottom: 2, // 2px margin bottom
    },
    historyTime: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '400',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.historyScreenContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.historyList}>
          {historyItems.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyCalculation}>{item.calculation}</Text>
              <Text style={styles.historyResult}>{item.result}</Text>
              <Text style={styles.historyTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
