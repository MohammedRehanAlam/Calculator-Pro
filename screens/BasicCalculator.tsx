import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Shadows } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const BasicCalculator: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [hasDecimal, setHasDecimal] = useState(false);
  
  // Scientific calculator state
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [isDegreeMode, setIsDegreeMode] = useState(true);
  const [memory, setMemory] = useState(0);
  const [expression, setExpression] = useState<string[]>([]);
  const [parenthesesCount, setParenthesesCount] = useState(0);

  // Calculator functions
  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
      setHasDecimal(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setHasDecimal(true);
    } else if (!hasDecimal) {
      setDisplay(display + '.');
      setHasDecimal(true);
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHasDecimal(false);
  };

  const backspace = () => {
    if (display.length > 1) {
      const newDisplay = display.slice(0, -1);
      setDisplay(newDisplay);
      setHasDecimal(newDisplay.includes('.'));
    } else {
      setDisplay('0');
      setHasDecimal(false);
    }
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay((value / 100).toString());
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setHasDecimal(false);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const equals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
      setHasDecimal(String(newValue).includes('.'));
    }
  };

  // Scientific calculator functions
  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };


  const squareRoot = (value: number): number => {
    return Math.sqrt(value);
  };

  const logarithm = (value: number): number => {
    return Math.log10(value);
  };

  const naturalLog = (value: number): number => {
    return Math.log(value);
  };

  const sine = (value: number): number => {
    const radians = isDegreeMode ? (value * Math.PI) / 180 : value;
    return Math.sin(radians);
  };

  const cosine = (value: number): number => {
    const radians = isDegreeMode ? (value * Math.PI) / 180 : value;
    return Math.cos(radians);
  };

  const tangent = (value: number): number => {
    const radians = isDegreeMode ? (value * Math.PI) / 180 : value;
    return Math.tan(radians);
  };

  const reciprocal = (value: number): number => {
    return value !== 0 ? 1 / value : Infinity;
  };

  const toggleSign = () => {
    const value = parseFloat(display);
    setDisplay((value * -1).toString());
  };

  const memoryAdd = () => {
    setMemory(memory + parseFloat(display));
  };

  const memorySubtract = () => {
    setMemory(memory - parseFloat(display));
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const addParentheses = (type: 'open' | 'close') => {
    if (type === 'open') {
      setExpression([...expression, '(']);
      setParenthesesCount(parenthesesCount + 1);
    } else if (type === 'close' && parenthesesCount > 0) {
      setExpression([...expression, ')']);
      setParenthesesCount(parenthesesCount - 1);
    }
  };

  const insertConstant = (constant: string) => {
    let value: number;
    switch (constant) {
      case 'π':
        value = Math.PI;
        break;
      case 'e':
        value = Math.E;
        break;
      default:
        value = 0;
    }
    setDisplay(value.toString());
    setWaitingForOperand(true);
  };

  const performScientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = sine(value);
        break;
      case 'cos':
        result = cosine(value);
        break;
      case 'tan':
        result = tangent(value);
        break;
      case 'lg':
        result = logarithm(value);
        break;
      case 'ln':
        result = naturalLog(value);
        break;
      case '√x':
        result = squareRoot(value);
        break;
      case 'x!':
        result = factorial(Math.floor(value));
        break;
      case '1/x':
        result = reciprocal(value);
        break;
      case 'x^y':
        // This will be handled differently as it needs two operands
        return;
      default:
        return;
    }

    setDisplay(result.toString());
    setWaitingForOperand(true);
    setHasDecimal(result.toString().includes('.'));
  };

  const handleButtonPress = (value: string) => {
    switch (value) {
      case 'AC':
        clear();
        break;
      case '⌫':
        backspace();
        break;
      case '%':
        percentage();
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        performOperation(value);
        break;
      case '=':
        equals();
        break;
      case '.':
        inputDecimal();
        break;
      case '2nd':
        setIsSecondFunction(!isSecondFunction);
        break;
      case 'deg':
        setIsDegreeMode(!isDegreeMode);
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'lg':
      case 'ln':
      case '√x':
      case 'x!':
      case '1/x':
        performScientificFunction(value);
        break;
      case 'x^y':
        performOperation('^');
        break;
      case '(':
      case ')':
        addParentheses(value as 'open' | 'close');
        break;
      case 'π':
      case 'e':
        insertConstant(value);
        break;
      case 'M+':
        memoryAdd();
        break;
      case 'M-':
        memorySubtract();
        break;
      case 'MR':
        memoryRecall();
        break;
      case 'MC':
        memoryClear();
        break;
      case '±':
        toggleSign();
        break;
      default:
        if (/[0-9]/.test(value)) {
          inputNumber(value);
        }
        break;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    displayContainer: {
      height: isExpanded ? '46%' : '46%', // Reduced height to make room for more buttons
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
      paddingHorizontal: isExpanded ? 8 : 12, // Reduced padding
      paddingTop: isExpanded ? 4 : 6, // Reduced padding
      paddingBottom: isExpanded ? 8 : 12, // Reduced padding
    },
    keypadRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: isExpanded ? 4 : 6, // Reduced margin
    },
    button: {
      flex: 1, // Auto-adjust width to fit available space
      height: isExpanded ? Math.min(screenWidth * 0.16, 50) : Math.min(screenWidth * 0.16, 60), // Reduced height
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
      height: isExpanded ? Math.min(screenWidth * 0.12, 45) : Math.min(screenWidth * 0.16, 60), // Reduced height
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
          <Text style={styles.currentNumber}>{display}</Text>
        </View>
      </View>
      <View style={styles.keypad}>
        {/* Scientific Calculator Rows - Only show when expanded */}
        {isExpanded && (
          <>
            {/* Scientific Row 1 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity 
                style={[styles.button, isSecondFunction && { backgroundColor: colors.primary }]} 
                onPress={() => handleButtonPress('2nd')}
              >
                <Text style={[styles.buttonText, isSecondFunction && { color: colors.text }]}>2nd</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, !isDegreeMode && { backgroundColor: colors.primary }]} 
                onPress={() => handleButtonPress('deg')}
              >
                <Text style={[styles.buttonText, !isDegreeMode && { color: colors.text }]}>{isDegreeMode ? 'deg' : 'rad'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('sin')}>
                <Text style={styles.buttonText}>sin</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('cos')}>
                <Text style={styles.buttonText}>cos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('tan')}>
                <Text style={styles.buttonText}>tan</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 2 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('x^y')}>
                <Text style={styles.buttonText}>x^y</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('lg')}>
                <Text style={styles.buttonText}>lg</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('ln')}>
                <Text style={styles.buttonText}>ln</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('(')}>
                <Text style={styles.buttonText}>(</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress(')')}>
                <Text style={styles.buttonText}>)</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 3 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('√x')}>
                <Text style={styles.buttonText}>√x</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('AC')}>
                <Text style={styles.orangeText}>AC</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('⌫')}>
                <Text style={styles.orangeText}>⌫</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('%')}>
                <Text style={styles.orangeText}>%</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('÷')}>
                <Text style={styles.orangeText}>÷</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 4 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('x!')}>
                <Text style={styles.buttonText}>x!</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('7')}>
                <Text style={styles.buttonText}>7</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('8')}>
                <Text style={styles.buttonText}>8</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('9')}>
                <Text style={styles.buttonText}>9</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('×')}>
                <Text style={styles.orangeText}>×</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 5 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('1/x')}>
                <Text style={styles.buttonText}>1/x</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('4')}>
                <Text style={styles.buttonText}>4</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('5')}>
                <Text style={styles.buttonText}>5</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('6')}>
                <Text style={styles.buttonText}>6</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('-')}>
                <Text style={styles.orangeText}>-</Text>
              </TouchableOpacity>
            </View>
            {/* Scientific Row 6 */}
            <View style={styles.keypadRow}>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('π')}>
                <Text style={styles.buttonText}>π</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('1')}>
                <Text style={styles.buttonText}>1</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('2')}>
                <Text style={styles.buttonText}>2</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('3')}>
                <Text style={styles.buttonText}>3</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('+')}>
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
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('e')}>
                <Text style={styles.buttonText}>e</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('0')}>
                <Text style={styles.buttonText}>0</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('.')}>
                <Text style={styles.buttonText}>.</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.equalsButton} onPress={() => handleButtonPress('=')}>
                <Text style={styles.equalsText}>=</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        
        {/* Basic Calculator Rows - Only show when not expanded */}
        {!isExpanded && (
          <>
          {/* Row 1 - Memory Functions */}
          <View style={styles.keypadRow}>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('MC')}>
              <Text style={styles.buttonText}>MC</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('MR')}>
              <Text style={styles.buttonText}>MR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('M+')}>
              <Text style={styles.buttonText}>M+</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('M-')}>
              <Text style={styles.buttonText}>M-</Text>
            </TouchableOpacity>
          </View>
          {/* Row 2 */}
          <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('AC')}>
            <Text style={styles.buttonText}>AC</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('⌫')}>
            <Text style={styles.orangeText}>⌫</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('±')}>
            <Text style={styles.buttonText}>±</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('÷')}>
            <Text style={styles.buttonText}>÷</Text>
          </TouchableOpacity>
        </View>
        {/* Row 3 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('7')}>
            <Text style={styles.buttonText}>7</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('8')}>
            <Text style={styles.buttonText}>8</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('9')}>
            <Text style={styles.buttonText}>9</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('×')}>
            <Text style={styles.buttonText}>×</Text>
          </TouchableOpacity>
        </View>
        {/* Row 4 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('4')}>
            <Text style={styles.buttonText}>4</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('5')}>
            <Text style={styles.buttonText}>5</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('6')}>
            <Text style={styles.buttonText}>6</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('-')}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        {/* Row 5 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('1')}>
            <Text style={styles.buttonText}>1</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('2')}>
            <Text style={styles.buttonText}>2</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('3')}>
            <Text style={styles.buttonText}>3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('+')}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        {/* Row 6 */}
        <View style={styles.keypadRow}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.orangeText}>{isExpanded ? '⌄' : '⌃'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('0')}>
            <Text style={styles.buttonText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress('.')}>
            <Text style={styles.buttonText}>.</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.equalsButton} onPress={() => handleButtonPress('=')}>
            <Text style={styles.equalsText}>=</Text>
          </TouchableOpacity>
        </View>
          </>
        )}
      </View>
    </View>
  );
};
