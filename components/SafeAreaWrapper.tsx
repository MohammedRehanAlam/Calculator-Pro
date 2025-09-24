import React from 'react';
import { View, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: any;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({ 
  children, 
  edges = ['top', 'bottom'],
  style 
}) => {
  const { colors } = useTheme();

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: colors.background }, style]}
      edges={edges}
    >
      <StatusBar 
        barStyle={colors.text === '#FFFFFF' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <View style={[styles.contentContainer, { backgroundColor: colors.background }]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});
