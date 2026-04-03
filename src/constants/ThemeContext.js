/**
 * ThemeContext.js — React context for light/dark theme switching and language.
 *
 * Provides a ThemeProvider component and a useTheme hook that exposes
 * the current color scheme (isDark), a toggle function, resolved color
 * tokens, platform-appropriate shadow styles, and i18n helpers.
 *
 * Preferences (dark mode & language) are persisted to AsyncStorage.
 *
 * @module ThemeContext
 * @exports ThemeProvider
 * @exports useTheme
 */

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LIGHT_COLORS, DARK_COLORS, SHADOWS } from './theme';
import { translations, translateCategory } from './i18n';

const ThemeContext = createContext();

const STORAGE_KEYS = {
  DARK_MODE: '@airhaven_dark_mode',
  LANGUAGE: '@airhaven_language',
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguageState] = useState('en'); // 'en' | 'fil'

  /* Load persisted preferences on mount */
  useEffect(() => {
    const load = async () => {
      try {
        const [darkVal, langVal] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        ]);
        if (darkVal !== null) setIsDark(darkVal === 'true');
        if (langVal !== null) setLanguageState(langVal);
      } catch {
        // Silently fall back to defaults
      }
    };
    load();
  }, []);

  /* Persist dark mode changes */
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, String(next)).catch(() => {});
      return next;
    });
  }, []);

  /* Persist language changes */
  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang).catch(() => {});
  }, []);

  /** Look up a translation key for the active language. */
  const t = useCallback(
    (key) => translations[language]?.[key] ?? translations.en[key] ?? key,
    [language],
  );

  /** Translate an AQI category object (label, description, advice). */
  const tCat = useCallback(
    (cat) => translateCategory(cat, t),
    [t],
  );

  const value = useMemo(() => ({
    isDark,
    toggleTheme,
    colors: isDark ? DARK_COLORS : LIGHT_COLORS,
    shadows: isDark
      ? { sm: { elevation: 0 }, md: { elevation: 0 }, lg: { elevation: 0 } }
      : SHADOWS,
    language,
    setLanguage,
    t,
    tCat,
  }), [isDark, toggleTheme, language, setLanguage, t, tCat]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
