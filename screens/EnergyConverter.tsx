import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export const EnergyConverter: React.FC = () => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Joules');
  const [toUnit, setToUnit] = useState('Calories');

  const energyUnits = [
    { name: 'Joules', symbol: 'J', factor: 1 },
    { name: 'Calories', symbol: 'cal', factor: 4.184 },
    { name: 'Kilocalories', symbol: 'kcal', factor: 4184 },
    { name: 'Watt Hours', symbol: 'Wh', factor: 3600 },
    { name: 'Kilowatt Hours', symbol: 'kWh', factor: 3600000 },
    { name: 'BTU', symbol: 'BTU', factor: 1055.06 },
    { name: 'Foot Pounds', symbol: 'ft·lb', factor: 1.35582 },
    { name: 'Electron Volts', symbol: 'eV', factor: 1.602176634e-19 },
  ];

  const convertEnergy = (value: number, fromUnitName: string, toUnitName: string) => {
    const fromUnitData = energyUnits.find(unit => unit.name === fromUnitName);
    const toUnitData = energyUnits.find(unit => unit.name === toUnitName);
    
    if (!fromUnitData || !toUnitData) return 0;
    
    // Convert to Joules first, then to target unit
    const joules = value * fromUnitData.factor;
    return joules / toUnitData.factor;
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

  const result = inputValue ? convertEnergy(parseFloat(inputValue), fromUnit, toUnit) : 0;

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
            <Text style={styles.inputLabel}>{energyUnits.find(u => u.name === fromUnit)?.symbol}</Text>
          </View>
          
          <View style={styles.unitSelector}>
            {energyUnits.map((unit) => (
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
            {energyUnits.map((unit) => (
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
              {inputValue ? result.toFixed(6) : '0'} {energyUnits.find(u => u.name === toUnit)?.symbol}
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
