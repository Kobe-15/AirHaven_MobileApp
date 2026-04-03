/**
 * App.js — Root application component for AirHaven.
 *
 * Manages top-level navigation state between Onboarding, Splash, and
 * MainDashboard screens. Wraps the entire tree in gesture-handler,
 * safe-area, theme providers, and an error boundary.
 *
 * Flow:
 *   1. First launch  → OnboardingScreen → SplashScreen → MainDashboard
 *   2. Returning user → SplashScreen → MainDashboard
 *
 * Onboarding completion is persisted in AsyncStorage so returning users
 * skip directly to the splash → dashboard flow.
 *
 * @module App
 */

import React, { useState, useEffect } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from './src/constants/ThemeContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import OnboardingScreen from './src/screens/OnboardingScreen';
import SplashScreen from './src/screens/SplashScreen';
import MainDashboard from './src/screens/MainDashboard';

const ONBOARDING_KEY = '@airhaven_onboarding_done';

// Suppress known React Native animation warnings
LogBox.ignoreLogs([
  'Attempting to run JS driven animation',
  'Animated: `useNativeDriver`',
]);

export default function App() {
  const [screen, setScreen] = useState(null); // null = loading, 'onboarding' | 'splash' | 'main'

  /* Check AsyncStorage on mount to skip onboarding for returning users */
  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => setScreen(value === 'true' ? 'splash' : 'onboarding'))
      .catch(() => setScreen('onboarding'));
  }, []);

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // Storage write failed — continue anyway
    }
    setScreen('splash');
  };

  // Still loading preference — render nothing briefly
  if (screen === null) return null;

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider>
            {screen === 'onboarding' && (
              <OnboardingScreen onComplete={handleOnboardingComplete} />
            )}

            {screen === 'splash' && (
              <SplashScreen onFinish={() => setScreen('main')} duration={2500} />
            )}

            {screen === 'main' && <MainDashboard />}
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
