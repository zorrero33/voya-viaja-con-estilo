import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, CurrencyCode } from '../types';
import { translations, TranslationDictionary } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  t: (key: keyof TranslationDictionary) => string;
  formatMoney: (amountInEur: number) => string;
  isRtl: boolean;
  rates: Record<CurrencyCode, number>;
}

const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  EUR: 1.0,
  USD: 1.08,
  GBP: 0.85,
  JPY: 164.5,
  AED: 3.97,
  CAD: 1.49,
  CHF: 0.95,
  MXN: 21.8
};

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  JPY: '¥',
  AED: 'د.إ',
  CAD: 'C$',
  CHF: 'CHF',
  MXN: 'Mex$'
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('es');
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');

  const isRtl = language === 'ar';

  useEffect(() => {
    // Update HTML dir and lang attributes
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.es;
    return dict[key] || translations.es[key] || String(key);
  };

  const formatMoney = (amountInEur: number): string => {
    const rate = EXCHANGE_RATES[currency] || 1;
    const converted = amountInEur * rate;
    const symbol = CURRENCY_SYMBOLS[currency] || currency;

    if (currency === 'JPY') {
      return `${Math.round(converted).toLocaleString()} ${symbol}`;
    }
    if (currency === 'AED') {
      return `${converted.toFixed(1)} ${symbol}`;
    }
    return `${converted.toFixed(2)} ${symbol}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        formatMoney,
        isRtl,
        rates: EXCHANGE_RATES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
