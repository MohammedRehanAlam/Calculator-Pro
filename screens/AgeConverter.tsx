import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';

const { width: screenWidth } = Dimensions.get('window');

export const AgeConverter: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [birthDate, setBirthDate] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 25);
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [calculationMode, setCalculationMode] = useState<'date' | 'manual'>('date');
  const [manualAge, setManualAge] = useState('');
  const [fromUnit, setFromUnit] = useState('Years');
  const [toUnit, setToUnit] = useState('Days');

  const ageUnits = [
    { name: 'Seconds', symbol: 'seconds', factor: 365.25 * 24 * 60 * 60 },
    { name: 'Minutes', symbol: 'minutes', factor: 365.25 * 24 * 60 },
    { name: 'Hours', symbol: 'hours', factor: 365.25 * 24 },
    { name: 'Days', symbol: 'days', factor: 365.25 },
    { name: 'Weeks', symbol: 'weeks', factor: 52.1775 },
    { name: 'Months', symbol: 'months', factor: 12 },
    { name: 'Years', symbol: 'years', factor: 1 },
    { name: 'Decades', symbol: 'decades', factor: 0.1 },
    { name: 'Centuries', symbol: 'centuries', factor: 0.01 },
    { name: 'Leap Years', symbol: 'leap years', factor: 0.25 }, // Approximately 1 leap year every 4 years
  ];

  // Generate years (from 1900 to current year)
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1900; year--) {
      years.push(year);
    }
    return years;
  };

  // Generate months
  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ];

  // Generate days based on selected month and year
  const generateDays = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  // Update birth date when selections change
  const updateBirthDate = (year: number, month: number, day: number) => {
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    setBirthDate(formattedDate);
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    updateBirthDate(year, selectedMonth, selectedDay);
  };

  // Handle month change
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
    // Adjust day if it exceeds days in the new month
    const daysInNewMonth = new Date(selectedYear, month, 0).getDate();
    const newDay = Math.min(selectedDay, daysInNewMonth);
    setSelectedDay(newDay);
    updateBirthDate(selectedYear, month, newDay);
  };

  // Handle day change
  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    updateBirthDate(selectedYear, selectedMonth, day);
  };

  // Initialize birth date on component mount
  useEffect(() => {
    updateBirthDate(selectedYear, selectedMonth, selectedDay);
  }, []);

  const isLeapYear = (year: number) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  };

  const getLeapYears = (startYear: number, endYear: number) => {
    const leapYears = [];
    for (let year = startYear; year <= endYear; year++) {
      if (isLeapYear(year)) {
        leapYears.push(year);
      }
    }
    return leapYears;
  };

  const calculateAgeFromDate = (birthDateStr: string) => {
    try {
      const birth = new Date(birthDateStr);
      const today = new Date();
      
      if (birth > today) {
        Alert.alert('Invalid Date', 'Birth date cannot be in the future');
        return null;
      }
      
      let years = today.getFullYear() - birth.getFullYear();
      let months = today.getMonth() - birth.getMonth();
      let days = today.getDate() - birth.getDate();
      
      if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
      }
      
      if (months < 0) {
        years--;
        months += 12;
      }
      
      const totalMilliseconds = today.getTime() - birth.getTime();
      const totalSeconds = Math.floor(totalMilliseconds / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = years * 12 + months;
      
      const leapYears = getLeapYears(birth.getFullYear(), today.getFullYear());
      
      return {
        years: years,
        months: months,
        days: days,
        totalDays: totalDays,
        totalWeeks: totalWeeks,
        totalMonths: totalMonths,
        totalHours: totalHours,
        totalMinutes: totalMinutes,
        totalSeconds: totalSeconds,
        leapYears: leapYears,
        leapYearCount: leapYears.length,
      };
    } catch (error) {
      Alert.alert('Invalid Date', 'Please enter a valid date (YYYY-MM-DD)');
      return null;
    }
  };

  const convertAge = (value: number, fromUnitName: string, toUnitName: string) => {
    const fromFactor = ageUnits.find(unit => unit.name === fromUnitName)?.factor || 1;
    const toFactor = ageUnits.find(unit => unit.name === toUnitName)?.factor || 1;
    return (value / fromFactor) * toFactor;
  };

  const getAgeInPreferredUnit = () => {
    if (calculationMode === 'date') {
      if (!birthDate) return '0';
      const ageData = calculateAgeFromDate(birthDate);
      if (!ageData) return '0';
      
      // Special handling for leap years in date mode
      if (toUnit === 'Leap Years') {
        return ageData.leapYearCount.toString(); // Show exact count as whole number
      }
      
      // For other units, calculate from exact age data
      if (toUnit === 'Days') {
        return ageData.totalDays.toString();
      } else if (toUnit === 'Weeks') {
        return ageData.totalWeeks.toString();
      } else if (toUnit === 'Months') {
        return ageData.totalMonths.toString();
      } else if (toUnit === 'Hours') {
        return ageData.totalHours.toString();
      } else if (toUnit === 'Minutes') {
        return ageData.totalMinutes.toString();
      } else if (toUnit === 'Seconds') {
        return ageData.totalSeconds.toString();
      } else if (toUnit === 'Years') {
        return ageData.years.toString(); // Show exact years as whole number
      } else if (toUnit === 'Decades') {
        const exactYears = ageData.years + (ageData.months / 12) + (ageData.days / 365.25);
        return (exactYears / 10).toFixed(2);
      } else if (toUnit === 'Centuries') {
        const exactYears = ageData.years + (ageData.months / 12) + (ageData.days / 365.25);
        return (exactYears / 100).toFixed(2);
      }
      
      // Fallback to conversion method
      const ageInYears = ageData.years + (ageData.months / 12) + (ageData.days / 365.25);
      const result = convertAge(ageInYears, 'Years', toUnit);
      return result.toFixed(2);
    } else {
      if (!manualAge || isNaN(Number(manualAge))) return '0';
      const value = Number(manualAge);
      
      // Special handling for leap years in manual mode
      if (toUnit === 'Leap Years') {
        const ageInYears = convertAge(value, fromUnit, 'Years');
        const currentYear = new Date().getFullYear();
        const approximateBirthYear = currentYear - Math.floor(ageInYears);
        
        // Calculate exact leap years from approximate birth year to current year
        const leapYears = getLeapYears(approximateBirthYear, currentYear);
        return leapYears.length.toString(); // Show exact count as whole number
      }
      
      const result = convertAge(value, fromUnit, toUnit);
      
      // Show whole numbers for basic time units
      if (['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Months', 'Years'].includes(toUnit)) {
        return Math.floor(result).toString();
      }
      
      return result.toFixed(2);
    }
  };

  const getDetailedAgeInfo = () => {
    if (calculationMode === 'date') {
      if (!birthDate) return null;
      return calculateAgeFromDate(birthDate);
    } else {
      if (!manualAge || isNaN(Number(manualAge))) return null;
      const value = Number(manualAge);
      const ageInYears = convertAge(value, fromUnit, 'Years');
      
      // Calculate approximate time units from the converted age
      const totalDays = ageInYears * 365.25;
      const totalWeeks = totalDays / 7;
      const totalMonths = ageInYears * 12;
      const totalHours = totalDays * 24;
      const totalMinutes = totalHours * 60;
      const totalSeconds = totalMinutes * 60;
      
      // For manual mode, we can't determine exact leap years, so we'll show approximate
      const currentYear = new Date().getFullYear();
      const approximateBirthYear = currentYear - Math.floor(ageInYears);
      const leapYears = getLeapYears(approximateBirthYear, currentYear);
      
      return {
        years: Math.floor(ageInYears),
        months: Math.floor((ageInYears % 1) * 12),
        days: Math.floor(((ageInYears % 1) * 12 % 1) * 30.44),
        totalDays: Math.floor(totalDays),
        totalWeeks: Math.floor(totalWeeks),
        totalMonths: Math.floor(totalMonths),
        totalHours: Math.floor(totalHours),
        totalMinutes: Math.floor(totalMinutes),
        totalSeconds: Math.floor(totalSeconds),
        leapYears: leapYears,
        leapYearCount: leapYears.length,
        isApproximate: true,
      };
    }
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
    modeSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      ...Shadows.sm,
    },
    modeButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modeButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      flex: 1,
      marginHorizontal: 4,
    },
    modeButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    modeButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    modeButtonTextSelected: {
      color: colors.text,
    },
    inputSection: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      ...Shadows.sm,
    },
    inputLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      marginBottom: 8,
    },
    inputField: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      fontSize: Typography.body.fontSize,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    dateHint: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      marginTop: 4,
      fontStyle: 'italic',
    },
    datePickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    datePickerColumn: {
      flex: 1,
      marginHorizontal: 2,
    },
    datePickerLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      marginBottom: 4,
      textAlign: 'center',
    },
    datePicker: {
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      height: 50,
    },
    unitSelector: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      ...Shadows.sm,
    },
    unitGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    unitButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
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
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      ...Shadows.sm,
    },
    resultText: {
      color: colors.primary,
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
    detailedInfo: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      padding: 12,
      marginTop: 8,
    },
    detailedText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      marginBottom: 4,
    },
    leapYearList: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8,
      padding: 8,
      marginTop: 8,
    },
    leapYearText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
    },
  });

  const handleFromUnitSelect = (unitName: string) => {
    setFromUnit(unitName);
  };

  const handleToUnitSelect = (unitName: string) => {
    setToUnit(unitName);
  };

  const ageInfo = getDetailedAgeInfo();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.converterContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.modeSelector}>
          <Text style={styles.inputLabel}>Calculation Mode</Text>
          <View style={styles.modeButtonContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculationMode === 'date' && styles.modeButtonSelected
              ]}
              onPress={() => setCalculationMode('date')}
            >
              <Text style={[
                styles.modeButtonText,
                calculationMode === 'date' && styles.modeButtonTextSelected
              ]}>
                📅 Calculate from Birth Date
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                calculationMode === 'manual' && styles.modeButtonSelected
              ]}
              onPress={() => setCalculationMode('manual')}
            >
              <Text style={[
                styles.modeButtonText,
                calculationMode === 'manual' && styles.modeButtonTextSelected
              ]}>
                🔢 Manual Age Conversion
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {calculationMode === 'date' ? (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Select Your Birth Date</Text>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Year</Text>
                <Picker
                  style={[styles.datePicker, { color: colors.text }]}
                  selectedValue={selectedYear}
                  onValueChange={handleYearChange}
                  itemStyle={{ color: colors.text }}
                  dropdownIconColor={colors.text}
                >
                  {generateYears().map((year) => (
                    <Picker.Item key={year} label={year.toString()} value={year} />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Month</Text>
                <Picker
                  style={[styles.datePicker, { color: colors.text }]}
                  selectedValue={selectedMonth}
                  onValueChange={handleMonthChange}
                  itemStyle={{ color: colors.text }}
                  dropdownIconColor={colors.text}
                >
                  {months.map((month) => (
                    <Picker.Item key={month.value} label={month.label} value={month.value} />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.datePickerColumn}>
                <Text style={styles.datePickerLabel}>Day</Text>
                <Picker
                  style={[styles.datePicker, { color: colors.text }]}
                  selectedValue={selectedDay}
                  onValueChange={handleDayChange}
                  itemStyle={{ color: colors.text }}
                  dropdownIconColor={colors.text}
                >
                  {generateDays().map((day) => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
                </Picker>
              </View>
            </View>
            
            <Text style={styles.dateHint}>
              Selected: {birthDate || 'Please select your birth date'}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.unitSelector}>
              <Text style={styles.inputLabel}>From Unit</Text>
              <View style={styles.unitGrid}>
                {ageUnits.map((unit, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.unitButton,
                      fromUnit === unit.name && styles.unitButtonSelected
                    ]}
                    onPress={() => handleFromUnitSelect(unit.name)}
                  >
                    <Text style={[
                      styles.unitButtonText,
                      fromUnit === unit.name && styles.unitButtonTextSelected
                    ]}>
                      {unit.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Enter Age Value</Text>
              <TextInput
                style={styles.inputField}
                value={manualAge}
                onChangeText={setManualAge}
                placeholder="Enter age"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </>
        )}

        <View style={styles.unitSelector}>
          <Text style={styles.inputLabel}>Convert To</Text>
          <View style={styles.unitGrid}>
            {ageUnits.map((unit, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.unitButton,
                  toUnit === unit.name && styles.unitButtonSelected
                ]}
                onPress={() => handleToUnitSelect(unit.name)}
              >
                <Text style={[
                  styles.unitButtonText,
                  toUnit === unit.name && styles.unitButtonTextSelected
                ]}>
                  {unit.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.resultSection, { marginBottom: 16 }]}>
          <Text style={styles.inputLabel}>Result</Text>
          <Text style={styles.resultText}>
            {getAgeInPreferredUnit()} {ageUnits.find(u => u.name === toUnit)?.symbol}
          </Text>
          
          {/* Show leap years list when converting to leap years */}
          {toUnit === 'Leap Years' && ageInfo && (
            <View style={styles.leapYearList}>
              <Text style={styles.leapYearText}>
                Years: {ageInfo.leapYears.join(', ')}
              </Text>
            </View>
          )}
          
          {/* Detailed Age Breakdown; removed for now may be added back later */}
          {/* {ageInfo && (
            <View style={styles.detailedInfo}>
              <Text style={styles.detailedText}>
                📊 Detailed Age Breakdown:
              </Text>
              {ageInfo.isApproximate && (
                <Text style={[styles.detailedText, { color: colors.textSecondary, fontStyle: 'italic' }]}>
                  * Approximate calculations based on average values
                </Text>
              )}
              <Text style={styles.detailedText}>
                {ageInfo.years} years, {ageInfo.months} months, {ageInfo.days} days
              </Text>
              <Text style={styles.detailedText}>
                ⏰ Total Time Units:
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalSeconds.toLocaleString()} seconds
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalMinutes.toLocaleString()} minutes
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalHours.toLocaleString()} hours
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalDays.toLocaleString()} days
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalWeeks.toLocaleString()} weeks
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.totalMonths.toLocaleString()} months
              </Text>
              <Text style={styles.detailedText}>
                🗓️ Leap Years Experienced:
              </Text>
              <Text style={styles.detailedText}>
                {ageInfo.leapYearCount} leap years: {ageInfo.leapYears.join(', ')}
              </Text>
            </View>
          )} */}
        </View>
      </ScrollView>
    </View>
  );
};
