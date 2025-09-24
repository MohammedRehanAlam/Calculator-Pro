import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

export const DiscountConverter: React.FC = () => {
  const { colors } = useTheme();
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [discountType, setDiscountType] = useState('percentage');

  const calculateDiscount = () => {
    if (!originalPrice || !discountValue || isNaN(Number(originalPrice)) || isNaN(Number(discountValue))) {
      return { finalPrice: '0', savings: '0', discountAmount: '0' };
    }
    
    const price = Number(originalPrice);
    const discount = Number(discountValue);
    
    let discountAmount = 0;
    let finalPrice = 0;
    
    if (discountType === 'percentage') {
      discountAmount = (price * discount) / 100;
      finalPrice = price - discountAmount;
    } else {
      discountAmount = discount;
      finalPrice = price - discountAmount;
    }
    
    return {
      finalPrice: finalPrice.toFixed(2),
      savings: discountAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
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
    typeSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    typeGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    typeButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 12, // 12px padding
      width: '48%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '500',
    },
    typeButtonTextSelected: {
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

  const results = calculateDiscount();

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Discount Calculator</Text>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Original Price</Text>
          <TextInput
            style={styles.inputField}
            value={originalPrice}
            onChangeText={setOriginalPrice}
            placeholder="Enter original price"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.typeSelector}>
          <Text style={styles.inputLabel}>Discount Type</Text>
          <View style={styles.typeGrid}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                discountType === 'percentage' && styles.typeButtonSelected
              ]}
              onPress={() => setDiscountType('percentage')}
            >
              <Text style={[
                styles.typeButtonText,
                discountType === 'percentage' && styles.typeButtonTextSelected
              ]}>
                Percentage (%)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                discountType === 'amount' && styles.typeButtonSelected
              ]}
              onPress={() => setDiscountType('amount')}
            >
              <Text style={[
                styles.typeButtonText,
                discountType === 'amount' && styles.typeButtonTextSelected
              ]}>
                Fixed Amount ($)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>
            {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
          </Text>
          <TextInput
            style={styles.inputField}
            value={discountValue}
            onChangeText={setDiscountValue}
            placeholder={discountType === 'percentage' ? 'Enter percentage' : 'Enter amount'}
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.resultSection}>
          <Text style={styles.resultLabel}>Final Price</Text>
          <Text style={styles.resultText}>${results.finalPrice}</Text>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.resultLabel}>You Save</Text>
          <Text style={styles.resultText}>${results.savings}</Text>
        </View>
      </ScrollView>
    </View>
  );
};
