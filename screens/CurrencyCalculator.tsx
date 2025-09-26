import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { Typography, Shadows } from '../constants/theme';
import { router } from 'expo-router';

// Storage keys for persistence
  const STORAGE_KEYS = {
    AMOUNT: 'currency_amount',
    FROM_CURRENCY: 'currency_from',
    TO_CURRENCY: 'currency_to',
    EXCHANGE_RATES: 'currency_rates',
    LAST_UPDATED: 'currency_last_updated',
    FROM_SEARCH: 'currency_from_search',
    TO_SEARCH: 'currency_to_search',
    CACHE_CURRENCY: 'currency_cache_base', // Track which currency the cache is for
  };

// Cache duration: 24 hours (86400000 ms)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const CurrencyCalculator: React.FC = () => {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [fromSearchQuery, setFromSearchQuery] = useState('');
  const [toSearchQuery, setToSearchQuery] = useState('');

  const currencies = useMemo(() => [
    { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', country: 'India' },
    { code: 'EUR', name: 'Euro', symbol: '€', country: 'European Union' },
    { code: 'GBP', name: 'British Pound', symbol: '£', country: 'United Kingdom' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', country: 'Japan' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', country: 'Canada' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', country: 'Australia' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', country: 'Switzerland' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', country: 'China' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', country: 'Singapore' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', country: 'United Arab Emirates' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', country: 'Saudi Arabia' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', country: 'South Korea' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿', country: 'Thailand' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', country: 'Malaysia' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', country: 'Indonesia' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱', country: 'Philippines' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', country: 'Vietnam' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', country: 'Brazil' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', country: 'Mexico' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', country: 'South Africa' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽', country: 'Russia' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', country: 'Turkey' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', country: 'Poland' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', country: 'Czech Republic' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', country: 'Hungary' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei', country: 'Romania' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', country: 'Bulgaria' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn', country: 'Croatia' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', country: 'Sweden' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', country: 'Norway' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr', country: 'Denmark' },
    { code: 'ISK', name: 'Icelandic Krona', symbol: 'kr', country: 'Iceland' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', country: 'New Zealand' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', country: 'Israel' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', country: 'Qatar' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', country: 'Kuwait' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', country: 'Bahrain' },
    { code: 'OMR', name: 'Omani Rial', symbol: '﷼', country: 'Oman' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا', country: 'Jordan' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل', country: 'Lebanon' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: '£', country: 'Egypt' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م.', country: 'Morocco' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت', country: 'Tunisia' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج', country: 'Algeria' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'ل.د', country: 'Libya' },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س.', country: 'Sudan' },
    { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', country: 'Ethiopia' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', country: 'Kenya' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', country: 'Uganda' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', country: 'Tanzania' },
    { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', country: 'Zambia' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P', country: 'Botswana' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', country: 'Nigeria' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', country: 'Ghana' },
    { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', country: 'West Africa' },
    { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', country: 'Central Africa' },
    { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', country: 'Democratic Republic of Congo' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', country: 'Angola' },
    { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', country: 'Mozambique' },
    { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', country: 'Sierra Leone' },
    { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', country: 'Liberia' },
    { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', country: 'Gambia' },
    { code: 'GNF', name: 'Guinean Franc', symbol: 'FG', country: 'Guinea' },
    { code: 'SHP', name: 'Saint Helena Pound', symbol: '£', country: 'Saint Helena' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', country: 'Seychelles' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', country: 'Mauritius' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', country: 'Comoros' },
    { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', country: 'Djibouti' },
    { code: 'SOS', name: 'Somali Shilling', symbol: 'S', country: 'Somalia' },
    { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', country: 'Eritrea' }
  ], []);

  // Storage functions
  const saveToStorage = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  };

  const loadFromStorage = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error loading from storage:', error);
      return null;
    }
  };

  const isCacheValid = useCallback((lastUpdatedTime: string) => {
    if (!lastUpdatedTime) {
      console.log('❌ No cache timestamp found');
      return false;
    }
    
    try {
      const cacheTime = new Date(lastUpdatedTime).getTime();
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - cacheTime;
      const isValid = timeDiff < CACHE_DURATION;
      
      console.log(`🕒 Cache age: ${Math.round(timeDiff / (1000 * 60 * 60))} hours (${isValid ? 'valid' : 'expired'})`);
      return isValid;
    } catch (error) {
      console.log('❌ Error parsing cache timestamp:', error);
      return false;
    }
  }, []);

  // Load saved data on component mount
  const loadSavedData = useCallback(async () => {
    try {
      const savedAmount = await loadFromStorage(STORAGE_KEYS.AMOUNT);
      const savedFromCurrency = await loadFromStorage(STORAGE_KEYS.FROM_CURRENCY);
      const savedToCurrency = await loadFromStorage(STORAGE_KEYS.TO_CURRENCY);
      const savedRates = await loadFromStorage(STORAGE_KEYS.EXCHANGE_RATES);
      const savedLastUpdated = await loadFromStorage(STORAGE_KEYS.LAST_UPDATED);
      const savedFromSearch = await loadFromStorage(STORAGE_KEYS.FROM_SEARCH);
      const savedToSearch = await loadFromStorage(STORAGE_KEYS.TO_SEARCH);

      // Load saved values (set all at once to prevent flickering)
      setAmount(savedAmount || '');
      setFromCurrency(savedFromCurrency || 'USD');
      setToCurrency(savedToCurrency || 'INR');
      setFromSearchQuery(savedFromSearch || '');
      setToSearchQuery(savedToSearch || '');

              // Load cached rates if valid (24 hours cache)
              if (savedRates && savedLastUpdated) {
                const cachedCurrency = await loadFromStorage(STORAGE_KEYS.CACHE_CURRENCY);
                if (isCacheValid(savedLastUpdated) && cachedCurrency === (savedFromCurrency || 'USD')) {
                  setExchangeRates(savedRates);
                  setLastUpdated(savedLastUpdated);
                  console.log(`✅ Using cached exchange rates for ${cachedCurrency} (24-hour cache)`);
                  return true; // Cache is valid, no need to fetch
                } else {
                  console.log('🔄 Cache expired or for different currency, will fetch fresh rates');
                }
              } else {
                console.log('🔄 No cache found, will fetch fresh rates');
              }

      return false; // Cache is invalid or doesn't exist
    } catch (error) {
      console.error('Error loading saved data:', error);
      return false;
    }
  }, [isCacheValid]);

  // Save current state to storage
  const saveCurrentState = async (currentAmount?: string, currentFromCurrency?: string, currentToCurrency?: string, currentFromSearch?: string, currentToSearch?: string) => {
    await Promise.all([
      saveToStorage(STORAGE_KEYS.AMOUNT, currentAmount !== undefined ? currentAmount : amount),
      saveToStorage(STORAGE_KEYS.FROM_CURRENCY, currentFromCurrency !== undefined ? currentFromCurrency : fromCurrency),
      saveToStorage(STORAGE_KEYS.TO_CURRENCY, currentToCurrency !== undefined ? currentToCurrency : toCurrency),
      saveToStorage(STORAGE_KEYS.FROM_SEARCH, currentFromSearch !== undefined ? currentFromSearch : fromSearchQuery),
      saveToStorage(STORAGE_KEYS.TO_SEARCH, currentToSearch !== undefined ? currentToSearch : toSearchQuery),
    ]);
  };

  // Save exchange rates to storage
  const saveExchangeRates = useCallback(async (rates: { [key: string]: number }, timestamp: string, baseCurrency: string) => {
    await Promise.all([
      saveToStorage(STORAGE_KEYS.EXCHANGE_RATES, rates),
      saveToStorage(STORAGE_KEYS.LAST_UPDATED, timestamp),
      saveToStorage(STORAGE_KEYS.CACHE_CURRENCY, baseCurrency),
    ]);
  }, []);

  // Fetch live exchange rates from multiple free APIs (in descending order of free requests)
  const fetchExchangeRates = useCallback(async (forceRefresh = false, targetCurrency?: string) => {
    const currencyToFetch = targetCurrency || fromCurrency;
    
    // Check if we should use cached data (24-hour cache)
    if (!forceRefresh) {
      const cachedRates = await loadFromStorage(STORAGE_KEYS.EXCHANGE_RATES);
      const cachedLastUpdated = await loadFromStorage(STORAGE_KEYS.LAST_UPDATED);
      const cachedCurrency = await loadFromStorage(STORAGE_KEYS.CACHE_CURRENCY);
      
      // Only use cache if it's for the same currency and still valid
      if (cachedRates && cachedLastUpdated && cachedCurrency === currencyToFetch && isCacheValid(cachedLastUpdated)) {
        console.log(`✅ Using cached exchange rates for ${currencyToFetch} (24-hour cache, no API call needed)`);
        setExchangeRates(cachedRates);
        setLastUpdated(cachedLastUpdated);
        return;
      } else if (cachedCurrency !== currencyToFetch) {
        console.log(`🔄 Cache is for ${cachedCurrency}, but we need ${currencyToFetch} - fetching new rates`);
      }
    }

    setLoading(true);
    console.log(`🔄 Fetching fresh exchange rates from API for ${currencyToFetch}...`);
    
    // List of free APIs in descending order of reliability and features
    const freeAPIs = [
      // 1. Frankfurter: Completely free, no limits, ECB data, updates daily at 16:00 CET
      {
        url: `https://api.frankfurter.app/latest?from=${currencyToFetch}`,
        parser: (data: any) => data.rates
      },
      // 2. ExchangeRate-API: 1,500 requests/month (no API key)
      {
        url: `https://api.exchangerate-api.com/v4/latest/${currencyToFetch}`,
        parser: (data: any) => data.rates
      },
      // 3. Currency-API: 1,000 requests/month (no API key)
      {
        url: `https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${currencyToFetch.toLowerCase()}.json`,
        parser: (data: any) => data[currencyToFetch.toLowerCase()]
      },
      // 4. Fixer.io: 100 requests/month (requires API key - using free tier)
      {
        url: `http://data.fixer.io/api/latest?access_key=YOUR_FREE_API_KEY&base=${currencyToFetch}`,
        parser: (data: any) => data.rates
      },
      // 5. CurrencyLayer: 1,000 requests/month (requires API key - using free tier)
      {
        url: `http://api.currencylayer.com/live?access_key=YOUR_FREE_API_KEY&currencies=${currencies.map(c => c.code).join(',')}`,
        parser: (data: any) => data.quotes
      },
      // 6. Open Exchange Rates: 1,000 requests/month (requires API key - using free tier)
      {
        url: `https://openexchangerates.org/api/latest.json?app_id=YOUR_FREE_API_KEY&base=${currencyToFetch}`,
        parser: (data: any) => data.rates
      }
    ];
    
    let ratesFound = false;
    
    // Try each API in order
    for (const api of freeAPIs) {
      try {
        console.log(`Trying API: ${api.url}`);
        const response = await fetch(api.url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        const rates = api.parser(data);
        
        if (rates && typeof rates === 'object') {
          console.log(`✅ Successfully fetched rates from: ${api.url}`);
          const timestamp = new Date().toLocaleTimeString();
          setExchangeRates(rates);
          setLastUpdated(timestamp);
                  await saveExchangeRates(rates, timestamp, currencyToFetch);
          ratesFound = true;
          break; // 🛑 STOP HERE - Don't try other APIs
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.log(`API failed: ${api.url} - ${error}`);
        continue;
      }
    }
    
    // If all APIs fail, use fallback rates
    if (!ratesFound) {
      console.log('All APIs failed, using fallback rates');
      Alert.alert(
        'Connection Error',
        'Unable to fetch live exchange rates. Using cached rates.',
        [{ text: 'OK' }]
      );
      
      // Fallback rates (updated regularly - comprehensive global coverage)
      const fallbackRates: { [key: string]: number } = {
        // Major currencies
        USD: 1.0000,
        EUR: 0.9200,
        GBP: 0.7900,
        JPY: 149.5000,
        CHF: 0.8800,
        CAD: 1.3600,
        AUD: 1.5200,
        NZD: 1.6200,
        
        // Asian currencies
        INR: 83.2500,
        CNY: 7.2500,
        KRW: 1300.0000,
        SGD: 1.3500,
        THB: 35.5000,
        MYR: 4.6500,
        IDR: 15500.0000,
        PHP: 55.8000,
        VND: 24000.0000,
        
        // Middle East currencies
        AED: 3.6700,
        SAR: 3.7500,
        QAR: 3.6400,
        KWD: 0.3100,
        BHD: 0.3800,
        OMR: 0.3850,
        JOD: 0.7100,
        LBP: 1500.0000,
        ILS: 3.6500,
        
        // African currencies
        EGP: 30.8000,
        MAD: 10.2000,
        TND: 3.1000,
        DZD: 134.0000,
        LYD: 4.8500,
        SDG: 600.0000,
        ETB: 55.0000,
        KES: 160.0000,
        UGX: 3700.0000,
        TZS: 2500.0000,
        ZMW: 25.0000,
        BWP: 13.5000,
        NGN: 800.0000,
        GHS: 12.0000,
        XOF: 600.0000,
        XAF: 600.0000,
        CDF: 2500.0000,
        AOA: 830.0000,
        MZN: 64.0000,
        SLL: 22000.0000,
        LRD: 185.0000,
        GMD: 65.0000,
        GNF: 8600.0000,
        SHP: 0.7900,
        SCR: 13.5000,
        MUR: 45.0000,
        KMF: 450.0000,
        DJF: 178.0000,
        SOS: 570.0000,
        ERN: 15.0000,
        
        // European currencies
        PLN: 4.0500,
        CZK: 23.2000,
        HUF: 360.0000,
        RON: 4.5500,
        BGN: 1.8000,
        HRK: 6.8500,
        SEK: 10.8000,
        NOK: 10.5000,
        DKK: 6.8500,
        ISK: 140.0000,
        
        // Americas currencies
        BRL: 5.1000,
        MXN: 17.2000,
        
        // Other major currencies
        ZAR: 18.5000,
        RUB: 90.0000,
        TRY: 30.5000
      };
      
      setExchangeRates(fallbackRates);
      setLastUpdated('Fallback rates');
    }
    
    setLoading(false);
  }, [fromCurrency, saveExchangeRates, currencies, isCacheValid]);

  // Load saved data and fetch rates on component mount
  useEffect(() => {
    const initializeData = async () => {
      const cacheValid = await loadSavedData();
      // Only fetch if cache is invalid (24-hour cache)
      if (!cacheValid) {
        await fetchExchangeRates();
      }
    };
    initializeData();
  }, [fetchExchangeRates, loadSavedData]);

  // No automatic fetching on currency change - only when user manually changes currency

  // Filter currencies based on search query
  const filterCurrencies = (query: string) => {
    if (!query.trim()) return currencies;
    
    const lowercaseQuery = query.toLowerCase();
    return currencies.filter(currency => 
      currency.code.toLowerCase().includes(lowercaseQuery) ||
      currency.name.toLowerCase().includes(lowercaseQuery) ||
      currency.country.toLowerCase().includes(lowercaseQuery) ||
      currency.symbol.toLowerCase().includes(lowercaseQuery)
    );
  };

  const filteredFromCurrencies = filterCurrencies(fromSearchQuery);
  const filteredToCurrencies = filterCurrencies(toSearchQuery);

  // Individual save functions for immediate state changes
  const handleAmountChange = (newAmount: string) => {
    setAmount(newAmount);
    saveCurrentState(newAmount, undefined, undefined, undefined, undefined);
  };

  const handleFromCurrencyChange = (newFromCurrency: string) => {
    setFromCurrency(newFromCurrency);
    saveCurrentState(undefined, newFromCurrency, undefined, undefined, undefined);
    // Auto-fetch rates for the new currency to ensure accurate conversions
    console.log(`🔄 From currency changed to: ${newFromCurrency} - fetching rates...`);
    fetchExchangeRates(false, newFromCurrency);
  };

  const handleToCurrencyChange = (newToCurrency: string) => {
    setToCurrency(newToCurrency);
    saveCurrentState(undefined, undefined, newToCurrency, undefined, undefined);
  };

  const handleFromSearchChange = (newFromSearch: string) => {
    setFromSearchQuery(newFromSearch);
    saveCurrentState(undefined, undefined, undefined, newFromSearch, undefined);
  };

  const handleToSearchChange = (newToSearch: string) => {
    setToSearchQuery(newToSearch);
    saveCurrentState(undefined, undefined, undefined, undefined, newToSearch);
  };

  // Manual refresh function for current currency
  const handleManualRefresh = () => {
    console.log(`🔄 Manual refresh requested for ${fromCurrency}`);
    fetchExchangeRates(true, fromCurrency);
  };

  const convertCurrency = () => {
    if (!amount || isNaN(Number(amount))) return '0';
    
    const amountValue = Number(amount);
    const rate = exchangeRates[toCurrency] || 1;
    const convertedAmount = amountValue * rate;
    
    return convertedAmount.toFixed(2);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 12, // 12px horizontal padding
      paddingVertical: 8, // 8px vertical padding
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    screenTitle: {
      color: colors.text,
      fontSize: Typography.h4.fontSize,
      fontWeight: Typography.h4.fontWeight,
    },
    backButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 8, // 8px horizontal padding
      paddingVertical: 4, // 4px vertical padding
      borderRadius: 8, // 8px border radius
    },
    backButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: Typography.captionBold.fontWeight,
    },
    calculatorContainer: {
      flex: 1,
      paddingHorizontal: 12, // 12px horizontal padding
      paddingTop: 12, // 12px top padding
      paddingBottom: 16, // 16px bottom padding for scroll clearance
    },
    inputSection: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    inputLabel: {
      color: colors.text,
      fontSize: Typography.body.fontSize,
      fontWeight: '500',
      marginBottom: 8, // 8px margin bottom
    },
    inputField: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 12, // 12px padding
      fontSize: Typography.body.fontSize,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    currencySelector: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      maxHeight: 280, // Maximum height for currency grid
      ...Shadows.sm,
    },
    currencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    currencyScrollView: {
      maxHeight: 280, // 200px - 24px padding = 176px for scrollable area
    },
    searchInput: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      fontSize: Typography.caption.fontSize,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 8, // 8px margin bottom
    },
    currencyButton: {
      backgroundColor: colors.background,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginBottom: 8, // 8px margin bottom
      width: '48%',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor: colors.border,
    },
    currencyButtonSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    currencyButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
      marginBottom: 2, // 2px margin bottom
    },
    currencyButtonTextSelected: {
      color: colors.text,
    },
    currencyCountryText: {
      color: colors.textSecondary,
      fontSize: 10, // Smaller font size for country
      fontWeight: '400',
    },
    resultSection: {
      backgroundColor: colors.surface,
      borderRadius: 12, // 12px border radius
      padding: 12, // 12px padding
      marginBottom: 12, // 12px margin bottom
      ...Shadows.sm,
    },
    resultText: {
      color: colors.primary,
      fontSize: Typography.h3.fontSize,
      fontWeight: '600',
      textAlign: 'center',
    },
    resultLabel: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      marginBottom: 8, // 8px margin bottom
    },
    rateInfo: {
      backgroundColor: colors.surfaceSecondary,
      borderRadius: 8, // 8px border radius
      padding: 8, // 8px padding
      marginTop: 8, // 8px margin top
    },
    rateText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
    },
    refreshButton: {
      backgroundColor: colors.primary,
      borderRadius: 8, // 8px border radius
      padding: 4, // 8px padding
      marginRight: 8, // 8px margin left
    },
    refreshButtonText: {
      color: colors.text,
      fontSize: Typography.caption.fontSize,
      fontWeight: '600',
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    lastUpdatedText: {
      color: colors.textSecondary,
      fontSize: Typography.caption.fontSize,
      textAlign: 'center',
      marginTop: 4, // 4px margin top
    },
  });

  const result = convertCurrency();
  const rate = exchangeRates[toCurrency] || 1;

  return (
    <View style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>Currency Calculator</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={handleManualRefresh}
            disabled={loading}
          >
            <Text style={styles.refreshButtonText}>
              {loading ? '...' : '🔄'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.calculatorContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.currencySelector}>
            <Text style={styles.inputLabel}>From Currency</Text>
            <TextInput
              style={styles.searchInput}
              value={fromSearchQuery}
              onChangeText={handleFromSearchChange}
              placeholder="Search currency..."
              placeholderTextColor={colors.textSecondary}
            />
            <ScrollView 
                style={styles.currencyScrollView}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                <View style={styles.currencyGrid}>
                    {filteredFromCurrencies.map((currency, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                        styles.currencyButton,
                        fromCurrency === currency.code && styles.currencyButtonSelected
                        ]}
                        onPress={() => handleFromCurrencyChange(currency.code)}
                    >
                        <Text style={[
                        styles.currencyButtonText,
                        fromCurrency === currency.code && styles.currencyButtonTextSelected
                        ]}>
                        {currency.code} {currency.symbol}
                        </Text>
                        <Text style={styles.currencyCountryText}>
                        {currency.country}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
        
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Enter Amount</Text>
          <TextInput
            style={styles.inputField}
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="Enter amount"
            placeholderTextColor={colors.textSecondary}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.currencySelector}>
          <Text style={styles.inputLabel}>To Currency</Text>
          <TextInput
            style={styles.searchInput}
            value={toSearchQuery}
            onChangeText={handleToSearchChange}
            placeholder="Search currency..."
            placeholderTextColor={colors.textSecondary}
          />
          <ScrollView 
            style={styles.currencyScrollView}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View style={styles.currencyGrid}>
              {filteredToCurrencies.map((currency, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.currencyButton,
                    toCurrency === currency.code && styles.currencyButtonSelected
                  ]}
                  onPress={() => handleToCurrencyChange(currency.code)}
                >
                  <Text style={[
                    styles.currencyButtonText,
                    toCurrency === currency.code && styles.currencyButtonTextSelected
                  ]}>
                    {currency.code} {currency.symbol}
                  </Text>
                  <Text style={styles.currencyCountryText}>
                    {currency.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={[styles.resultSection, { marginBottom: 65 }]}>
          <Text style={styles.resultLabel}>Converted Amount</Text>
          <Text style={styles.resultText}>
            {currencies.find(c => c.code === toCurrency)?.symbol}{result}
          </Text>
          <View style={styles.rateInfo}>
            <Text style={styles.rateText}>
              1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
            </Text>
            {loading && <Text style={styles.loadingText}>Updating rates...</Text>}
            {lastUpdated && !loading && (
              <Text style={styles.lastUpdatedText}>
                Last updated: {lastUpdated}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
