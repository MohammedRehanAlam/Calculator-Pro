import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const RetirementPlanningCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [inflationRate, setInflationRate] = useState('3');
  const [retirementIncome, setRetirementIncome] = useState('');

  const calculateRetirement = () => {
    const age = parseFloat(currentAge);
    const retireAge = parseFloat(retirementAge);
    const savings = parseFloat(currentSavings);
    const monthly = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn) / 100;
    const inflation = parseFloat(inflationRate) / 100;
    const income = parseFloat(retirementIncome);

    if (isNaN(age) || isNaN(retireAge) || isNaN(savings) || isNaN(monthly) || 
        isNaN(returnRate) || isNaN(inflation) || isNaN(income)) {
      Alert.alert('Error', 'Please enter valid numeric values');
      return;
    }

    if (age >= retireAge) {
      Alert.alert('Error', 'Retirement age must be greater than current age');
      return;
    }

    const yearsToRetirement = retireAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturnRate = returnRate / 12;

    // Calculate future value of current savings
    const futureValueCurrentSavings = savings * Math.pow(1 + returnRate, yearsToRetirement);

    // Calculate future value of monthly contributions (annuity)
    const futureValueContributions = monthly * ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate);

    // Total retirement savings
    const totalRetirementSavings = futureValueCurrentSavings + futureValueContributions;

    // Calculate required retirement savings (4% rule)
    const requiredSavings = income * 25; // 4% withdrawal rate

    // Calculate shortfall or surplus
    const shortfall = Math.max(0, requiredSavings - totalRetirementSavings);
    const surplus = Math.max(0, totalRetirementSavings - requiredSavings);

    // Calculate required monthly contribution to meet goal
    const requiredMonthlyContribution = shortfall > 0 ? 
      shortfall / ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate) : 0;

    // Calculate retirement income from current plan
    const projectedRetirementIncome = totalRetirementSavings / 25;

    Alert.alert(
      'Retirement Planning Analysis',
      `Current Age: ${age} years\n` +
      `Retirement Age: ${retireAge} years\n` +
      `Years to Retirement: ${yearsToRetirement} years\n\n` +
      `Current Savings: $${savings.toLocaleString()}\n` +
      `Monthly Contribution: $${monthly.toLocaleString()}\n` +
      `Annual Return: ${(returnRate * 100).toFixed(1)}%\n\n` +
      `Projected Retirement Savings: $${totalRetirementSavings.toLocaleString()}\n` +
      `Required Retirement Savings: $${requiredSavings.toLocaleString()}\n\n` +
      `Projected Retirement Income: $${projectedRetirementIncome.toLocaleString()}/year\n` +
      `Target Retirement Income: $${income.toLocaleString()}/year\n\n` +
      `${shortfall > 0 ? 
        `Shortfall: $${shortfall.toLocaleString()}\n` +
        `Required Monthly Contribution: $${requiredMonthlyContribution.toLocaleString()}` :
        `Surplus: $${surplus.toLocaleString()}\n` +
        `You're on track for retirement!`
      }`
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
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <Text style={styles.inputLabel}>Current Age (years)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentAge}
              onChangeText={setCurrentAge}
              placeholder="30"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Retirement Age (years)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={retirementAge}
              onChangeText={setRetirementAge}
              placeholder="65"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Savings</Text>
          
          <Text style={styles.inputLabel}>Current Retirement Savings ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={currentSavings}
              onChangeText={setCurrentSavings}
              placeholder="50000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Monthly Contribution ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={monthlyContribution}
              onChangeText={setMonthlyContribution}
              placeholder="1000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Assumptions</Text>
          
          <Text style={styles.inputLabel}>Expected Annual Return (%)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={annualReturn}
              onChangeText={setAnnualReturn}
              placeholder="7.0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Inflation Rate (%)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inflationRate}
              onChangeText={setInflationRate}
              placeholder="3.0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Retirement Goals</Text>
          
          <Text style={styles.inputLabel}>Desired Annual Retirement Income ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={retirementIncome}
              onChangeText={setRetirementIncome}
              placeholder="80000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helpText}>
            Based on the 4% withdrawal rule, you'll need 25x your desired annual income in retirement savings.
          </Text>
        </View>

        <TouchableOpacity style={[styles.button, { marginBottom: 65 }]} onPress={calculateRetirement}>
          <Text style={styles.buttonText}>Calculate Retirement Plan</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Financial</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
