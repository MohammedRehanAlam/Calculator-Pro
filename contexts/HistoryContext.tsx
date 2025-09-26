import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HistoryItem {
  id: string;
  calculation: string;
  result: string;
  timestamp: number;
  type: 'basic' | 'scientific' | 'converter' | 'financial';
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'calculator_history';
const MAX_HISTORY_ITEMS = 100;

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from storage on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Save history to storage whenever it changes
  useEffect(() => {
    saveHistory();
  }, [history]);

  const loadHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveHistory = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory];
      // Keep only the most recent MAX_HISTORY_ITEMS
      return updatedHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
  };

  const value: HistoryContextType = {
    history,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
