import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const BMIConverter: React.FC = () => {
  const { colors } = useTheme();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [heightUnit, setHeightUnit] = useState('m');

  const calculateBMI = () => {
    if (!weight || !height || isNaN(Number(weight)) || isNaN(Number(height))) return '0';
    
    let weightKg = Number(weight);
    let heightM = Number(height);
    
    // Convert weight to kg
    if (weightUnit === 'lbs') {
      weightKg = weightKg * 0.453592;
    }
    
    // Convert height to meters
    if (heightUnit === 'ft') {
      heightM = heightM * 0.3048;
    } else if (heightUnit === 'cm') {
      heightM = heightM / 100;
    }
    
    const bmi = weightKg / (heightM * heightM);
    return bmi.toFixed(2);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
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
    categoryText: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      textAlign: 'center',
      marginTop: 8, // 8px margin top
    },
  });

  const bmi = calculateBMI();
  const category = getBMICategory(Number(bmi));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Weight</Text>
          <TextInput
            style={styles.inputField}
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>Weight Unit</Text>
          <View style={styles.unitGrid}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === 'kg' && styles.unitButtonSelected
              ]}
              onPress={() => setWeightUnit('kg')}
            >
              <Text style={[
                styles.unitButtonText,
                weightUnit === 'kg' && styles.unitButtonTextSelected
              ]}>
                Kilograms (kg)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                weightUnit === 'lbs' && styles.unitButtonSelected
              ]}
              onPress={() => setWeightUnit('lbs')}
            >
              <Text style={[
                styles.unitButtonText,
                weightUnit === 'lbs' && styles.unitButtonTextSelected
              ]}>
                Pounds (lbs)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Height</Text>
          <TextInput
            style={styles.inputField}
            value={height}
            onChangeText={setHeight}
            placeholder="Enter height"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>Height Unit</Text>
          <View style={styles.unitGrid}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                heightUnit === 'm' && styles.unitButtonSelected
              ]}
              onPress={() => setHeightUnit('m')}
            >
              <Text style={[
                styles.unitButtonText,
                heightUnit === 'm' && styles.unitButtonTextSelected
              ]}>
                Meters (m)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                heightUnit === 'cm' && styles.unitButtonSelected
              ]}
              onPress={() => setHeightUnit('cm')}
            >
              <Text style={[
                styles.unitButtonText,
                heightUnit === 'cm' && styles.unitButtonTextSelected
              ]}>
                Centimeters (cm)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                heightUnit === 'ft' && styles.unitButtonSelected
              ]}
              onPress={() => setHeightUnit('ft')}
            >
              <Text style={[
                styles.unitButtonText,
                heightUnit === 'ft' && styles.unitButtonTextSelected
              ]}>
                Feet (ft)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.inputLabel}>BMI Result</Text>
          <Text style={styles.resultText}>{bmi}</Text>
          <Text style={styles.categoryText}>Category: {category}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
