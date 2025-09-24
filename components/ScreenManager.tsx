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
import { LengthConverter } from '../screens/LengthConverter';
import { TemperatureConverter } from '../screens/TemperatureConverter';
import { WeightConverter } from '../screens/WeightConverter';
import { AreaConverter } from '../screens/AreaConverter';
import { SpeedConverter } from '../screens/SpeedConverter';
import { DataConverter } from '../screens/DataConverter';
import { AgeConverter } from '../screens/AgeConverter';
import { BMIConverter } from '../screens/BMIConverter';
import { DateConverter } from '../screens/DateConverter';
import { DiscountConverter } from '../screens/DiscountConverter';
import { NumeralConverter } from '../screens/NumeralConverter';
import { TimeConverter } from '../screens/TimeConverter';
import { GSTCalculator } from '../screens/GSTCalculator';
import { CurrencyCalculator } from '../screens/CurrencyCalculator';
import { InvestmentCalculator } from '../screens/InvestmentCalculator';
import { LoanCalculator } from '../screens/LoanCalculator';
import { MortgageCalculator } from '../screens/MortgageCalculator';
import { CreditCalculator } from '../screens/CreditCalculator';

interface ScreenManagerProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
}

export const ScreenManager: React.FC<ScreenManagerProps> = ({ activeScreen, onNavigate }) => {
  switch (activeScreen) {
    case 'calculator':
      return <BasicCalculator />;
    case 'converter':
      return <UnitConverter onNavigate={onNavigate} />;
    case 'financial':
      return <FinancialCalculator onNavigate={onNavigate} />;
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
    // Converter screens
    case 'age-converter':
      return <AgeConverter />;
    case 'area-converter':
      return <AreaConverter />;
    case 'bmi-converter':
      return <BMIConverter />;
    case 'data-converter':
      return <DataConverter />;
    case 'date-converter':
      return <DateConverter />;
    case 'discount-converter':
      return <DiscountConverter />;
    case 'length-converter':
      return <LengthConverter />;
    case 'numeral-converter':
      return <NumeralConverter />;
    case 'speed-converter':
      return <SpeedConverter />;
    case 'temperature-converter':
      return <TemperatureConverter />;
    case 'time-converter':
      return <TimeConverter />;
    case 'weight-converter':
      return <WeightConverter />;
    // Financial calculator screens
    case 'gst-calculator':
      return <GSTCalculator />;
    case 'currency-calculator':
      return <CurrencyCalculator />;
    case 'investment-calculator':
      return <InvestmentCalculator />;
    case 'loan-calculator':
      return <LoanCalculator />;
    case 'mortgage-calculator':
      return <MortgageCalculator />;
    case 'credit-calculator':
      return <CreditCalculator />;
    default:
      return <BasicCalculator />;
  }
};
