import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

export const MortgageCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [homePrice, setHomePrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('30');

  const calculateMortgage = () => {
    if (!homePrice || !downPayment || !interestRate || !loanTerm ||
        isNaN(Number(homePrice)) || isNaN(Number(downPayment)) || 
        isNaN(Number(interestRate)) || isNaN(Number(loanTerm))) {
      return { 
        loanAmount: '0', 
        monthlyPayment: '0', 
        totalPayment: '0', 
        totalInterest: '0' 
      };
    }
    
    const homePriceValue = Number(homePrice);
    const downPaymentValue = Number(downPayment);
    const loanAmount = homePriceValue - downPaymentValue;
    const r = Number(interestRate) / 100 / 12; // Monthly interest rate
    const n = Number(loanTerm) * 12; // Total months
    
    const monthlyPayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - loanAmount;
    
    return {
      loanAmount: loanAmount.toFixed(2),
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
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
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    termButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginBottom: 8, // 8px margin bottom
      width: '30%',
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

  const loanTerms = ['15', '20', '25', '30'];
  const results = calculateMortgage();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Home Price (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={homePrice}
            onChangeText={setHomePrice}
            placeholder="Enter home price"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Down Payment (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={downPayment}
            onChangeText={setDownPayment}
            placeholder="Enter down payment"
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

        <View style={styles.termSelector}>
          <Text style={styles.inputLabel}>Loan Term (Years)</Text>
          <View style={styles.termGrid}>
            {loanTerms.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.termButton,
                  loanTerm === term && styles.termButtonSelected
                ]}
                onPress={() => setLoanTerm(term)}
              >
                <Text style={[
                  styles.termButtonText,
                  loanTerm === term && styles.termButtonTextSelected
                ]}>
                  {term} years
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Loan Amount</Text>
          <Text style={styles.resultText}>₹{results.loanAmount}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Monthly Payment</Text>
          <Text style={styles.resultText}>₹{results.monthlyPayment}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Total Payment</Text>
          <Text style={styles.resultText}>₹{results.totalPayment}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.resultLabel}>Total Interest</Text>
          <Text style={styles.resultText}>₹{results.totalInterest}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
