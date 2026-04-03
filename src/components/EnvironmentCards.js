/**
 * EnvironmentCards.js — Side-by-side temperature and humidity display cards.
 *
 * Renders two glass-morphism cards showing current temperature (°C) and
 * humidity (%) with color-coded comfort indicators (Cool / Comfortable /
 * Warm / Hot and Dry / Comfortable / Humid / Very Humid).
 *
 * @module EnvironmentCards
 * @exports EnvironmentCards
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const EnvironmentCards = ({ temperature, humidity }) => {
  const { t } = useTheme();

  // Determine temp comfort
  const getTempStatus = (v) => {
    if (v <= 25) return { label: t('cool'), color: '#4FA9E6', icon: 'snowflake' };
    if (v <= 30) return { label: t('comfortable'), color: '#22C55E', icon: 'weather-sunny' };
    if (v <= 34) return { label: t('warm'), color: '#F97316', icon: 'weather-partly-cloudy' };
    return { label: t('hot'), color: '#EF4444', icon: 'fire' };
  };

  // Determine humidity comfort
  const getHumidStatus = (h) => {
    if (h < 40) return { label: t('dry'), color: '#F97316', icon: 'water-off' };
    if (h <= 60) return { label: t('comfortable'), color: '#22C55E', icon: 'water-check' };
    if (h <= 80) return { label: t('humid'), color: '#2D9CDB', icon: 'water' };
    return { label: t('veryHumid'), color: '#C084FC', icon: 'water-alert' };
  };

  const tempStatus = getTempStatus(temperature);
  const humidStatus = getHumidStatus(humidity);

  return (
    <View style={s.wrapper}>
      <View style={s.header}>
        <MaterialCommunityIcons name="thermometer" size={15} color={PALETTE.brightBlue} />
        <Text style={s.title}>{t('environment')}</Text>
      </View>

      <View style={s.row}>
        {/* Temperature card */}
        <View style={[s.card, { borderColor: tempStatus.color + '25' }]}>
          <View style={[s.iconWrap, { backgroundColor: tempStatus.color + '18' }]}>
            <MaterialCommunityIcons name={tempStatus.icon} size={22} color={tempStatus.color} />
          </View>
          <Text style={s.label}>{t('temperature')}</Text>
          <Text style={s.value}>{temperature}°C</Text>
          <View style={[s.statusPill, { backgroundColor: tempStatus.color + '20' }]}>
            <View style={[s.dot, { backgroundColor: tempStatus.color }]} />
            <Text style={[s.statusText, { color: tempStatus.color }]}>{tempStatus.label}</Text>
          </View>
        </View>

        {/* Humidity card */}
        <View style={[s.card, { borderColor: humidStatus.color + '25' }]}>
          <View style={[s.iconWrap, { backgroundColor: humidStatus.color + '18' }]}>
            <MaterialCommunityIcons name={humidStatus.icon} size={22} color={humidStatus.color} />
          </View>
          <Text style={s.label}>{t('humidity')}</Text>
          <Text style={s.value}>{humidity}%</Text>
          <View style={[s.statusPill, { backgroundColor: humidStatus.color + '20' }]}>
            <View style={[s.dot, { backgroundColor: humidStatus.color }]} />
            <Text style={[s.statusText, { color: humidStatus.color }]}>{humidStatus.label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  wrapper: {
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: SPACING.sm + 2,
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  row: {
    flexDirection: 'row',
    gap: SPACING.sm + 2,
  },
  card: {
    flex: 1,
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderWidth: 1,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: 4,
  },
  value: {
    fontSize: 30,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    lineHeight: 34,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
    marginTop: SPACING.sm,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },
});

EnvironmentCards.propTypes = {
  temperature: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
};

export default EnvironmentCards;
