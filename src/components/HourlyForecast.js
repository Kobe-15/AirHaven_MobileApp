/**
 * HourlyForecast.js — Horizontal scrolling hourly AQI forecast cards.
 *
 * Displays the next 12 hours as individually colored column cards,
 * each showing AQI value and category, temperature, and humidity.
 * The first card is highlighted as "Now."
 *
 * @module HourlyForecast
 * @exports HourlyForecast
 */

import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const HourlyForecast = ({ data }) => {
  const { t, tCat } = useTheme();
  const scrollRef = useRef(null);

  return (
  <View style={s.card}>
    <View style={s.header}>
      <MaterialCommunityIcons name="clock-outline" size={16} color={PALETTE.brightBlue} />
      <Text style={s.title}>{t('hourlyForecast')}</Text>
      <Text style={s.subtitle}>{t('Next 24h')}</Text>
    </View>

    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scroll}
      scrollEventThrottle={16}
      decelerationRate="fast"
      /* ─── Gesture fix: prevent the outer page-swiper from stealing
             horizontal touches that belong to this inner scroll view ─── */
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onStartShouldSetResponderCapture={() => false}
      onMoveShouldSetResponderCapture={() => false}
      nestedScrollEnabled
    >
      {data.map((item, i) => {
        const cat = tCat(getAQICategory(item.aqi));
        const isNow = item.isNowSlot === true;

        return (
          <View key={i} style={[s.item, isNow && s.itemNow]}>
            {/* Time label */}
            <Text style={[s.hour, isNow && s.hourNow]}>
              {isNow ? t('now') : item.hour}
            </Text>

            {/* AQI colored badge */}
            <View style={[s.aqiBadge, { backgroundColor: (cat.lightColor || cat.color) + '22', borderColor: (cat.lightColor || cat.color) + '50' }]}>
              <Text style={[s.aqiVal, { color: cat.lightColor || cat.color }]}>{item.aqi}</Text>
              <Text style={[s.aqiLabel, { color: cat.lightColor || cat.color }]}>
                {cat.shortLabel || cat.label.split(' ')[0]}
              </Text>
            </View>

            {/* Divider */}
            <View style={s.divider} />

            {/* Temp */}
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="thermometer" size={13} color="#F97316" />
              <Text style={s.infoVal}>{item.temp}°</Text>
            </View>

            {/* Humidity */}
            <View style={s.infoRow}>
              <MaterialCommunityIcons name="water-outline" size={13} color="#2D9CDB" />
              <Text style={s.infoVal}>{item.humidity}%</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  </View>
  );
};

const s = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
    marginLeft: 'auto',
  },
  scroll: {
    paddingHorizontal: SPACING.sm + 4,
    gap: 8,
  },
  item: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm + 4,
    borderRadius: RADIUS.xl,
    minWidth: 72,
    gap: 5,
  },
  itemNow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  hour: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.65)',
  },
  hourNow: {
    color: PALETTE.brightBlue,
    fontWeight: FONTS.bold,
  },
  aqiBadge: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 1,
  },
  aqiVal: {
    fontSize: 18,
    fontWeight: FONTS.bold,
  },
  aqiLabel: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoVal: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: 'rgba(255,255,255,0.85)',
  },
});

HourlyForecast.propTypes = {
  data: PropTypes.array.isRequired,
};

export default HourlyForecast;