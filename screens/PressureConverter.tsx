import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export const PressureConverter: React.FC = () => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Pascal');
  const [toUnit, setToUnit] = useState('Bar');

  const pressureUnits = [
    { name: 'Pascal', symbol: 'Pa', factor: 1 },
    { name: 'Bar', symbol: 'bar', factor: 100000 },
    { name: 'Atmosphere', symbol: 'atm', factor: 101325 },
    { name: 'PSI', symbol: 'psi', factor: 6894.76 },
    { name: 'Torr', symbol: 'Torr', factor: 133.322 },
    { name: 'Millibar', symbol: 'mbar', factor: 100 },
    { name: 'Kilopascal', symbol: 'kPa', factor: 1000 },
    { name: 'Megapascal', symbol: 'MPa', factor: 1000000 },
  ];

  const convertPressure = (value: number, fromUnitName: string, toUnitName: string) => {
    const fromUnitData = pressureUnits.find(unit => unit.name === fromUnitName);
    const toUnitData = pressureUnits.find(unit => unit.name === toUnitName);
    
    if (!fromUnitData || !toUnitData) return 0;
    
    // Convert to Pascal first, then to target unit
    const pascals = value * fromUnitData.factor;
    return pascals / toUnitData.factor;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    converterContainer: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 16,
    },
    inputSection: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    inputLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: Typography.body.fontSize,
      textAlign: 'right',
    },
    unitSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: Spacing.md,
    },
    unitButton: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      marginBottom: 8,
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    unitButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    unitButtonTextActive: {
      color: colors.text,
      fontWeight: '600',
    },
    resultSection: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    resultLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    resultContainer: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    resultText: {
      color: colors.text,
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
      textAlign: 'right',
    },
    backButton: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      ...Shadows.sm,
    },
    backButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
    },
  });

  const result = inputValue ? convertPressure(parseFloat(inputValue), fromUnit, toUnit) : 0;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Value</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
            <Text style={styles.inputLabel}>{pressureUnits.find(u => u.name === fromUnit)?.symbol}</Text>
          </View>
          
          <View style={styles.unitSelector}>
            {pressureUnits.map((unit) => (
              <TouchableOpacity
                key={unit.name}
                style={[
                  styles.unitButton,
                  fromUnit === unit.name && styles.unitButtonActive
                ]}
                onPress={() => setFromUnit(unit.name)}
              >
                <Text style={[
                  styles.unitButtonText,
                  fromUnit === unit.name && styles.unitButtonTextActive
                ]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.resultLabel}>Convert to</Text>
          <View style={styles.unitSelector}>
            {pressureUnits.map((unit) => (
              <TouchableOpacity
                key={unit.name}
                style={[
                  styles.unitButton,
                  toUnit === unit.name && styles.unitButtonActive
                ]}
                onPress={() => setToUnit(unit.name)}
              >
                <Text style={[
                  styles.unitButtonText,
                  toUnit === unit.name && styles.unitButtonTextActive
                ]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {inputValue ? result.toFixed(6) : '0'} {pressureUnits.find(u => u.name === toUnit)?.symbol}
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Converter</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
