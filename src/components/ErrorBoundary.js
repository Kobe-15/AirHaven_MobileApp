/**
 * ErrorBoundary.js — Global error boundary for AirHaven.
 *
 * Catches unhandled JavaScript errors in the component tree and
 * displays a user-friendly fallback screen instead of a white-screen crash.
 *
 * @module ErrorBoundary
 * @exports ErrorBoundary
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // TODO: Send to your error reporting service (e.g. Sentry, Bugsnag)
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={s.container}>
          <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={s.title}>Something Went Wrong</Text>
          <Text style={s.message}>
            The app ran into an unexpected error. Please try again.
          </Text>
          <TouchableOpacity
            style={s.button}
            onPress={this.handleRetry}
            activeOpacity={0.8}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="refresh" size={18} color="#FFF" />
            <Text style={s.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F2647',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#4FA9E6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default ErrorBoundary;
