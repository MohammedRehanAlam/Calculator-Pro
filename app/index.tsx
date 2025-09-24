import React, { useState } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SafeAreaWrapper } from '../components/SafeAreaWrapper';
import { NavigationHeader } from '../components/NavigationHeader';
import { ScreenManager } from '../components/ScreenManager';

export default function CalculatorApp() {
  const [activeScreen, setActiveScreen] = useState('calculator');

  const handleScreenChange = (screen: string) => {
    setActiveScreen(screen);
  };

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen);
  };

  return (
    <ThemeProvider>
      <SafeAreaWrapper>
        <NavigationHeader 
          activeScreen={activeScreen} 
          onScreenChange={handleScreenChange} 
        />
        <ScreenManager 
          activeScreen={activeScreen} 
          onNavigate={handleNavigate} 
        />
      </SafeAreaWrapper>
    </ThemeProvider>
  );
}
