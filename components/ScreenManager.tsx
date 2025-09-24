import React from 'react';
import { BasicCalculator } from '../screens/BasicCalculator';
import { UnitConverter } from '../screens/UnitConverter';
import { FinancialCalculator } from '../screens/FinancialCalculator';
import { MoreOptions } from '../screens/MoreOptions';
import { HistoryScreen } from '../screens/HistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ResetScreen } from '../screens/ResetScreen';
import { ExportScreen } from '../screens/ExportScreen';

interface ScreenManagerProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const ScreenManager: React.FC<ScreenManagerProps> = ({ activeScreen, onNavigate }) => {
  switch (activeScreen) {
    case 'calculator':
      return <BasicCalculator />;
    case 'converter':
      return <UnitConverter />;
    case 'financial':
      return <FinancialCalculator />;
    case 'more':
      return <MoreOptions onNavigate={onNavigate} />;
    case 'history':
      return <HistoryScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'about':
      return <AboutScreen />;
    case 'reset':
      return <ResetScreen />;
    case 'export':
      return <ExportScreen />;
    default:
      return <BasicCalculator />;
  }
};
