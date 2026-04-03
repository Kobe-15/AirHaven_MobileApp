/**
 * WeeklyForecast.js — Horizontal scrolling 7-day AQI trend cards.
 *
 * Displays past 7 days as individually colored cards showing daily
 * AQI value, high/low range, temperature, and humidity. The last
 * card is highlighted as “Today.”
 *
 * @module WeeklyForecast
 * @exports WeeklyForecast
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const WeeklyForecast = ({ data }) => {
  const { t, tCat } = useTheme();
  return (
  <View style={s.card}>
    <View style={s.header}>
      <MaterialCommunityIcons name="calendar-week" size={16} color={PALETTE.brightBlue} />
      <Text style={s.title}>{t('sevenDayTrend')}</Text>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.scroll}
    >
      {data.map((item, i) => {
        const cat = tCat(getAQICategory(item.aqi));
        const isToday = i === data.length - 1;

        return (
          <View key={i} style={[s.dayCard, isToday && s.dayCardToday]}>
            {/* Day + date */}
            <Text style={[s.dayName, isToday && s.dayNameToday]}>
              {isToday ? t('today') : item.day}
            </Text>
            <Text style={s.dateLabel}>{item.date}</Text>

            {/* AQI badge */}
            <View style={[s.aqiBadge, { backgroundColor: (cat.lightColor || cat.color) + '22', borderColor: (cat.lightColor || cat.color) + '50' }]}>
              <Text style={[s.aqiVal, { color: cat.lightColor || cat.color }]}>{item.aqi}</Text>
              <Text style={[s.aqiLabel, { color: cat.lightColor || cat.color }]}>
                {cat.shortLabel || cat.label.split(' ')[0]}
              </Text>
            </View>

            {/* Range */}
            <Text style={s.rangeText}>{item.low}–{item.high}</Text>

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
  scroll: {
    paddingHorizontal: SPACING.sm + 4,
    gap: 8,
  },
  dayCard: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xl,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.sm + 4,
    minWidth: 80,
    gap: 4,
  },
  dayCardToday: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  dayName: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    color: 'rgba(255,255,255,0.75)',
  },
  dayNameToday: {
    color: PALETTE.brightBlue,
    fontWeight: FONTS.bold,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.50)',
  },
  aqiBadge: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 1,
    marginVertical: 2,
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
  rangeText: {
    fontSize: 10,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.50)',
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

WeeklyForecast.propTypes = {
  data: PropTypes.array.isRequired,
};

export default WeeklyForecast;
