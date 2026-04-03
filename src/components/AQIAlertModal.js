/**
 * AQIAlertModal.js — Full-screen air quality alert modal.
 *
 * Triggered when AQI exceeds a configurable threshold. Displays the
 * current AQI category, health advice, and a pulsing icon with haptic
 * feedback. Provides a dismiss button for acknowledgement.
 *
 * @module AQIAlertModal
 * @exports AQIAlertModal
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Vibration, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
const AQIAlertModal = ({ visible, aqi, onDismiss }) => {
  const { t, tCat } = useTheme();
  const rawCat = getAQICategory(aqi);
  const cat = tCat(rawCat);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      // Vibrate on alert
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 200, 100, 200]);
      }

      // Pulse the icon
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [visible, aqi]);

  const isHazardous = aqi > 300;
  const alertColor = isHazardous ? '#7E0023' : aqi > 200 ? '#8F3F97' : '#FF0000';

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={s.overlay}>
        <View style={[s.card, { borderColor: alertColor + '60' }]}>
          {/* Alert strip */}
          <View style={[s.strip, { backgroundColor: alertColor }]} />

          {/* Pulsing icon */}
          <Animated.View
            style={[
              s.iconCircle,
              { backgroundColor: alertColor + '20', borderColor: alertColor + '40', transform: [{ scale: pulseAnim }] },
            ]}
          >
            <MaterialCommunityIcons
              name={isHazardous ? 'skull-crossbones-outline' : 'alert-octagon'}
              size={40}
              color={alertColor}
            />
          </Animated.View>

          {/* Title */}
          <Text style={s.alertTitle}>
            {isHazardous ? t('hazardousAirQuality') : t('airQualityAlert')}
          </Text>

          {/* AQI value */}
          <View style={[s.aqiBadge, { backgroundColor: alertColor + '18', borderColor: alertColor + '35' }]}>
            <Text style={[s.aqiValue, { color: alertColor }]}>{aqi}</Text>
            <Text style={s.aqiLabel}>{t('usAqi')}</Text>
          </View>

          {/* Category */}
          <Text style={[s.categoryText, { color: alertColor }]}>{cat.shortLabel || cat.label}</Text>

          {/* Description */}
          <Text style={s.description}>{cat.description}</Text>

          {/* Advice */}
          <View style={[s.adviceCard, { backgroundColor: alertColor + '0D', borderColor: alertColor + '25' }]}>
            <MaterialCommunityIcons name="shield-alert" size={18} color={alertColor} />
            <Text style={s.adviceText}>{cat.advice}</Text>
          </View>

          {/* Detection info */}
          <Text style={s.nodeInfo}>
            {t('detectedAcrossNetwork')}
          </Text>

          {/* Dismiss */}
          <TouchableOpacity
            style={[s.dismissBtn, { backgroundColor: alertColor }]}
            onPress={onDismiss}
            activeOpacity={0.8}
            accessibilityLabel="Dismiss alert"
            accessibilityRole="button"
          >
            <Text style={s.dismissText}>{t('iUnderstand')}</Text>
          </TouchableOpacity>

          <Text style={s.timestamp}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {t('alertSystem')}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.70)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    width: '100%',
    backgroundColor: '#0F2647',
    borderRadius: RADIUS.xxl,
    borderWidth: 1.5,
    alignItems: 'center',
    paddingBottom: SPACING.lg,
    overflow: 'hidden',
  },
  strip: {
    width: '100%',
    height: 5,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  aqiBadge: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    marginBottom: 6,
  },
  aqiValue: {
    fontSize: 42,
    fontWeight: FONTS.bold,
    lineHeight: 48,
  },
  aqiLabel: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.80)',
    textAlign: 'center',
    paddingHorizontal: SPACING.lg,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  adviceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginHorizontal: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  adviceText: {
    fontSize: 13,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
    lineHeight: 19,
  },
  nodeInfo: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: SPACING.md,
  },
  dismissBtn: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.sm,
  },
  dismissText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: FONTS.medium,
  },
});

AQIAlertModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  aqi: PropTypes.number.isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default AQIAlertModal;
