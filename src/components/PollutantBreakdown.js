/**
 * PollutantBreakdown.js — Two-column pollutant card grid.
 *
 * Displays each measured pollutant as a tappable glass card colored
 * by its individual US EPA AQI sub-index. Tapping opens the
 * PollutantDetailModal with in-depth information.
 *
 * @module PollutantBreakdown
 * @exports PollutantBreakdown
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { POLLUTANTS, getPollutantAQI } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import PollutantDetailModal from './PollutantDetailModal';

const PollutantBreakdown = ({ pollutants }) => {
  const { t, tCat } = useTheme();
  const entries = Object.entries(pollutants);
  const [selectedPollutant, setSelectedPollutant] = useState(null);

  return (
    <View style={s.wrapper}>
      <View style={s.header}>
        <MaterialCommunityIcons name="molecule" size={15} color={PALETTE.brightBlue} />
        <Text style={s.title}>{t('pollutants')}</Text>
      </View>

      <View style={s.grid}>
        {entries.map(([key, value]) => {
          const info = POLLUTANTS[key];
          if (!info) return null;

          const { aqi, category: rawCategory } = getPollutantAQI(key, value);
          const category = tCat(rawCategory);
          const catLabel = category.shortLabel || category.label;

          return (
            <TouchableOpacity
              key={key}
              style={s.card}
              activeOpacity={0.7}
              onPress={() => setSelectedPollutant({ key, value })}
              accessibilityLabel={`View ${info.label} details`}
              accessibilityRole="button"
            >
              {/* Top accent stripe */}
              <View style={[s.accent, { backgroundColor: category.color }]} />

              <View style={s.cardBody}>
                <View style={s.cardTop}>
                  <View style={[s.icon, { backgroundColor: (category.lightColor || category.color) + '18' }]}>
                    <MaterialCommunityIcons name={info.icon} size={18} color={category.lightColor || category.color} />
                  </View>
                  <Text style={s.label}>{info.label}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={14} color="rgba(255,255,255,0.30)" />
                </View>

                <Text style={s.value}>
                  {typeof value === 'number' ? value.toFixed(1) : value}
                </Text>
                <Text style={s.unit}>{info.unit}</Text>

                {/* EPA pill */}
                <View style={[s.pill, { backgroundColor: (category.lightColor || category.color) + '20' }]}>
                  <View style={[s.dot, { backgroundColor: category.lightColor || category.color }]} />
                  <Text style={[s.pillTxt, { color: category.lightColor || category.color }]}>{catLabel}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Detail modal */}
      <PollutantDetailModal
        visible={!!selectedPollutant}
        pollutantKey={selectedPollutant?.key}
        value={selectedPollutant?.value}
        onClose={() => setSelectedPollutant(null)}
      />
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

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm + 2,
  },

  card: {
    width: '47.5%',
    borderRadius: RADIUS.xl,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  accent: {
    height: 3,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
  },
  cardBody: {
    padding: SPACING.sm + 2,
  },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: SPACING.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: 'rgba(255,255,255,0.85)',
  },

  value: {
    fontSize: 26,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    lineHeight: 30,
  },
  unit: {
    fontSize: 11,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.50)',
    marginBottom: SPACING.sm,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillTxt: {
    fontSize: 11,
    fontWeight: FONTS.bold,
  },
});

PollutantBreakdown.propTypes = {
  pollutants: PropTypes.object.isRequired,
};

export default PollutantBreakdown;
