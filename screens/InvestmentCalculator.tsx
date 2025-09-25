import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const InvestmentCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [principal, setPrincipal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [investmentTerm, setInvestmentTerm] = useState('');
  const [termUnit, setTermUnit] = useState('years');

  const calculateInvestment = () => {
    if (!principal || !monthlyContribution || !interestRate || !investmentTerm ||
        isNaN(Number(principal)) || isNaN(Number(monthlyContribution)) || 
        isNaN(Number(interestRate)) || isNaN(Number(investmentTerm))) {
      return { totalValue: '0', totalInvested: '0', totalGains: '0' };
    }
    
    const P = Number(principal);
    const PMT = Number(monthlyContribution);
    const r = Number(interestRate) / 100 / 12; // Monthly interest rate
    const n = termUnit === 'years' ? Number(investmentTerm) * 12 : Number(investmentTerm); // Total months
    
    // Future value of lump sum
    const futureValueLumpSum = P * Math.pow(1 + r, n);
    
    // Future value of monthly contributions
    const futureValueAnnuity = PMT * ((Math.pow(1 + r, n) - 1) / r);
    
    const totalValue = futureValueLumpSum + futureValueAnnuity;
    const totalInvested = P + (PMT * n);
    const totalGains = totalValue - totalInvested;
    
    return {
      totalValue: totalValue.toFixed(2),
      totalInvested: totalInvested.toFixed(2),
      totalGains: totalGains.toFixed(2),
    };
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    calculatorContainer: {
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
    termSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    termGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    termButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 12, // 12px padding
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    termButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    termButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    termButtonTextSelected: {
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

  const results = calculateInvestment();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Initial Investment (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={principal}
            onChangeText={setPrincipal}
            placeholder="Enter initial amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Monthly Contribution (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={monthlyContribution}
            onChangeText={setMonthlyContribution}
            placeholder="Enter monthly contribution"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Expected Annual Return (%)</Text>
          <TextInput
            style={styles.inputField}
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="Enter expected return"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Investment Period</Text>
          <TextInput
            style={styles.inputField}
            value={investmentTerm}
            onChangeText={setInvestmentTerm}
            placeholder="Enter investment period"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.termSelector}>
          <Text style={styles.inputLabel}>Period Unit</Text>
          <View style={styles.termGrid}>
            <TouchableOpacity
              style={[
                styles.termButton,
                termUnit === 'years' && styles.termButtonSelected
              ]}
              onPress={() => setTermUnit('years')}
            >
              <Text style={[
                styles.termButtonText,
                termUnit === 'years' && styles.termButtonTextSelected
              ]}>
                Years
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.termButton,
                termUnit === 'months' && styles.termButtonSelected
              ]}
              onPress={() => setTermUnit('months')}
            >
              <Text style={[
                styles.termButtonText,
                termUnit === 'months' && styles.termButtonTextSelected
              ]}>
                Months
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Total Investment Value</Text>
          <Text style={styles.resultText}>₹{results.totalValue}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Total Amount Invested</Text>
          <Text style={styles.resultText}>₹{results.totalInvested}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.resultLabel}>Total Gains</Text>
          <Text style={styles.resultText}>₹{results.totalGains}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
