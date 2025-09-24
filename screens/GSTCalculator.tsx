import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const GSTCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [gstRate, setGstRate] = useState('18'); // Default 18% GST

  const calculateGST = () => {
    if (!amount || isNaN(Number(amount))) {
      return { gstAmount: '0', totalAmount: '0', baseAmount: '0' };
    }
    
    const baseAmount = Number(amount);
    const rate = Number(gstRate) / 100;
    const gstAmount = baseAmount * rate;
    const totalAmount = baseAmount + gstAmount;
    
    return {
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      baseAmount: baseAmount.toFixed(2),
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
    rateSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    rateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    rateButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginBottom: 8, // 8px margin bottom
      width: '30%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    rateButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    rateButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    rateButtonTextSelected: {
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

  const gstRates = ['5', '12', '18', '28'];
  const results = calculateGST();

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>GST Calculator</Text>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
          <TextInput
            style={styles.inputField}
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.rateSelector}>
          <Text style={styles.inputLabel}>GST Rate (%)</Text>
          <View style={styles.rateGrid}>
            {gstRates.map((rate, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.rateButton,
                  gstRate === rate && styles.rateButtonSelected
                ]}
                onPress={() => setGstRate(rate)}
              >
                <Text style={[
                  styles.rateButtonText,
                  gstRate === rate && styles.rateButtonTextSelected
                ]}>
                  {rate}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Base Amount</Text>
          <Text style={styles.resultText}>₹{results.baseAmount}</Text>
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>GST Amount ({gstRate}%)</Text>
          <Text style={styles.resultText}>₹{results.gstAmount}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.resultLabel}>Total Amount</Text>
          <Text style={styles.resultText}>₹{results.totalAmount}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
