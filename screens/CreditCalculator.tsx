import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const CreditCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [creditLimit, setCreditLimit] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [minimumPayment, setMinimumPayment] = useState('');

  const calculateCredit = () => {
    if (!creditLimit || !currentBalance || !interestRate || !minimumPayment ||
        isNaN(Number(creditLimit)) || isNaN(Number(currentBalance)) || 
        isNaN(Number(interestRate)) || isNaN(Number(minimumPayment))) {
      return { 
        availableCredit: '0', 
        utilizationRate: '0', 
        monthlyInterest: '0',
        payOffTime: '0'
      };
    }
    
    const limit = Number(creditLimit);
    const balance = Number(currentBalance);
    const rate = Number(interestRate) / 100 / 12; // Monthly interest rate
    const minPayment = Number(minimumPayment);
    
    const availableCredit = limit - balance;
    const utilizationRate = (balance / limit) * 100;
    const monthlyInterest = balance * rate;
    
    // Calculate pay-off time (simplified)
    let remainingBalance = balance;
    let months = 0;
    while (remainingBalance > 0 && months < 120) { // Max 10 years
      const interest = remainingBalance * rate;
      const principalPayment = Math.max(minPayment - interest, remainingBalance * 0.01); // At least 1% of balance
      remainingBalance -= principalPayment;
      months++;
    }
    
    return {
      availableCredit: availableCredit.toFixed(2),
      utilizationRate: utilizationRate.toFixed(1),
      monthlyInterest: monthlyInterest.toFixed(2),
      payOffTime: months.toString(),
    };
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
    warningSection: {
      backgroundColor: colors.warning + '20',
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      borderLeftWidth: 4, // 4px left border
      borderLeftColor: colors.warning,
    },
    warningText: {
      color: colors.warning,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
  });

  const results = calculateCredit();
  const utilizationRate = Number(results.utilizationRate);

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Credit Calculator</Text>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Credit Limit (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={creditLimit}
            onChangeText={setCreditLimit}
            placeholder="Enter credit limit"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Current Balance (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={currentBalance}
            onChangeText={setCurrentBalance}
            placeholder="Enter current balance"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Interest Rate (% per year)</Text>
          <TextInput
            style={styles.inputField}
            value={interestRate}
            onChangeText={setInterestRate}
            placeholder="Enter interest rate"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Minimum Payment (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={minimumPayment}
            onChangeText={setMinimumPayment}
            placeholder="Enter minimum payment"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        {utilizationRate > 30 && (
          <View style={styles.warningSection}>
            <Text style={styles.warningText}>
              ⚠️ High credit utilization ({utilizationRate}%). Consider paying down your balance to improve your credit score.
            </Text>
          </View>
        )}

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Available Credit</Text>
          <Text style={styles.resultText}>₹{results.availableCredit}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Credit Utilization Rate</Text>
          <Text style={styles.resultText}>{results.utilizationRate}%</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Monthly Interest</Text>
          <Text style={styles.resultText}>₹{results.monthlyInterest}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.resultLabel}>Pay-off Time (Months)</Text>
          <Text style={styles.resultText}>{results.payOffTime}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
