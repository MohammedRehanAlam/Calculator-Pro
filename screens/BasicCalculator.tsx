import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const BasicCalculator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    displayContainer: {
      height: isExpanded ? '48%' : '49%', // 40% for basic scientific, 41% for basic
      paddingHorizontal: 16, // 16px horizontal padding
      paddingTop: insets.top + 65 + 12, // Status bar + tab bar + 12px top padding
      paddingBottom: 8, // 8px bottom padding
      justifyContent: 'flex-end',
    },
    currentDisplay: {
      alignItems: 'flex-end',
      justifyContent: 'center',
      minHeight: 60,
    },
    currentNumber: {
      color: colors.text,
      fontSize: Math.min(screenHeight * 0.08, 64), // Responsive font size
      fontWeight: '400',
      textAlign: 'right',
    },
    keypad: {
      flex: 1, // Takes remaining space after display
      paddingHorizontal: isExpanded ? 12 : 16, // 12px for scientific, 16px for basic
      paddingTop: isExpanded ? 6 : 8, // 6px for scientific, 8px for basic
      paddingBottom: isExpanded ? 12 : 16, // 12px for scientific, 16px for basic
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: isExpanded ? 6 : 8, // 6px for scientific, 8px for basic
    },
    button: {
      flex: 1, // Auto-adjust width to fit available space
      height: isExpanded ? Math.min(screenWidth * 0.13, 50) : Math.min(screenWidth * 0.18, 70), // 50px for scientific, 70px for basic
      borderRadius: isExpanded ? Math.min(screenWidth * 0.06, 25) : Math.min(screenWidth * 0.09, 35), // Adjusted border radius
      backgroundColor: colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isExpanded ? 2 : 2, // 2px for scientific, 2px for basic
      ...Shadows.sm,
    },
    buttonText: {
      color: colors.text,
      fontSize: Math.min(screenWidth * 0.05, 24),
      fontWeight: '500',
    },
    orangeText: {
      color: colors.primary,
      fontSize: Math.min(screenWidth * 0.05, 24),
      fontWeight: '500',
    },
    equalsButton: {
      flex: 1, // Auto-adjust width to fit available space
      height: isExpanded ? Math.min(screenWidth * 0.13, 50) : Math.min(screenWidth * 0.18, 70), // 50px for scientific, 70px for basic
      borderRadius: isExpanded ? Math.min(screenWidth * 0.06, 25) : Math.min(screenWidth * 0.09, 35), // Adjusted border radius
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isExpanded ? 2 : 2, // 2px for scientific, 2px for basic
      ...Shadows.md,
    },
    equalsText: {
      color: colors.text,
      fontSize: Math.min(screenWidth * 0.05, 24),
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.displayContainer}>
        <View style={styles.currentDisplay}>
          <Text style={styles.currentNumber}>0</Text>
        </View>
      </View>
      <View style={styles.keypad}>
        {/* Scientific Calculator Rows - Only show when expanded */}
        {isExpanded && (
          <>
            {/* Scientific Row 1 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>2nd</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>deg</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>sin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>cos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>tan</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 2 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>x^y</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>lg</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>ln</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>(</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>)</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 3 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>√x</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>AC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>⌫</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>÷</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 4 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>x!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>×</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 5 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>1/x</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>-</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 6 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>π</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.orangeText}>+</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 7 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => setIsExpanded(!isExpanded)}
              >
                <Text style={styles.orangeText}>⌄</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>e</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.equalsButton}>
                <Text style={styles.equalsText}>=</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        {/* Basic Calculator Rows - Only show when not expanded */}
        {!isExpanded && (
          <>
            {/* Row 1 */}
            <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.orangeText}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>%</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>÷</Text>
          </TouchableOpacity>
        </View>
        {/* Row 2 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>×</Text>
          </TouchableOpacity>
        </View>
        {/* Row 3 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        {/* Row 4 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Row 5 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.orangeText}>{isExpanded ? '⌄' : '⌃'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.equalsButton}>
            <Text style={styles.equalsText}>=</Text>
          </TouchableOpacity>
        </View>
          </>
        )}
      </View>
    </View>
  );
};
