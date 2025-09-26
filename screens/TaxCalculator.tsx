import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

export const TaxCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [grossIncome, setGrossIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [deductions, setDeductions] = useState('');
  const [exemptions, setExemptions] = useState('1');
  const [country, setCountry] = useState('IN');
  const [stateTaxRate, setStateTaxRate] = useState('9.3');
  
  // Tax bracket inputs
  const [taxBracket1, setTaxBracket1] = useState({ min: '', max: '', rate: '' });
  const [taxBracket2, setTaxBracket2] = useState({ min: '', max: '', rate: '' });
  const [taxBracket3, setTaxBracket3] = useState({ min: '', max: '', rate: '' });
  const [taxBracket4, setTaxBracket4] = useState({ min: '', max: '', rate: '' });
  const [taxBracket5, setTaxBracket5] = useState({ min: '', max: '', rate: '' });
  const [taxBracket6, setTaxBracket6] = useState({ min: '', max: '', rate: '' });

  // Function to get user-defined tax brackets
  const getUserTaxBrackets = () => {
    const brackets = [];
    
    if (taxBracket1.min && taxBracket1.max && taxBracket1.rate) {
      brackets.push({
        min: parseFloat(taxBracket1.min),
        max: parseFloat(taxBracket1.max),
        rate: parseFloat(taxBracket1.rate) / 100
      });
    }
    
    if (taxBracket2.min && taxBracket2.max && taxBracket2.rate) {
      brackets.push({
        min: parseFloat(taxBracket2.min),
        max: parseFloat(taxBracket2.max),
        rate: parseFloat(taxBracket2.rate) / 100
      });
    }
    
    if (taxBracket3.min && taxBracket3.max && taxBracket3.rate) {
      brackets.push({
        min: parseFloat(taxBracket3.min),
        max: parseFloat(taxBracket3.max),
        rate: parseFloat(taxBracket3.rate) / 100
      });
    }
    
    if (taxBracket4.min && taxBracket4.max && taxBracket4.rate) {
      brackets.push({
        min: parseFloat(taxBracket4.min),
        max: parseFloat(taxBracket4.max),
        rate: parseFloat(taxBracket4.rate) / 100
      });
    }
    
    if (taxBracket5.min && taxBracket5.max && taxBracket5.rate) {
      brackets.push({
        min: parseFloat(taxBracket5.min),
        max: parseFloat(taxBracket5.max),
        rate: parseFloat(taxBracket5.rate) / 100
      });
    }
    
    if (taxBracket6.min && taxBracket6.max && taxBracket6.rate) {
      brackets.push({
        min: parseFloat(taxBracket6.min),
        max: parseFloat(taxBracket6.max),
        rate: parseFloat(taxBracket6.rate) / 100
      });
    }
    
    return brackets;
  };

  const countryInfo = {
    US: { name: 'United States', currency: 'USD', symbol: '$' },
    IN: { name: 'India', currency: 'INR', symbol: '₹' },
    CA: { name: 'Canada', currency: 'CAD', symbol: 'C$' },
    UK: { name: 'United Kingdom', currency: 'GBP', symbol: '£' },
    AU: { name: 'Australia', currency: 'AUD', symbol: 'A$' },
    DE: { name: 'Germany', currency: 'EUR', symbol: '€' },
    FR: { name: 'France', currency: 'EUR', symbol: '€' },
    IT: { name: 'Italy', currency: 'EUR', symbol: '€' },
    JP: { name: 'Japan', currency: 'JPY', symbol: '¥' },
    NL: { name: 'Netherlands', currency: 'EUR', symbol: '€' },
    SE: { name: 'Sweden', currency: 'SEK', symbol: 'kr' },
    NO: { name: 'Norway', currency: 'NOK', symbol: 'kr' },
    DK: { name: 'Denmark', currency: 'DKK', symbol: 'kr' },
    FI: { name: 'Finland', currency: 'EUR', symbol: '€' },
    CH: { name: 'Switzerland', currency: 'CHF', symbol: 'CHF' },
    AT: { name: 'Austria', currency: 'EUR', symbol: '€' },
    BE: { name: 'Belgium', currency: 'EUR', symbol: '€' },
    ES: { name: 'Spain', currency: 'EUR', symbol: '€' },
    PT: { name: 'Portugal', currency: 'EUR', symbol: '€' },
    BR: { name: 'Brazil', currency: 'BRL', symbol: 'R$' },
    ZA: { name: 'South Africa', currency: 'ZAR', symbol: 'R' }
  };

  const calculateTax = () => {
    const income = parseFloat(grossIncome);
    const deduction = parseFloat(deductions);
    const exemption = parseFloat(exemptions);
    const stateRate = parseFloat(stateTaxRate) / 100;

    if (isNaN(income) || isNaN(deduction) || isNaN(exemption) || isNaN(stateRate)) {
      Alert.alert('Error', 'Please enter valid numeric values');
      return;
    }

    if (income <= 0) {
      Alert.alert('Error', 'Income must be positive');
      return;
    }

    // Get user-defined tax brackets
    const brackets = getUserTaxBrackets();
    
    if (brackets.length === 0) {
      Alert.alert('Error', 'Please enter at least one tax bracket');
      return;
    }

    const currentCountry = countryInfo[country as keyof typeof countryInfo];
    const currencySymbol = currentCountry.symbol;

    // Calculate taxable income
    let standardDeduction = 0;
    let taxableIncome = income;

    if (country === 'US') {
      standardDeduction = filingStatus === 'single' ? 13850 : 27700;
      const totalDeductions = Math.max(deduction, standardDeduction);
      taxableIncome = Math.max(0, income - totalDeductions);
    } else {
      // For other countries, use simple deduction
      taxableIncome = Math.max(0, income - deduction);
    }

    // Calculate tax using user-defined brackets
    let federalTax = 0;
    let remainingIncome = taxableIncome;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const bracketMax = bracket.max === Infinity ? remainingIncome : bracket.max;
      const taxableInBracket = Math.min(remainingIncome, bracketMax - bracket.min);
      
      if (taxableInBracket > 0) {
        federalTax += taxableInBracket * bracket.rate;
        remainingIncome -= taxableInBracket;
      }
    }

    // Calculate state/provincial tax (only for US and Canada)
    let stateTax = 0;
    if (country === 'US' || country === 'CA') {
      stateTax = taxableIncome * stateRate;
    }

    // Calculate total tax
    const totalTax = federalTax + stateTax;

    // Calculate effective tax rate
    const effectiveTaxRate = (totalTax / income) * 100;

    // Calculate take-home pay
    const takeHomePay = income - totalTax;

    const taxType = country === 'US' ? 'Federal' : 'National';
    const stateTaxType = country === 'US' ? 'State' : country === 'CA' ? 'Provincial' : '';

    Alert.alert(
      'Tax Calculation Results',
      `Country: ${currentCountry.name}\n` +
      `Gross Income: ${currencySymbol}${income.toLocaleString()}\n` +
      `Filing Status: ${filingStatus === 'single' ? 'Single' : 'Married Filing Jointly'}\n` +
      `${country === 'US' ? `Standard Deduction: ${currencySymbol}${standardDeduction.toLocaleString()}\n` : ''}` +
      `Itemized Deductions: ${currencySymbol}${deduction.toLocaleString()}\n` +
      `Taxable Income: ${currencySymbol}${taxableIncome.toLocaleString()}\n\n` +
      `${taxType} Tax: ${currencySymbol}${federalTax.toLocaleString()}\n` +
      `${stateTaxType ? `${stateTaxType} Tax (${stateRate * 100}%): ${currencySymbol}${stateTax.toLocaleString()}\n` : ''}` +
      `Total Tax: ${currencySymbol}${totalTax.toLocaleString()}\n\n` +
      `Effective Tax Rate: ${effectiveTaxRate.toFixed(2)}%\n` +
      `Take-Home Pay: ${currencySymbol}${takeHomePay.toLocaleString()}\n` +
      `Monthly Take-Home: ${currencySymbol}${(takeHomePay / 12).toLocaleString()}`
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
    statusContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.sm,
    },
    statusButton: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    statusButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    statusButtonTextActive: {
      color: colors.text,
      fontWeight: '600',
    },
    countryScrollContainer: {
      marginVertical: 8,
    },
    countryScrollContent: {
      paddingHorizontal: 4,
      gap: 8,
    },
    countryButton: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      minWidth: 120,
      alignItems: 'center',
    },
    countryButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    countryButtonText: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
      textAlign: 'center',
    },
    countryButtonTextActive: {
      color: colors.background,
    },
    bracketContainer: {
      marginBottom: 16,
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bracketTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    bracketRow: {
      flexDirection: 'row',
      gap: 8,
    },
    bracketInput: {
      flex: 1,
    },
    bracketLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    bracketTextInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 6,
      padding: 8,
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.background,
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
          <Text style={styles.sectionTitle}>Income Information</Text>
          
          <Text style={styles.inputLabel}>Gross Annual Income ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={grossIncome}
              onChangeText={setGrossIncome}
              placeholder="75000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Filing Status</Text>
          <View style={styles.statusContainer}>
            <TouchableOpacity
              style={[
                styles.statusButton,
                filingStatus === 'single' && styles.statusButtonActive
              ]}
              onPress={() => setFilingStatus('single')}
            >
              <Text style={[
                styles.statusButtonText,
                filingStatus === 'single' && styles.statusButtonTextActive
              ]}>
                Single
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.statusButton,
                filingStatus === 'married' && styles.statusButtonActive
              ]}
              onPress={() => setFilingStatus('married')}
            >
              <Text style={[
                styles.statusButtonText,
                filingStatus === 'married' && styles.statusButtonTextActive
              ]}>
                Married
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deductions & Exemptions</Text>
          
          <Text style={styles.inputLabel}>Itemized Deductions ($)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={deductions}
              onChangeText={setDeductions}
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.inputLabel}>Number of Exemptions</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={exemptions}
              onChangeText={setExemptions}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
          <Text style={styles.helpText}>
            Standard deduction will be used if it&apos;s higher than itemized deductions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Country Selection</Text>
          
          <Text style={styles.inputLabel}>Country</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.countryScrollContainer}
            contentContainerStyle={styles.countryScrollContent}
          >
            {Object.entries(countryInfo).map(([code, info]) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.countryButton,
                  country === code && styles.countryButtonActive
                ]}
                onPress={() => setCountry(code)}
              >
                <Text style={[
                  styles.countryButtonText,
                  country === code && styles.countryButtonTextActive
                ]}>
                  {info.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.helpText}>
            Selected: {countryInfo[country as keyof typeof countryInfo].name}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tax Brackets Configuration</Text>
          <Text style={styles.helpText}>
            Enter the tax brackets for {countryInfo[country as keyof typeof countryInfo].name}. Leave fields empty if not applicable.
          </Text>
          
          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 1</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket1.min}
                  onChangeText={(text) => setTaxBracket1({...taxBracket1, min: text})}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket1.max}
                  onChangeText={(text) => setTaxBracket1({...taxBracket1, max: text})}
                  placeholder="300000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket1.rate}
                  onChangeText={(text) => setTaxBracket1({...taxBracket1, rate: text})}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 2</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket2.min}
                  onChangeText={(text) => setTaxBracket2({...taxBracket2, min: text})}
                  placeholder="300000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket2.max}
                  onChangeText={(text) => setTaxBracket2({...taxBracket2, max: text})}
                  placeholder="600000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket2.rate}
                  onChangeText={(text) => setTaxBracket2({...taxBracket2, rate: text})}
                  placeholder="5"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 3</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket3.min}
                  onChangeText={(text) => setTaxBracket3({...taxBracket3, min: text})}
                  placeholder="600000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket3.max}
                  onChangeText={(text) => setTaxBracket3({...taxBracket3, max: text})}
                  placeholder="900000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket3.rate}
                  onChangeText={(text) => setTaxBracket3({...taxBracket3, rate: text})}
                  placeholder="10"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 4</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket4.min}
                  onChangeText={(text) => setTaxBracket4({...taxBracket4, min: text})}
                  placeholder="900000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket4.max}
                  onChangeText={(text) => setTaxBracket4({...taxBracket4, max: text})}
                  placeholder="1200000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket4.rate}
                  onChangeText={(text) => setTaxBracket4({...taxBracket4, rate: text})}
                  placeholder="15"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 5</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket5.min}
                  onChangeText={(text) => setTaxBracket5({...taxBracket5, min: text})}
                  placeholder="1200000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket5.max}
                  onChangeText={(text) => setTaxBracket5({...taxBracket5, max: text})}
                  placeholder="1500000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket5.rate}
                  onChangeText={(text) => setTaxBracket5({...taxBracket5, rate: text})}
                  placeholder="20"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.bracketContainer}>
            <Text style={styles.bracketTitle}>Bracket 6 (Highest)</Text>
            <View style={styles.bracketRow}>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Min Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket6.min}
                  onChangeText={(text) => setTaxBracket6({...taxBracket6, min: text})}
                  placeholder="1500000"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Max Income</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket6.max}
                  onChangeText={(text) => setTaxBracket6({...taxBracket6, max: text})}
                  placeholder="Leave empty for unlimited"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.bracketInput}>
                <Text style={styles.bracketLabel}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.bracketTextInput}
                  value={taxBracket6.rate}
                  onChangeText={(text) => setTaxBracket6({...taxBracket6, rate: text})}
                  placeholder="30"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {(country === 'US' || country === 'CA') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {country === 'US' ? 'State Tax' : 'Provincial Tax'}
            </Text>
            
            <Text style={styles.inputLabel}>
              {country === 'US' ? 'State' : 'Provincial'} Tax Rate (%)
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={stateTaxRate}
                onChangeText={setStateTaxRate}
                placeholder="9.3"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <Text style={styles.helpText}>
              Enter your {country === 'US' ? 'state' : 'province'}&apos;s income tax rate. This is a simplified calculation.
            </Text>
          </View>
        )}

        <TouchableOpacity style={[styles.button, { marginBottom: 65 }]} onPress={calculateTax}>
          <Text style={styles.buttonText}>Calculate Tax</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Financial</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
