import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const AreaConverter: React.FC = () => {
  const { colors } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('Square Meters');
  const [toUnit, setToUnit] = useState('Square Feet');

  const areaUnits = [
    { name: 'Square Millimeters', symbol: 'mm²', factor: 1000000 },
    { name: 'Square Centimeters', symbol: 'cm²', factor: 10000 },
    { name: 'Square Meters', symbol: 'm²', factor: 1 },
    { name: 'Square Kilometers', symbol: 'km²', factor: 0.000001 },
    { name: 'Square Inches', symbol: 'in²', factor: 1550.003 },
    { name: 'Square Feet', symbol: 'ft²', factor: 10.7639 },
    { name: 'Square Yards', symbol: 'yd²', factor: 1.19599 },
    { name: 'Acres', symbol: 'ac', factor: 0.000247105 },
    { name: 'Hectares', symbol: 'ha', factor: 0.0001 },
  ];

  const convertArea = (value: number, fromUnitName: string, toUnitName: string) => {
    const fromFactor = areaUnits.find(unit => unit.name === fromUnitName)?.factor || 1;
    const toFactor = areaUnits.find(unit => unit.name === toUnitName)?.factor || 1;
    return (value / fromFactor) * toFactor;
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
    const result = convertArea(value, fromUnit, toUnit);
    return result.toFixed(6);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>From Unit</Text>
          <View style={styles.unitGrid}>
            {areaUnits.map((unit, index) => (
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
          <Text style={styles.inputLabel}>Enter Area Value</Text>
          <TextInput
            style={styles.inputField}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Enter area"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>To Unit</Text>
          <View style={styles.unitGrid}>
            {areaUnits.map((unit, index) => (
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

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.inputLabel}>Result</Text>
          <Text style={styles.resultText}>{getResult()} {areaUnits.find(u => u.name === toUnit)?.symbol}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
