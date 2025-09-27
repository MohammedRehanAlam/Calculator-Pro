import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';
import { router } from 'expo-router';
import Svg, { Line, Circle, Text as SvgText, G, Polyline } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

export const GraphingCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [functionInput, setFunctionInput] = useState('');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [yMin, setYMin] = useState('-10');
  const [yMax, setYMax] = useState('10');
  const [graphData, setGraphData] = useState<{x: number, y: number}[]>([]);
  const [showGraph, setShowGraph] = useState(false);
  const [autoYRange, setAutoYRange] = useState(true);
  const [autoXRange, setAutoXRange] = useState(true);
  
  // Interactive graph state - use single object for better state management
  const [currentRanges, setCurrentRanges] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });


  const evaluateFunction = (func: string, x: number): number => {
    try {
      // Replace x with the actual value, ensuring proper formatting for negative numbers
      let expression = func.replace(/x/g, `(${x})`);
      
      // Handle common mathematical functions
      expression = expression.replace(/sin\(/g, 'Math.sin(');
      expression = expression.replace(/cos\(/g, 'Math.cos(');
      expression = expression.replace(/tan\(/g, 'Math.tan(');
      expression = expression.replace(/log\(/g, 'Math.log(');
      expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');
      expression = expression.replace(/pow\(/g, 'Math.pow(');
      expression = expression.replace(/abs\(/g, 'Math.abs(');
      expression = expression.replace(/exp\(/g, 'Math.exp(');
      
      // Handle power operator
      expression = expression.replace(/\^/g, '**');
      
      // Evaluate the expression
      const result = eval(expression);
      
      // Handle special cases for better negative value support
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
      
      return NaN;
    } catch {
      return NaN;
    }
  };

  const generateGraphData = () => {
    if (!functionInput.trim()) {
      Alert.alert('Error', 'Please enter a function');
      return;
    }

    let xMinNum, xMaxNum;
    
    if (autoXRange) {
      // For auto X range, use a wider range to ensure we capture the full function
      xMinNum = -15;
      xMaxNum = 15;
    } else {
      xMinNum = parseFloat(xMin);
      xMaxNum = parseFloat(xMax);
    }

    const yMinNum = parseFloat(yMin);
    const yMaxNum = parseFloat(yMax);

    if (!autoXRange && (isNaN(xMinNum) || isNaN(xMaxNum))) {
      Alert.alert('Error', 'Please enter valid numeric values for the X range');
      return;
    }

    if (!autoXRange && xMinNum >= xMaxNum) {
      Alert.alert('Error', 'Invalid X range values');
      return;
    }

    if (!autoYRange && (isNaN(yMinNum) || isNaN(yMaxNum))) {
      Alert.alert('Error', 'Please enter valid numeric values for the Y range');
      return;
    }

    if (!autoYRange && yMinNum >= yMaxNum) {
      Alert.alert('Error', 'Invalid Y range values');
      return;
    }

    const points = [];

    // Generate points across the entire x range with better precision
    const numPoints = 1000; // More points for better coverage
    for (let i = 0; i <= numPoints; i++) {
      const x = xMinNum + (i / numPoints) * (xMaxNum - xMinNum);
      const y = evaluateFunction(functionInput, x);
      if (!isNaN(y) && isFinite(y)) {
        // Don't filter by y range here - we want to see the complete function
        points.push({ x, y });
      }
    }

    if (points.length === 0) {
      Alert.alert('No Data', 'No valid points found in the specified range');
      return;
    }


    setGraphData(points);
    setShowGraph(true);
    
    // Initialize current ranges for interactive graph with proper centering
    let newRanges = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };
    
    if (autoXRange) {
      // For auto X range, center around 0 and ensure symmetric range
      const maxAbsX = Math.max(Math.abs(xMinNum), Math.abs(xMaxNum));
      newRanges.xMin = -maxAbsX;
      newRanges.xMax = maxAbsX;
    } else {
      newRanges.xMin = xMinNum;
      newRanges.xMax = xMaxNum;
    }
    
    if (autoYRange) {
      const actualYMin = Math.min(...points.map(p => p.y));
      const actualYMax = Math.max(...points.map(p => p.y));
      const yRange = actualYMax - actualYMin;
      const yPadding = yRange * 0.1;
      
      // Center Y range around 0 if possible, otherwise use data range
      if (actualYMin <= 0 && actualYMax >= 0) {
        // Data spans both positive and negative, center around 0
        const maxAbsY = Math.max(Math.abs(actualYMin), Math.abs(actualYMax));
        newRanges.yMin = -maxAbsY - yPadding;
        newRanges.yMax = maxAbsY + yPadding;
      } else {
        // Data is all positive or all negative, use data range
        newRanges.yMin = actualYMin - yPadding;
        newRanges.yMax = actualYMax + yPadding;
      }
    } else {
      newRanges.yMin = yMinNum;
      newRanges.yMax = yMaxNum;
    }
    
    setCurrentRanges(newRanges);
  };

  const renderGraph = () => {
    if (!showGraph || graphData.length === 0) return null;

    const graphWidth = screenWidth - 40;
    const graphHeight = 300;
    const padding = 40;

    // Use current ranges for interactive graph
    const displayXMin = currentRanges.xMin;
    const displayXMax = currentRanges.xMax;
    const displayYMin = currentRanges.yMin;
    const displayYMax = currentRanges.yMax;


    // Convert data points to SVG coordinates
    const svgPoints = graphData.map(point => {
      const x = padding + ((point.x - displayXMin) / (displayXMax - displayXMin)) * (graphWidth - 2 * padding);
      const y = padding + ((displayYMax - point.y) / (displayYMax - displayYMin)) * (graphHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');


    // Generate axis labels positioned along center lines
    const xAxisLabels = [];
    const yAxisLabels = [];
    
    // Calculate center line positions
    const yZeroPos = padding + ((displayYMax - 0) / (displayYMax - displayYMin)) * (graphHeight - 2 * padding);
    const xZeroPos = padding + ((0 - displayXMin) / (displayXMax - displayXMin)) * (graphWidth - 2 * padding);
    
    // X-axis labels along the Y=0 line (horizontal center)
    if (yZeroPos >= padding && yZeroPos <= graphHeight - padding) {
      for (let i = 0; i <= 10; i++) {
        const xValue = displayXMin + (i / 10) * (displayXMax - displayXMin);
        const xPos = padding + (i / 10) * (graphWidth - 2 * padding);
        
        // Only show labels that are not too close to each other
        if (i % 2 === 0 || Math.abs(xValue) < 0.1) {
          xAxisLabels.push(
            <SvgText key={`x-${i}`} x={xPos} y={yZeroPos - 5} fontSize="9" fill={colors.text} textAnchor="middle">
              {Math.abs(xValue) < 0.01 ? '0' : xValue.toFixed(1)}
            </SvgText>
          );
        }
      }
    }
    
    // Y-axis labels along the X=0 line (vertical center)
    if (xZeroPos >= padding && xZeroPos <= graphWidth - padding) {
      for (let i = 0; i <= 10; i++) {
        const yValue = displayYMin + (i / 10) * (displayYMax - displayYMin);
        const yPos = padding + ((10 - i) / 10) * (graphHeight - 2 * padding);
        
        // Only show labels that are not too close to each other
        // Skip the 0 label for Y-axis since it will be shown on X-axis
        if ((i % 2 === 0 || Math.abs(yValue) < 0.1) && Math.abs(yValue) >= 0.1) {
          yAxisLabels.push(
            <SvgText key={`y-${i}`} x={xZeroPos + 5} y={yPos + 3} fontSize="9" fill={colors.text} textAnchor="start">
              {yValue.toFixed(1)}
            </SvgText>
          );
        }
      }
    }

    return (
      <View style={styles.graphContainer}>
        <Text style={styles.graphTitle}>Graph: {functionInput}</Text>
        
        <Svg width={graphWidth} height={graphHeight} style={styles.graph}>
          {/* Grid lines */}
          <G stroke={colors.border} strokeWidth="0.5" opacity="0.2">
            {Array.from({ length: 11 }, (_, i) => (
              <React.Fragment key={i}>
                <Line
                  x1={padding + (i / 10) * (graphWidth - 2 * padding)}
                  y1={padding}
                  x2={padding + (i / 10) * (graphWidth - 2 * padding)}
                  y2={graphHeight - padding}
                />
                <Line
                  x1={padding}
                  y1={padding + (i / 10) * (graphHeight - 2 * padding)}
                  x2={graphWidth - padding}
                  y2={padding + (i / 10) * (graphHeight - 2 * padding)}
                />
              </React.Fragment>
            ))}
          </G>
          
          {/* Center lines (X=0 and Y=0) */}
          {(() => {
            // Calculate where X=0 and Y=0 should be drawn
            const xZeroPos = padding + ((0 - displayXMin) / (displayXMax - displayXMin)) * (graphWidth - 2 * padding);
            const yZeroPos = padding + ((displayYMax - 0) / (displayYMax - displayYMin)) * (graphHeight - 2 * padding);
            
            return (
              <G stroke={colors.text} strokeWidth="1" opacity="0.6">
                {/* Y-axis (X=0 line) */}
                {xZeroPos >= padding && xZeroPos <= graphWidth - padding && (
                  <Line
                    x1={xZeroPos}
                    y1={padding}
                    x2={xZeroPos}
                    y2={graphHeight - padding}
                  />
                )}
                {/* X-axis (Y=0 line) */}
                {yZeroPos >= padding && yZeroPos <= graphHeight - padding && (
                  <Line
                    x1={padding}
                    y1={yZeroPos}
                    x2={graphWidth - padding}
                    y2={yZeroPos}
                  />
                )}
              </G>
            );
          })()}
          
          {/* Removed edge axes - only center lines are shown */}
          
          {/* Graph line */}
          <Polyline
            points={svgPoints}
            fill="none"
            stroke={colors.primary}
            strokeWidth="2"
          />
          
          {/* Data points - show more points for better visualization */}
          {graphData.filter((_, index) => index % 5 === 0).map((point, index) => {
            const x = padding + ((point.x - displayXMin) / (displayXMax - displayXMin)) * (graphWidth - 2 * padding);
            const y = padding + ((displayYMax - point.y) / (displayYMax - displayYMin)) * (graphHeight - 2 * padding);
            return (
              <Circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={colors.primary}
                opacity="0.7"
              />
            );
          })}
          
          {/* Labels */}
          {xAxisLabels}
          {yAxisLabels}
        </Svg>
        
      </View>
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
    rangeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rangeInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: BorderRadius.sm,
      paddingHorizontal: Spacing.sm,
      paddingVertical: Spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 4,
      textAlign: 'center',
      color: colors.text,
      fontSize: Typography.body.fontSize,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    buttonText: {
      color: colors.surface,
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
    graphContainer: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      marginBottom: Spacing.md,
      ...Shadows.sm,
    },
    graphTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: '600',
      marginBottom: Spacing.md,
      textAlign: 'center',
    },
    graph: {
      alignSelf: 'center',
    },
    toggleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    toggleText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
      justifyContent: 'center',
      paddingHorizontal: 2,
    },
    toggleActive: {
      backgroundColor: colors.primary,
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.surface,
      alignSelf: 'flex-start',
    },
    toggleThumbActive: {
      alignSelf: 'flex-end',
    },
    graphInstructions: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      marginBottom: Spacing.sm,
      fontStyle: 'italic',
    },
    resetButton: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      alignItems: 'center',
      marginTop: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Function Input</Text>
          <Text style={styles.inputLabel}>Enter Function (use &apos;x&apos; as variable)</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={functionInput}
              onChangeText={setFunctionInput}
              placeholder="e.g., x^2, sin(x), x^2 + 2*x + 1"
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <Text style={styles.helpText}>
            Supported functions: sin, cos, tan, log, sqrt, pow, abs, exp{'\n'}
            Use ^ for power (e.g., x^2) or ** (e.g., x**2)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>X Range</Text>
          <TouchableOpacity 
            style={styles.toggleContainer}
            onPress={() => setAutoXRange(!autoXRange)}
          >
            <Text style={styles.toggleText}>Auto-adjust X range</Text>
            <View style={[styles.toggle, autoXRange && styles.toggleActive]}>
              <View style={[styles.toggleThumb, autoXRange && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>
          {!autoXRange && (
          <View style={styles.rangeContainer}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMin}
                onChangeText={setXMin}
                placeholder="-10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={xMax}
                onChangeText={setXMax}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Y Range</Text>
          <TouchableOpacity 
            style={styles.toggleContainer}
            onPress={() => setAutoYRange(!autoYRange)}
          >
            <Text style={styles.toggleText}>Auto-adjust Y range</Text>
            <View style={[styles.toggle, autoYRange && styles.toggleActive]}>
              <View style={[styles.toggleThumb, autoYRange && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>
          {!autoYRange && (
          <View style={styles.rangeContainer}>
            <View style={{ flex: 1, marginRight: 4 }}>
              <Text style={styles.inputLabel}>Min</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMin}
                onChangeText={setYMin}
                placeholder="-10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 4 }}>
              <Text style={styles.inputLabel}>Max</Text>
              <TextInput
                style={styles.rangeInput}
                value={yMax}
                onChangeText={setYMax}
                placeholder="10"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
              />
            </View>
          </View>
          )}
        </View>
        
        {renderGraph()}

        <TouchableOpacity style={[styles.button, { marginBottom: 65 }]} onPress={generateGraphData}>
          <Text style={styles.buttonText}>Generate Graph</Text>
        </TouchableOpacity>


        {/* <TouchableOpacity style={[styles.backButton, { marginBottom: 65 }]} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back to Converter</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
};
