import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows } from '../constants/theme';

const { width: screenWidth } = Dimensions.get('window');

interface NavigationHeaderProps {
  activeScreen: string;
  onScreenChange: (screen: string) => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ 
  activeScreen, 
  onScreenChange 
}) => {
  const { colors } = useTheme();

  const navigationItems = [
    { id: 'calculator', icon: '☰', label: 'Calculator' },
    { id: 'converter', icon: '⊞', label: 'Converter' },
    { id: 'financial', icon: '$', label: 'Financial' },
    { id: 'more', icon: '⋮', label: 'More' },
  ];

  return (
    <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {navigationItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.headerButton,
            activeScreen === item.id && { backgroundColor: colors.primary },
            activeScreen === item.id && Shadows.md,
          ]}
          onPress={() => onScreenChange(item.id)}
        >
          <Text style={[styles.headerIcon, { color: colors.text }]}>
            {item.icon}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12, // 12px horizontal padding
    paddingVertical: 8, // 8px vertical padding
    // borderBottomWidth: 1,
  },
  headerButton: {
    padding: 4, // 4px padding
    borderRadius: 8, // 8px border radius
    minWidth: 40, // 40px minimum width
    minHeight: 40, // 40px minimum height
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 18, // 18px font size
    fontWeight: '600',
  },
});
