import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Share } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useHistory } from '../contexts/HistoryContext';
import { Typography, Shadows } from '../constants/theme';
// import { captureRef } from 'react-native-view-shot';
// import * as MediaLibrary from 'expo-media-library';

export const HistoryScreen: React.FC = () => {
  const { colors } = useTheme();
  const { history, clearHistory, removeFromHistory } = useHistory();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all calculation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearHistory }
      ]
    );
  };

  const handleRemoveItem = (id: string) => {
    removeFromHistory(id);
  };

  const handleItemPress = (id: string) => {
    if (isSelectionMode) {
      const newSelected = new Set(selectedItems);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      setSelectedItems(newSelected);
      
      if (newSelected.size === 0) {
        setIsSelectionMode(false);
      }
    }
  };

  const handleLongPress = (id: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedItems(new Set([id]));
    }
  };

  const handleShareHistory = async () => {
    if (selectedItems.size === 0) return;

    try {
      const selectedHistory = history.filter(item => selectedItems.has(item.id));
      const shareText = selectedHistory
      .slice().reverse().map(item => {  // Reverse the order of the items
      // .map(item => { 
          const expression = item.calculation.includes(' = ') 
            ? item.calculation.split(' = ')[0] 
            : item.calculation;
          return `${expression} \n= ${item.result}`;
        })
        .join('\n\n');

      await Share.share({
        message: `My Calculator History:\n\n${shareText}`,
        title: 'Calculator History'
      });
    } catch (error) {
      console.error('Error sharing history:', error);
      Alert.alert('Error', 'Failed to share history');
    }
  };

  const handleClearSelection = () => {
    setSelectedItems(new Set());
    setIsSelectionMode(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    historyScreenContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
    },
    historyList: {
      gap: 8, // 8px gap between items
      paddingTop: 12, // 12px top padding to match bottom padding
      paddingBottom: 12, // 12px bottom padding to match top padding
    },
    historyItem: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      borderLeftWidth: 3, // 3px left border
      borderLeftColor: colors.primary,
      flexDirection: 'row',
      alignItems: 'center',
      ...Shadows.sm,
    },
    historyCalculation: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      marginBottom: 2, // 2px margin bottom
    },
    historyResult: {
      color: colors.primary,
      fontSize: Typography.bodyBold.fontSize,
      fontWeight: '600',
      marginBottom: 2, // 2px margin bottom
    },
    historyTime: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      fontWeight: '400',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    emptyStateText: {
      color: colors.textSecondary,
      fontSize: Typography.body.fontSize,
      textAlign: 'center',
      marginBottom: 20,
    },
    clearButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      marginHorizontal: 10,
      marginTop: 16,
      marginBottom: 5,
    },
    clearButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: colors.error || '#FF3B30',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      marginLeft: 12,
    },
    deleteButtonText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    historyItemContent: {
      flex: 1,
    },
    historyItemActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    selectedItem: {
      backgroundColor: colors.primary + '20',
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
    },
    selectionButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      marginHorizontal: 8,
    },
    selectionButtonText: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '600',
    },
    selectionBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
  });

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No calculations yet.{'\n'}Start calculating to see your history here.
          </Text>
        </View>
      ) : (
        <>
          {isSelectionMode && (
            <View style={styles.selectionBar}>
              <Text style={styles.selectionButtonText}>
                {selectedItems.size} selected
              </Text>
              <View style={styles.historyItemActions}>
                <TouchableOpacity 
                  style={styles.selectionButton} 
                  onPress={handleShareHistory}
                >
                  <Text style={styles.selectionButtonText}>Share</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.selectionButton, { backgroundColor: colors.error }]} 
                  onPress={handleClearSelection}
                >
                  <Text style={styles.selectionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {!isSelectionMode && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
              <Text style={styles.clearButtonText}>Clear All History</Text>
            </TouchableOpacity>
          )}
          
          <ScrollView style={styles.historyScreenContainer} showsVerticalScrollIndicator={false}>
            <View style={[styles.historyList, { marginBottom: 65 }]}>
              {history.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={[
                    styles.historyItem,
                    selectedItems.has(item.id) && styles.selectedItem
                  ]}
                  onPress={() => handleItemPress(item.id)}
                  onLongPress={() => handleLongPress(item.id)}
                >
                  <View style={styles.historyItemContent}>
                    <Text style={styles.historyCalculation}>
                      {item.calculation.includes(' = ') 
                        ? item.calculation.split(' = ')[0] 
                        : item.calculation
                      }
                    </Text>
                    <Text style={styles.historyResult}>= {item.result}</Text>
                    <Text style={styles.historyTime}>{formatTime(item.timestamp)}</Text>
                  </View>
                  {!isSelectionMode && (
                    <View style={styles.historyItemActions}>
                      <TouchableOpacity 
                        style={styles.deleteButton} 
                        onPress={() => handleRemoveItem(item.id)}
                      >
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};
