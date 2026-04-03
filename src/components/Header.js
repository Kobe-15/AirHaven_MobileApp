/**
 * Header.js — Dashboard header with location, live indicator, and greeting.
 *
 * Displays the monitoring location name, a pulsing “LIVE” badge,
 * notification/settings action buttons, current date/time, and a
 * time-of-day greeting message.
 *
 * @module Header
 * @exports Header
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

/* ── Time-based greeting ── */
const getGreetingKey = () => {
  const h = new Date().getHours();
  if (h < 12) return { key: 'greetingMorning', emoji: '☀️' };
  if (h < 17) return { key: 'greetingAfternoon', emoji: '⛅' };
  if (h < 21) return { key: 'greetingEvening', emoji: '🌅' };
  return { key: 'greetingNight', emoji: '🌙' };
};

/**
 * Header — Top-of-dashboard header component.
 *
 * Layout:
 *   Row 1: Location name + LIVE indicator | Notification & Settings buttons
 *   Row 2: Calendar date · Clock time
 *   Row 3: Time-of-day greeting with emoji
 */
const Header = ({ onNotification, onSettings }) => {
  const { t, language } = useTheme();
  const greetingInfo = getGreetingKey();
  const now = new Date();
  const locale = language === 'fil' ? 'fil-PH' : 'en-US';
  const timeStr = now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });

  /* Pulsing LIVE dot */
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={s.container}>
      {/* Row 1 — Location + LIVE | Action buttons */}
      <View style={s.topRow}>
        <View style={s.locationGroup}>
          <MaterialCommunityIcons name="map-marker" size={16} color={PALETTE.white} />
          <Text style={s.location} numberOfLines={1}>{t('location')}</Text>
          <View style={s.livePill}>
            <Animated.View style={[s.liveDot, { opacity: pulseAnim }]} />
            <Text style={s.liveText}>{t('live')}</Text>
          </View>
        </View>
        <View style={s.btnGroup}>
          <TouchableOpacity style={s.btn} onPress={onNotification} activeOpacity={0.7} accessibilityLabel="Notifications" accessibilityRole="button">
            <MaterialCommunityIcons name="bell-outline" size={18} color={PALETTE.white} />
          </TouchableOpacity>
          <TouchableOpacity style={s.btn} onPress={onSettings} activeOpacity={0.7} accessibilityLabel="Settings" accessibilityRole="button">
            <MaterialCommunityIcons name="cog-outline" size={18} color={PALETTE.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Row 2 — Date & Time */}
      <View style={s.dateRow}>
        <MaterialCommunityIcons name="calendar-month-outline" size={13} color="rgba(255,255,255,0.70)" />
        <Text style={s.dateText}>{dateStr}</Text>
        <Text style={s.sep}>•</Text>
        <MaterialCommunityIcons name="clock-outline" size={13} color="rgba(255,255,255,0.70)" />
        <Text style={s.dateText}>{timeStr}</Text>
      </View>

      {/* Row 3 — Greeting */}
      <View style={s.greetingWrap}>
        <Text style={s.greetingEmoji}>{greetingInfo.emoji}</Text>
        <Text style={s.greetingText}>{t(greetingInfo.key)}!</Text>
      </View>
      <Text style={s.greetingSub}>{t('greetingSub')}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md + 4,
  },

  /* Row 1 */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  location: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(74,222,128,0.14)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    marginLeft: 3,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    fontSize: 10,
    fontWeight: FONTS.bold,
    color: '#4ADE80',
    letterSpacing: 0.5,
  },
  btnGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },

  /* Row 2 */
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    marginLeft: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.70)',
  },
  sep: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.40)',
    marginHorizontal: 2,
  },

  /* Row 3 */
  greetingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: SPACING.md,
  },
  greetingEmoji: {
    fontSize: 24,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  greetingSub: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 3,
    marginLeft: 2,
  },


});

Header.propTypes = {
  onNotification: PropTypes.func,
  onSettings: PropTypes.func.isRequired,
};

export default Header;
