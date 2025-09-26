import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const CompoundInterestCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [compoundingFrequency, setCompoundingFrequency] = useState('12'); // Monthly
  const [additionalContribution, setAdditionalContribution] = useState('0');
  const [contributionFrequency, setContributionFrequency] = useState('12'); // Monthly

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convert percentage to decimal
    const t = parseFloat(time);
    const n = parseFloat(compoundingFrequency);
    const pmt = parseFloat(additionalContribution);
    const pmtFreq = parseFloat(contributionFrequency);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n) || isNaN(pmt) || isNaN(pmtFreq)) {
      Alert.alert('Error', 'Please enter valid numeric values');
      return;
    }

    if (p <= 0 || r < 0 || t <= 0 || n <= 0) {
      Alert.alert('Error', 'Principal, rate, time, and compounding frequency must be positive');
      return;
    }

    // Calculate compound interest with additional contributions
    const totalPeriods = t * n;
    const periodicRate = r / n;
    
    // Future value of principal
    const futureValuePrincipal = p * Math.pow(1 + periodicRate, totalPeriods);
    
    // Future value of additional contributions (annuity)
    let futureValueContributions = 0;
    if (pmt > 0) {
      const contributionPeriods = totalPeriods;
      const contributionRate = periodicRate;
      futureValueContributions = pmt * ((Math.pow(1 + contributionRate, contributionPeriods) - 1) / contributionRate);
    }
    
    const totalFutureValue = futureValuePrincipal + futureValueContributions;
    const totalContributions = p + (pmt * totalPeriods);
    const totalInterest = totalFutureValue - totalContributions;

    Alert.alert(
      'Compound Interest Calculation',
      `Principal: $${p.toLocaleString()}\n` +
      `Additional Contributions: $${pmt.toLocaleString()} ${getFrequencyText(pmtFreq)}\n` +
      `Interest Rate: ${rate}% annually\n` +
      `Time Period: ${t} years\n` +
      `Compounding: ${getFrequencyText(n)} times per year\n\n` +
      `Total Contributions: $${totalContributions.toLocaleString()}\n` +
      `Total Interest Earned: $${totalInterest.toLocaleString()}\n` +
      `Final Amount: $${totalFutureValue.toLocaleString()}\n\n` +
      `Return on Investment: ${((totalInterest / totalContributions) * 100).toFixed(2)}%`
    );
  };

  const getFrequencyText = (freq: number): string => {
    switch (freq) {
      case 1: return 'annually';
      case 2: return 'semi-annually';
      case 4: return 'quarterly';
      case 12: return 'monthly';
      case 52: return 'weekly';
      case 365: return 'daily';
      default: return 'times per year';
    }
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
    frequencyContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.sm,
    },
    frequencyButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      marginHorizontal: 2,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    frequencyButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    frequencyButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    frequencyButtonTextActive: {
      color: colors.text,
      fontWeight: '600',
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
  });

  const compoundingFrequencies = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '52', label: 'Weekly' },
    { value: '365', label: 'Daily' },
  ];

  const contributionFrequencies = [
    { value: '1', label: 'Annually' },
    { value: '2', label: 'Semi-annually' },
    { value: '4', label: 'Quarterly' },
    { value: '12', label: 'Monthly' },
    { value: '52', label: 'Weekly' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <Text style={styles.inputLabel}>Principal Amount ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={principal}
              onChangeText={setPrincipal}
              placeholder="10000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Annual Interest Rate (%)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={rate}
              onChangeText={setRate}
              placeholder="5.0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Time Period (years)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="10"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compounding Frequency</Text>
          <View style={styles.frequencyContainer}>
            {compoundingFrequencies.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                style={[
                  styles.frequencyButton,
                  compoundingFrequency === freq.value && styles.frequencyButtonActive
                ]}
                onPress={() => setCompoundingFrequency(freq.value)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  compoundingFrequency === freq.value && styles.frequencyButtonTextActive
                ]}>
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Contributions</Text>
          
          <Text style={styles.inputLabel}>Contribution Amount ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={additionalContribution}
              onChangeText={setAdditionalContribution}
              placeholder="500"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Contribution Frequency</Text>
          <View style={styles.frequencyContainer}>
            {contributionFrequencies.map((freq) => (
              <TouchableOpacity
                key={freq.value}
                style={[
                  styles.frequencyButton,
                  contributionFrequency === freq.value && styles.frequencyButtonActive
                ]}
                onPress={() => setContributionFrequency(freq.value)}
              >
                <Text style={[
                  styles.frequencyButtonText,
                  contributionFrequency === freq.value && styles.frequencyButtonTextActive
                ]}>
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={[styles.button, { marginBottom: 65 }]} onPress={calculateCompoundInterest}>
          <Text style={styles.buttonText}>Calculate Compound Interest</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Financial</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
