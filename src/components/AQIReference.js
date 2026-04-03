/**
 * AQIReference.js — Visual reference card for the 6 US EPA AQI levels.
 *
 * Supports a full card layout (default) and a compact horizontal bar
 * variant. Highlights the level matching the currently provided AQI value.
 *
 * @module AQIReference
 * @exports AQIReference
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { AQI_CATEGORIES, getAQICategory } from '../constants/aqi';
import { useTheme } from '../constants/ThemeContext';

const AQIReference = ({ aqi = 0, compact = false }) => {
  const { t, tCat } = useTheme();
  const currentCat = tCat(getAQICategory(aqi));

  if (compact) {
    return (
      <View style={s.compactWrap}>
        <View style={s.compactBar}>
          {AQI_CATEGORIES.map((c, i) => {
            const isActive = currentCat.label === c.label;
            return (
              <View
                key={i}
                style={[
                  s.compactSeg,
                  { backgroundColor: isActive ? c.color : 'rgba(255,255,255,0.15)' },
                  isActive && s.compactSegActive,
                ]}
              >
                {isActive && (
                  <View style={[s.compactMarker, { backgroundColor: '#fff' }]}>
                    <Text style={[s.compactMarkerText, { color: c.textColor || '#000' }]}>{aqi}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={s.compactLabels}>
          {AQI_CATEGORIES.map((c, i) => {
            const isActive = currentCat.label === c.label;
            return (
              <Text
                key={i}
                style={[s.compactLabel, isActive && { color: PALETTE.white, fontWeight: FONTS.bold }]}
                numberOfLines={1}
              >
                {c.range[0]}–{c.range[1]}
              </Text>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <MaterialCommunityIcons name="chart-bar" size={18} color="rgba(255,255,255,0.70)" />
        <Text style={s.cardTitle}>{t('aqiLevelReference')}</Text>
      </View>

      {AQI_CATEGORIES.map((c, i) => {
        const tc = tCat(c);
        const isActive = currentCat.label === tc.label;
        return (
          <View
            key={i}
            style={[
              s.row,
              isActive && { backgroundColor: (c.lightColor || c.color) + '18', borderColor: (c.lightColor || c.color) + '40' },
              isActive && s.rowActive,
            ]}
          >
            {/* Color pip */}
            <View style={[s.pip, { backgroundColor: c.color }]} />

            {/* Range */}
            <Text style={[s.range, isActive && { color: PALETTE.white, fontWeight: FONTS.bold }]}>
              {c.range[0]}–{c.range[1]}
            </Text>

            {/* Label */}
            <Text
              style={[s.label, isActive && { color: c.lightColor || c.color, fontWeight: FONTS.bold }]}
              numberOfLines={1}
            >
              {tc.shortLabel || tc.label}
            </Text>

            {/* Icon */}
            <MaterialCommunityIcons
              name={c.faceIcon}
              size={16}
              color={isActive ? (c.lightColor || c.color) : 'rgba(255,255,255,0.30)'}
            />

            {/* Active indicator */}
            {isActive && (
              <View style={[s.activeBadge, { backgroundColor: c.color }]}>
                <Text style={[s.activeBadgeText, { color: c.badgeText || '#000' }]}>{aqi}</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  /* Full card variant */
  card: {
    marginHorizontal: SPACING.md,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.md,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm + 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },

  /* Row for each AQI level */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 3,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 10,
  },
  rowActive: {
    borderWidth: 1,
  },
  pip: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  range: {
    width: 60,
    fontSize: 12,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
    fontVariant: ['tabular-nums'],
  },
  label: {
    flex: 1,
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.50)',
  },
  activeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
    marginLeft: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: FONTS.bold,
    color: '#000',
  },

  /* Compact variant */
  compactWrap: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  compactBar: {
    flexDirection: 'row',
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
    gap: 2,
  },
  compactSeg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactSegActive: {
    flex: 1.6,
    borderRadius: 5,
  },
  compactMarker: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
  },
  compactMarkerText: {
    fontSize: 8,
    fontWeight: FONTS.bold,
    color: '#000',
  },
  compactLabels: {
    flexDirection: 'row',
    marginTop: 3,
    gap: 2,
  },
  compactLabel: {
    flex: 1,
    fontSize: 7,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
  },
});

AQIReference.propTypes = {
  aqi: PropTypes.number.isRequired,
  compact: PropTypes.bool,
};

export default AQIReference;
