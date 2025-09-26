import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useHistory } from '../contexts/HistoryContext';
import { Shadows } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const BasicCalculator: React.FC = () => {
  const { colors } = useTheme();
  const { addToHistory } = useHistory();
  const insets = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculator state
  const [display, setDisplay] = useState('0');
  const [operationDisplay, setOperationDisplay] = useState('');
  const [isCalculationComplete, setIsCalculationComplete] = useState(false);
  const [expression, setExpression] = useState('0');
  const [showingResult, setShowingResult] = useState(false);
  const [calculationMode, setCalculationMode] = useState<'bodmas' | 'left-to-right'>('left-to-right');
  const [hapticFeedback, setHapticFeedback] = useState(true);

  // Load settings on component mount
  useEffect(() => {
    loadCalculationMode();
    loadHapticSetting();
  }, []);

  const loadCalculationMode = async () => {
    try {
      const savedMode = await AsyncStorage.getItem('calculation-mode');
      if (savedMode) {
        setCalculationMode(savedMode as 'bodmas' | 'left-to-right');
      } else {
        // Set default to 'left-to-right' if no saved mode exists
        setCalculationMode('left-to-right');
        await AsyncStorage.setItem('calculation-mode', JSON.stringify('left-to-right'));
      }
    } catch (error) {
      console.error('Failed to load calculation mode:', error);
    }
  };

  const loadHapticSetting = async () => {
    try {
      const savedHaptic = await AsyncStorage.getItem('haptic-feedback');
      if (savedHaptic !== null) {
        setHapticFeedback(JSON.parse(savedHaptic));
      }
    } catch (error) {
      console.error('Failed to load haptic setting:', error);
    }
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (hapticFeedback) {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    }
  };
  
  // Scientific calculator state
  const [isSecondFunction, setIsSecondFunction] = useState(false);
  const [isDegreeMode, setIsDegreeMode] = useState(true);
  const [memory, setMemory] = useState(0);

  // Calculator functions
  const inputNumber = (num: string) => {
    triggerHaptic('light');
    
    if (showingResult) {
      setExpression(num);
      setDisplay(num);
      setShowingResult(false);
      return;
    }
    
    if (expression === '0' && num !== '.') {
      setExpression(num);
      setDisplay(num);
    } else {
      const newExpression = expression + num;
      const validation = validateExpression(newExpression);
      
      if (!validation.valid) {
        // Show error message (you can implement a toast or alert here)
        return;
      }
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  };

  const inputDecimal = () => {
    triggerHaptic('light');
    
    if (showingResult) {
      setExpression('0.');
      setDisplay('0.');
      setShowingResult(false);
      return;
    }
    
    // Split by operators to check the last number
    const parts = expression.split(/[+\-×÷%^()]/);
    const lastPart = parts[parts.length - 1];
    
    // Only add decimal if the last number doesn't already have one
    if (!lastPart.includes('.')) {
      const newExpression = expression + '.';
      const validation = validateExpression(newExpression);
      
      if (!validation.valid) {
        return;
      }
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  };

  const clear = () => {
    triggerHaptic('medium');
    setDisplay('0');
    setOperationDisplay('');
    setIsCalculationComplete(false);
    setExpression('0');
    setShowingResult(false);
  };

  const backspace = () => {
    triggerHaptic('light');
    
    if (showingResult) {
      clear();
      return;
    }
    
    if (expression.length > 1) {
      const newExpression = expression.slice(0, -1);
      setExpression(newExpression);
      setDisplay(newExpression);
    } else {
      setExpression('0');
      setDisplay('0');
    }
  };


  // Calculator limits configuration
  const CALCULATOR_LIMITS = {
    MAX_NUMBER_LENGTH: 16,
    MAX_OPERATIONS: 29,
    MAX_NUMBERS: 30,
    MAX_DECIMAL_PLACES: 8,
    MAX_RESULT_LENGTH: 12,
    MAX_PARENTHESES_DEPTH: 3
  };

  // Validation functions
  const validateNumberLength = (expr: string): boolean => {
    const numbers = expr.match(/\d+\.?\d*/g);
    if (!numbers) return true;
    return numbers.every(num => num.length <= CALCULATOR_LIMITS.MAX_NUMBER_LENGTH);
  };

  const validateOperationCount = (expr: string): boolean => {
    const operations = expr.match(/[+\-×÷%^]/g);
    const count = operations ? operations.length : 0;
    return count <= CALCULATOR_LIMITS.MAX_OPERATIONS;
  };

  const validateNumberCount = (expr: string): boolean => {
    const numbers = expr.match(/\d+\.?\d*/g);
    const count = numbers ? numbers.length : 0;
    return count <= CALCULATOR_LIMITS.MAX_NUMBERS;
  };

  const validateParenthesesDepth = (expr: string): boolean => {
    let depth = 0;
    let maxDepth = 0;
    for (let char of expr) {
      if (char === '(') {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
      } else if (char === ')') {
        depth--;
        if (depth < 0) return false;
      }
    }
    return depth >= 0 && maxDepth <= CALCULATOR_LIMITS.MAX_PARENTHESES_DEPTH;
  };

  const validateDecimalPlaces = (expr: string): boolean => {
    const numbers = expr.match(/\d+\.\d+/g);
    if (!numbers) return true;
    return numbers.every(num => {
      const decimalPart = num.split('.')[1];
      return decimalPart.length <= CALCULATOR_LIMITS.MAX_DECIMAL_PLACES;
    });
  };

  const validateExpression = (expr: string): { valid: boolean; error?: string } => {
    if (!validateNumberLength(expr)) {
      return { valid: false, error: "Number too long" };
    }
    if (!validateOperationCount(expr)) {
      return { valid: false, error: "Too many operations" };
    }
    if (!validateNumberCount(expr)) {
      return { valid: false, error: "Too many numbers" };
    }
    if (!validateParenthesesDepth(expr)) {
      return { valid: false, error: "Parentheses too deep" };
    }
    if (!validateDecimalPlaces(expr)) {
      return { valid: false, error: "Too many decimal places" };
    }
    return { valid: true };
  };

  // BODMAS evaluation
  const evaluateBODMAS = (expr: string): number | string => {
    try {
      const precedence = { '+': 1, '-': 1, '×': 2, '÷': 2, '%': 2, '^': 3 };
      const associativity = { '^': 'Right', '+': 'Left', '-': 'Left', '×': 'Left', '÷': 'Left', '%': 'Left' };
      const tokens = expr.match(/(\d+\.?\d*)|([+\-×÷%^()])/g);
      if (!tokens) return 0;
      
      const outputQueue: (number | string)[] = [];
      const operatorStack: string[] = [];

      tokens.forEach(token => {
        if (!isNaN(parseFloat(token))) {
          outputQueue.push(parseFloat(token));
        } else if ("+-×÷%^".includes(token)) {
          while (
            operatorStack.length &&
            precedence[operatorStack[operatorStack.length - 1] as keyof typeof precedence] >= precedence[token as keyof typeof precedence] &&
            associativity[token as keyof typeof associativity] === 'Left'
          ) {
            outputQueue.push(operatorStack.pop()!);
          }
          operatorStack.push(token);
        } else if (token === '(') {
          operatorStack.push(token);
        } else if (token === ')') {
          while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
            outputQueue.push(operatorStack.pop()!);
          }
          operatorStack.pop();
        }
      });

      while (operatorStack.length) {
        outputQueue.push(operatorStack.pop()!);
      }

      const evaluationStack: number[] = [];
      outputQueue.forEach(token => {
        if (typeof token === 'number') {
          evaluationStack.push(token);
        } else {
          const b = evaluationStack.pop()!;
          const a = evaluationStack.pop()!;
          switch (token) {
            case '+': evaluationStack.push(a + b); break;
            case '-': evaluationStack.push(a - b); break;
            case '×': evaluationStack.push(a * b); break;
            case '÷': if (b === 0) throw new Error("Div by 0"); evaluationStack.push(a / b); break;
            case '%': evaluationStack.push(a % b); break;
            case '^': evaluationStack.push(Math.pow(a, b)); break;
          }
        }
      });

      return evaluationStack[0];
    } catch {
      return "Error";
    }
  };

  // Left-to-right evaluation
  const evaluateLeftToRight = (expr: string): number | string => {
    try {
      const tokens = expr.match(/(\d+\.?\d*)|([+\-×÷%^])/g) || [];
      if (tokens.length === 0) return 0;
      let result = parseFloat(tokens[0] ?? '0');
      for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = parseFloat(tokens[i + 1] ?? '0');
        switch (operator) {
          case '+': result += nextNumber; break;
          case '-': result -= nextNumber; break;
          case '×': result *= nextNumber; break;
          case '÷': if (nextNumber === 0) throw new Error("Div by 0"); result /= nextNumber; break;
          case '%': result %= nextNumber; break;
          case '^': result = Math.pow(result, nextNumber); break;
        }
      }
      return result;
    } catch {
      return "Error";
    }
  };

  const evaluateExpression = (expr: string): number | string => {
    try {
      if (/[+\-×÷%^]$/.test(expr)) {
        expr = expr.slice(0, -1);
      }
      let result;
      if (calculationMode === 'bodmas') {
        result = evaluateBODMAS(expr);
      } else {
        result = evaluateLeftToRight(expr);
      }

      if (typeof result !== 'number' || !isFinite(result)) {
        return "Error";
      }
      return parseFloat(result.toPrecision(12));
    } catch {
      return "Error";
    }
  };

  const handleOperator = (op: string) => {
    triggerHaptic('light');
    
    if (showingResult) {
      const result = evaluateExpression(expression);
      if (typeof result === 'string' && result.includes('Error')) {
        return;
      }
      setExpression(String(result));
      setDisplay(String(result));
      setShowingResult(false);
    }
    
    const trimmedExpression = expression.trim();
    
    // Don't allow operators at the start (except for negative numbers)
    if (trimmedExpression === '' || trimmedExpression === '0') {
      if (op === '-') {
        setExpression('-');
        setDisplay('-');
      } else {
        return;
      }
    } else if (/[+\-×÷%^]$/.test(trimmedExpression)) {
      // Replace the last operator
      const newExpression = trimmedExpression.slice(0, -1) + op;
      setExpression(newExpression);
      setDisplay(newExpression);
    } else {
      // Add the operator
      const newExpression = trimmedExpression + op;
      const validation = validateExpression(newExpression);
      
      if (!validation.valid) {
        return;
      }
      setExpression(newExpression);
      setDisplay(newExpression);
    }
  };

  const addParentheses = (paren: string) => {
    if (showingResult) {
      setExpression('');
      setDisplay('');
      setShowingResult(false);
    }
    
    // Handle opening parenthesis
    if (paren === '(') {
      if (expression === '0' || expression === '') {
        setExpression('(');
        setDisplay('(');
      } else {
        const newExpression = expression + '(';
        const validation = validateExpression(newExpression);
        if (!validation.valid) {
          return;
        }
        setExpression(newExpression);
        setDisplay(newExpression);
      }
    } 
    // Handle closing parenthesis
    else if (paren === ')') {
      // Only add closing parenthesis if there's a matching opening one
      const openCount = (expression.match(/\(/g) || []).length;
      const closeCount = (expression.match(/\)/g) || []).length;
      
      if (openCount > closeCount) {
        const newExpression = expression + ')';
        const validation = validateExpression(newExpression);
        if (!validation.valid) {
          return;
        }
        setExpression(newExpression);
        setDisplay(newExpression);
      }
    }
  };


  const equals = () => {
    if (showingResult) return;
    
    triggerHaptic('heavy');
    
    // Clean the expression by removing trailing operators
    const cleanExpression = expression.replace(/[+\-×÷%^]$/, '');
    
    const finalResult = evaluateExpression(cleanExpression);
    
    if (finalResult === "Error") {
      setDisplay("Error");
      setOperationDisplay(cleanExpression + " =");
      setIsCalculationComplete(true);
    } else {
      // Add to history with clean expression
      addToHistory({
        calculation: `${cleanExpression} = ${finalResult}`,
        result: String(finalResult),
        type: isExpanded ? 'scientific' : 'basic'
      });
      
      setOperationDisplay(`${cleanExpression} =`);
      setDisplay(String(finalResult));
      setExpression(String(finalResult));
      setIsCalculationComplete(true);
    }
    setShowingResult(true);
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
  };

  const memoryClear = () => {
    setMemory(0);
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
  };

  const performScientificFunction = (func: string) => {
    triggerHaptic('medium');
    
    const value = parseFloat(display);
    let result: number;
    let calculationString: string;

    // Check for invalid inputs
    if (isNaN(value)) {
      setDisplay("Error");
      return;
    }

    switch (func) {
      case 'sin':
        result = sine(value);
        calculationString = `sin(${value}) = ${result}`;
        break;
      case 'cos':
        result = cosine(value);
        calculationString = `cos(${value}) = ${result}`;
        break;
      case 'tan':
        result = tangent(value);
        calculationString = `tan(${value}) = ${result}`;
        break;
      case 'lg':
        if (value <= 0) {
          setDisplay("Error");
          return;
        }
        result = logarithm(value);
        calculationString = `log(${value}) = ${result}`;
        break;
      case 'ln':
        if (value <= 0) {
          setDisplay("Error");
          return;
        }
        result = naturalLog(value);
        calculationString = `ln(${value}) = ${result}`;
        break;
      case '√x':
        if (value < 0) {
          setDisplay("Error");
          return;
        }
        result = squareRoot(value);
        calculationString = `√${value} = ${result}`;
        break;
      case 'x!':
        if (value < 0 || value > 170 || !Number.isInteger(value)) {
          setDisplay("Error");
          return;
        }
        result = factorial(Math.floor(value));
        calculationString = `${Math.floor(value)}! = ${result}`;
        break;
      case '1/x':
        if (value === 0) {
          setDisplay("Error");
          return;
        }
        result = reciprocal(value);
        calculationString = `1/${value} = ${result}`;
        break;
      case 'x^y':
        // This will be handled differently as it needs two operands
        return;
      default:
        return;
    }

    // Check for invalid results
    if (isNaN(result) || !isFinite(result)) {
      setDisplay("Error");
      return;
    }

    setDisplay(result.toString());

    // Add to history
    addToHistory({
      calculation: calculationString,
      result: result.toString(),
      type: 'scientific'
    });
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
        handleOperator('%');
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        handleOperator(value);
        break;
      case '=':
        equals();
        break;
      case '.':
        inputDecimal();
        break;
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        inputNumber(value);
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
        handleOperator('^');
        break;
      case '(':
      case ')':
        addParentheses(value);
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
      height: isExpanded ? '46%' : '46%', // Fixed height
      paddingHorizontal: 16, // 16px horizontal padding
      paddingTop: insets.top + 65 + 12, // Status bar + tab bar + 12px top padding
      paddingBottom: 8, // 8px bottom padding
      justifyContent: 'flex-end',
    },
    currentDisplay: {
      alignItems: 'flex-end',
      justifyContent: 'flex-end', // Align to bottom
      minHeight: 60,
      flexGrow: 1, // Allow expansion
    },
    scrollableDisplay: {
      flex: 1,
    },
    operationDisplay: {
      color: colors.text,
      fontSize: Math.min(screenHeight * 0.08, 64), // Large font size for input area
      fontWeight: '400',
      textAlign: 'right',
      marginBottom: 8,
      minHeight: 40,
      flex: 1,
      lineHeight: Math.min(screenHeight * 0.08, 64) * 1.2, // Better line spacing
    },
    currentNumber: {
      color: isCalculationComplete ? colors.text : colors.textSecondary,
      fontSize: isCalculationComplete ? Math.min(screenHeight * 0.1, 80) : Math.min(screenHeight * 0.06, 48), // Bigger when complete
      fontWeight: isCalculationComplete ? '500' : '400', // Bolder when complete
      textAlign: 'right',
      minHeight: isCalculationComplete ? 110 : 80,
      lineHeight: isCalculationComplete ? Math.min(screenHeight * 0.1, 80) * 1.2 : Math.min(screenHeight * 0.06, 48) * 1.2,
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
        <ScrollView 
          style={styles.scrollableDisplay}
          contentContainerStyle={styles.currentDisplay}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {expression && expression !== '0' && !showingResult ? (
            <Text 
              style={[
                styles.operationDisplay,
                {
                  fontSize: Math.max(
                    Math.min(screenHeight * 0.08, 64) - (expression.length * 0.7),
                    Math.min(screenHeight * 0.025, 16)
                  ),
                  lineHeight: Math.max(
                    Math.min(screenHeight * 0.08, 64) - (expression.length * 0.8),
                    Math.min(screenHeight * 0.025, 16)
                  ) * 1.3
                }
              ]}
              numberOfLines={0} // Allow multiple lines
              adjustsFontSizeToFit={false} // Don't auto-shrink, let it wrap
            >
              {expression.replace(/[+\-×÷%^]$/, '')}
            </Text>
          ) : operationDisplay ? (
            <Text 
              style={[
                styles.operationDisplay,
                {
                  fontSize: Math.max(
                    Math.min(screenHeight * 0.08, 64) - (operationDisplay.length * 0.8),
                    Math.min(screenHeight * 0.025, 16)
                  ),
                  lineHeight: Math.max(
                    Math.min(screenHeight * 0.08, 64) - (operationDisplay.length * 0.8),
                    Math.min(screenHeight * 0.025, 16)
                  ) * 1.3
                }
              ]}
              numberOfLines={0} // Allow multiple lines
              adjustsFontSizeToFit={false} // Don't auto-shrink, let it wrap
            >
              {operationDisplay}
            </Text>
          ) : null}
          <Text style={styles.currentNumber}>
            {showingResult ? display : (() => {
              if (expression && expression !== '0' && expression.match(/[+\-×÷%^]/)) {
                const preview = evaluateExpression(expression);
                return typeof preview === 'number' ? String(preview) : display;
              }
              return display;
            })()}
          </Text>
        </ScrollView>
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
