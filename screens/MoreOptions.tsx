import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Shadows } from '../constants/theme';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export const MoreOptions: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const options = [
    { icon: '📋', text: 'History', screen: 'history' },
    { icon: '⚙️', text: 'Settings', screen: 'settings' },
    { icon: 'ℹ️', text: 'About', screen: 'about' },
  ];

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}` as any);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    optionsContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      // paddingTop: insets.top + 65 + 12, // Status bar + tab bar + 12px top padding
      paddingTop: 12,
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
        <View style={[styles.optionsList, { marginBottom: 155 }]}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionItem}
                onPress={() => handleNavigate(option.screen)}
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
