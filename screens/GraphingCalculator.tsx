import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const GraphingCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [functionInput, setFunctionInput] = useState('');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [yMin, setYMin] = useState('-10');
  const [yMax, setYMax] = useState('10');

  const evaluateFunction = (func: string, x: number): number => {
    try {
      // Replace x with the actual value
      let expression = func.replace(/x/g, x.toString());
      
      // Handle common mathematical functions
      expression = expression.replace(/sin\(/g, 'Math.sin(');
      expression = expression.replace(/cos\(/g, 'Math.cos(');
      expression = expression.replace(/tan\(/g, 'Math.tan(');
      expression = expression.replace(/log\(/g, 'Math.log(');
      expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
      expression = expression.replace(/pow\(/g, 'Math.pow(');
      expression = expression.replace(/abs\(/g, 'Math.abs(');
      expression = expression.replace(/exp\(/g, 'Math.exp(');
      
      // Handle power operator
      expression = expression.replace(/\^/g, '**');
      
      // Evaluate the expression
      return eval(expression);
    } catch (error) {
      return NaN;
    }
  };

  const generateGraphData = () => {
    if (!functionInput.trim()) {
      Alert.alert('Error', 'Please enter a function');
      return;
    }

    const xMinNum = parseFloat(xMin);
    const xMaxNum = parseFloat(xMax);
    const yMinNum = parseFloat(yMin);
    const yMaxNum = parseFloat(yMax);

    if (isNaN(xMinNum) || isNaN(xMaxNum) || isNaN(yMinNum) || isNaN(yMaxNum)) {
      Alert.alert('Error', 'Please enter valid numeric values for the range');
      return;
    }

    if (xMinNum >= xMaxNum || yMinNum >= yMaxNum) {
      Alert.alert('Error', 'Invalid range values');
      return;
    }

    const points = [];
    const step = (xMaxNum - xMinNum) / 100;

    for (let x = xMinNum; x <= xMaxNum; x += step) {
      const y = evaluateFunction(functionInput, x);
      if (!isNaN(y) && isFinite(y) && y >= yMinNum && y <= yMaxNum) {
        points.push({ x, y });
      }
    }

    if (points.length === 0) {
      Alert.alert('No Data', 'No valid points found in the specified range');
      return;
    }

    Alert.alert(
      'Graph Data Generated',
      `Generated ${points.length} points for function: ${functionInput}\n\nRange: x[${xMin}, ${xMax}], y[${yMin}, ${yMax}]\n\nFirst few points:\n${points.slice(0, 5).map(p => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join('\n')}${points.length > 5 ? '\n...' : ''}`
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    calculatorContainer: {
      flex: 1,
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 16,
    },
    section: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: '600',
      marginBottom: Spacing.md,
    },
    inputLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    inputContainer: {
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: Spacing.sm,
    },
    input: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
    },
    rangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rangeInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 4,
      textAlign: 'center',
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    buttonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
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
    helpText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      lineHeight: Typography.caption.lineHeight,
      marginTop: Spacing.sm,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Function Input</Text>
          <Text style={styles.inputLabel}>Enter Function (use 'x' as variable)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={functionInput}
              onChangeText={setFunctionInput}
              placeholder="e.g., x^2, sin(x), x^2 + 2*x + 1"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <Text style={styles.helpText}>
            Supported functions: sin, cos, tan, log, sqrt, pow, abs, exp{'\n'}
            Use ^ for power (e.g., x^2) or ** (e.g., x**2)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>X Range</Text>
          <View style={styles.rangeContainer}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMin}
                onChangeText={setXMin}
                placeholder="-10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMax}
                onChangeText={setXMax}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Y Range</Text>
          <View style={styles.rangeContainer}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMin}
                onChangeText={setYMin}
                placeholder="-10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMax}
                onChangeText={setYMax}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={[styles.button, { marginBottom: 65 }]} onPress={generateGraphData}>
          <Text style={styles.buttonText}>Generate Graph Data</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Converter</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
