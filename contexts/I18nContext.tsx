import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n, { t as translate } from '../services/i18nService';

// Define the context type
interface I18nContextType {
  currentLanguage: string;
  setLanguage: (langCode: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

// Create the context with a default value
const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Props for the provider component
interface I18nProviderProps {
  children: ReactNode;
  initialLanguage?: string;
}

/**
 * Provider component for internationalization functionality
 * Provides translation functions and language switching capabilities
 */
export const I18nProvider: React.FC<I18nProviderProps> = ({ 
  children, 
  initialLanguage = 'en' 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState(initialLanguage);

  // Initialize the language on mount
  useEffect(() => {
    // Check if there's a stored language preference
    const storedLanguage = localStorage.getItem('water-classroom-language');
    if (storedLanguage) {
      i18n.setLanguage(storedLanguage);
      setCurrentLanguage(storedLanguage);
    } else {
      i18n.setLanguage(initialLanguage);
      setCurrentLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  // Function to change the current language
  const setLanguage = (langCode: string) => {
    i18n.setLanguage(langCode);
    setCurrentLanguage(langCode);
    localStorage.setItem('water-classroom-language', langCode);
  };

  // Value to be provided by the context
  const contextValue: I18nContextType = {
    currentLanguage,
    setLanguage,
    t: translate
  };

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
};

/**
 * Hook for accessing the i18n functionality
 * @returns The i18n context value
 * @throws Error if used outside of I18nProvider
 */
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

/**
 * Convenience hook that returns just the translation function
 * @returns The translation function
 */
export const useTranslation = (): ((key: string, vars?: Record<string, string | number>) => string) => {
  return useI18n().t;
};
