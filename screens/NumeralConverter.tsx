import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const NumeralConverter: React.FC = () => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [selectedBase, setSelectedBase] = useState('10');

  const bases = [
    { name: 'Binary', value: '2', symbol: 'bin' },
    { name: 'Octal', value: '8', symbol: 'oct' },
    { name: 'Decimal', value: '10', symbol: 'dec' },
    { name: 'Hexadecimal', value: '16', symbol: 'hex' },
  ];

  const convertNumber = (value: string, fromBase: number, toBase: number) => {
    try {
      const decimal = parseInt(value, fromBase);
      if (isNaN(decimal)) return 'Invalid';
      
      if (toBase === 10) return decimal.toString();
      if (toBase === 2) return decimal.toString(2);
      if (toBase === 8) return decimal.toString(8);
      if (toBase === 16) return decimal.toString(16).toUpperCase();
      
      return decimal.toString(toBase);
    } catch {
      return 'Invalid';
    }
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
    inputSection: {
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
    inputField: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 12, // 12px padding
      fontSize: Typography.body.fontSize,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    baseSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    baseGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    baseButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginBottom: 8, // 8px margin bottom
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    baseButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    baseButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    baseButtonTextSelected: {
      color: colors.text,
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
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
    resultLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      marginBottom: 8, // 8px margin bottom
    },
  });

  const handleBaseSelect = (baseValue: string) => {
    setSelectedBase(baseValue);
  };

  const getResults = () => {
    if (!inputValue) return { binary: '0', octal: '0', decimal: '0', hex: '0' };
    
    const fromBase = parseInt(selectedBase);
    return {
      binary: convertNumber(inputValue, fromBase, 2),
      octal: convertNumber(inputValue, fromBase, 8),
      decimal: convertNumber(inputValue, fromBase, 10),
      hex: convertNumber(inputValue, fromBase, 16),
    };
  };

  const results = getResults();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.baseSelector}>
          <Text style={styles.inputLabel}>From Base</Text>
          <View style={styles.baseGrid}>
            {bases.map((base, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.baseButton,
                  selectedBase === base.value && styles.baseButtonSelected
                ]}
                onPress={() => handleBaseSelect(base.value)}
              >
                <Text style={[
                  styles.baseButtonText,
                  selectedBase === base.value && styles.baseButtonTextSelected
                ]}>
                  {base.name} ({base.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Number</Text>
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="default"
          />
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Binary (Base 2)</Text>
          <Text style={styles.resultText}>{results.binary}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Octal (Base 8)</Text>
          <Text style={styles.resultText}>{results.octal}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Decimal (Base 10)</Text>
          <Text style={styles.resultText}>{results.decimal}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.resultLabel}>Hexadecimal (Base 16)</Text>
          <Text style={styles.resultText}>{results.hex}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
