import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface MoreOptionsProps {
  onNavigate: (screen: string) => void;
}

export const MoreOptions: React.FC<MoreOptionsProps> = ({ onNavigate }) => {
  const { colors } = useTheme();

  const options = [
    { icon: '📋', text: 'History', screen: 'history' },
    { icon: '⚙️', text: 'Settings', screen: 'settings' },
    { icon: 'ℹ️', text: 'About', screen: 'about' },
    { icon: '🔄', text: 'Reset', screen: 'reset' },
    { icon: '📤', text: 'Export', screen: 'export' },
  ];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    optionsContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    optionsList: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      overflow: 'hidden',
      ...Shadows.sm,
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12, // 12px padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionIcon: {
      fontSize: 20, // 20px font size
      marginRight: 8, // 8px margin right
    },
    optionText: {
      flex: 1,
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
    },
    optionArrow: {
      color: colors.textSecondary,
      fontSize: 18, // 18px font size
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.optionsList}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
              onPress={() => onNavigate(option.screen)}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={styles.optionText}>{option.text}</Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
