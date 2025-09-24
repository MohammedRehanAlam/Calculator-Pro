import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const LengthConverter: React.FC = () => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Meters');
  const [toUnit, setToUnit] = useState('Kilometers');

  const lengthUnits = [
    { name: 'Millimeters', symbol: 'mm', factor: 1000 },
    { name: 'Centimeters', symbol: 'cm', factor: 100 },
    { name: 'Meters', symbol: 'm', factor: 1 },
    { name: 'Kilometers', symbol: 'km', factor: 0.001 },
    { name: 'Inches', symbol: 'in', factor: 39.3701 },
    { name: 'Feet', symbol: 'ft', factor: 3.28084 },
    { name: 'Yards', symbol: 'yd', factor: 1.09361 },
    { name: 'Miles', symbol: 'mi', factor: 0.000621371 },
  ];

  const convertLength = (value: number, fromUnitName: string, toUnitName: string) => {
    const fromFactor = lengthUnits.find(unit => unit.name === fromUnitName)?.factor || 1;
    const toFactor = lengthUnits.find(unit => unit.name === toUnitName)?.factor || 1;
    return (value / fromFactor) * toFactor;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12, // 12px horizontal padding
      paddingVertical: 8, // 8px vertical padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    screenTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8, // 8px horizontal padding
      paddingVertical: 4, // 4px vertical padding
      borderRadius: 8, // 8px border radius
    },
    backButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.captionBold.fontWeight,
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
    unitSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    unitGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    unitButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginBottom: 8, // 8px margin bottom
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    unitButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    unitButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    unitButtonTextSelected: {
      color: colors.text,
    },
    resultSection: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      ...Shadows.sm,
    },
    resultText: {
      color: colors.primary,
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
  });

  const handleFromUnitSelect = (unitName: string) => {
    setFromUnit(unitName);
  };

  const handleToUnitSelect = (unitName: string) => {
    setToUnit(unitName);
  };

  const getResult = () => {
    if (!inputValue || isNaN(Number(inputValue))) return '0';
    const value = Number(inputValue);
    const result = convertLength(value, fromUnit, toUnit);
    return result.toFixed(6);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Length Converter</Text>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>From Unit</Text>
          <View style={styles.unitGrid}>
            {lengthUnits.map((unit, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.unitButton,
                  fromUnit === unit.name && styles.unitButtonSelected
                ]}
                onPress={() => handleFromUnitSelect(unit.name)}
              >
                <Text style={[
                  styles.unitButtonText,
                  fromUnit === unit.name && styles.unitButtonTextSelected
                ]}>
                  {unit.name} ({unit.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Length Value</Text>
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter value"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>To Unit</Text>
          <View style={styles.unitGrid}>
            {lengthUnits.map((unit, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.unitButton,
                  toUnit === unit.name && styles.unitButtonSelected
                ]}
                onPress={() => handleToUnitSelect(unit.name)}
              >
                <Text style={[
                  styles.unitButtonText,
                  toUnit === unit.name && styles.unitButtonTextSelected
                ]}>
                  {unit.name} ({unit.symbol})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.inputLabel}>Result</Text>
          <Text style={styles.resultText}>{getResult()} {lengthUnits.find(u => u.name === toUnit)?.symbol}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
