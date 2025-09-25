import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const DateConverter: React.FC = () => {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDateInfo = () => {
    const now = new Date();
    const selected = selectedDate;
    const diffTime = Math.abs(now.getTime() - selected.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const dayOfWeek = selected.toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfYear = Math.floor((selected.getTime() - new Date(selected.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const weekOfYear = Math.ceil(dayOfYear / 7);
    
    return {
      dayOfWeek,
      dayOfYear,
      weekOfYear,
      diffDays,
      isLeapYear: selected.getFullYear() % 4 === 0 && (selected.getFullYear() % 100 !== 0 || selected.getFullYear() % 400 === 0),
    };
  };

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
    dateSection: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    inputLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      marginBottom: 8, // 8px margin bottom
    },
    dateButton: {
      backgroundColor: colors.primary,
      borderRadius: 8, // 8px border radius
      padding: 12, // 12px padding
      alignItems: 'center',
    },
    dateButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
    },
    resultSection: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    resultText: {
      color: colors.primary,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      marginBottom: 4, // 4px margin bottom
    },
    resultLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      marginBottom: 8, // 8px margin bottom
    },
  });

  const dateInfo = getDateInfo();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.dateSection}>
          <Text style={styles.inputLabel}>Selected Date</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Day of Week</Text>
          <Text style={styles.resultText}>{dateInfo.dayOfWeek}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Day of Year</Text>
          <Text style={styles.resultText}>{dateInfo.dayOfYear}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Week of Year</Text>
          <Text style={styles.resultText}>{dateInfo.weekOfYear}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Days from Today</Text>
          <Text style={styles.resultText}>{dateInfo.diffDays} days</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.resultLabel}>Leap Year</Text>
          <Text style={styles.resultText}>{dateInfo.isLeapYear ? 'Yes' : 'No'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
