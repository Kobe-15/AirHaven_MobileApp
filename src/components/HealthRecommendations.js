/**
 * HealthRecommendations.js — AQI-based health advisory card.
 *
 * Renders a color-coded card with the current AQI category header,
 * advisory text, actionable tips, and Safe/Avoid activity columns
 * sourced from the i18n advisory engine.
 *
 * @module HealthRecommendations
 * @exports HealthRecommendations
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getLocalizedAdvisory } from '../constants/i18n';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const HealthRecommendations = ({ aqi }) => {
  const { t, tCat } = useTheme();
  const advisory = getLocalizedAdvisory(aqi, t);
  const cat = tCat(getAQICategory(aqi));

  const topTips = advisory.tips.slice(0, 2);
  const topSafe = (advisory.safe || []).slice(0, 2);
  const topAvoid = (advisory.avoid || []).slice(0, 2);

  return (
    <View style={s.wrapper}>
      <View style={s.card}>
        {/* ── Bold colored accent strip ── */}
        <View style={[s.accentStrip, { backgroundColor: cat.color }]} />

        {/* ── Header content ── */}
        <View style={s.headerContent}>
          <View style={s.heroRow}>
            <View style={[s.faceWrap, { borderColor: cat.lightColor || cat.color }]}>
              <MaterialCommunityIcons
                name={cat.faceIcon || 'shield-check'}
                size={44}
                color={cat.lightColor || cat.color}
              />
            </View>
            <View style={s.heroText}>
              <Text style={s.categoryLabel}>{cat.shortLabel || cat.label}</Text>
              <View style={s.aqiRow}>
                <Text style={[s.aqiNumber, { color: cat.lightColor || cat.color }]}>{aqi}</Text>
                <Text style={s.aqiUnit}>{t('usAqi')}</Text>
              </View>
            </View>
          </View>

          {/* Advisory text */}
          <Text style={s.advisoryText}>{advisory.advisory}</Text>
        </View>

        {/* ── Recommendations body ── */}
        <View style={s.body}>
          {/* Tips */}
          {topTips.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <MaterialCommunityIcons name="lightbulb-on-outline" size={14} color={PALETTE.brightBlue} />
                <Text style={[s.sectionLabel, { color: PALETTE.brightBlue }]}>{t('recommendations')}</Text>
              </View>
              {topTips.map((tip, i) => (
                <View key={i} style={s.tipRow}>
                  <View style={s.tipIconWrap}>
                    <MaterialCommunityIcons name={tip.icon} size={16} color="rgba(255,255,255,0.60)" />
                  </View>
                  <Text style={s.tipText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Safe + Avoid columns */}
          <View style={s.columns}>
            {topSafe.length > 0 && (
              <View style={[s.col, s.colSafe]}>
                <View style={s.colHeader}>
                  <MaterialCommunityIcons name="check-circle" size={14} color="#22C55E" />
                  <Text style={[s.colLabel, { color: '#22C55E' }]}>{t('safe')}</Text>
                </View>
                {topSafe.map((item, i) => (
                  <Text key={i} style={s.colText}>•  {item.text}</Text>
                ))}
              </View>
            )}

            {topAvoid.length > 0 && (
              <View style={[s.col, s.colAvoid]}>
                <View style={s.colHeader}>
                  <MaterialCommunityIcons name="close-circle" size={14} color="#EF4444" />
                  <Text style={[s.colLabel, { color: '#EF4444' }]}>{t('avoid')}</Text>
                </View>
                {topAvoid.map((item, i) => (
                  <Text key={i} style={s.colText}>•  {item.text}</Text>
                ))}
              </View>
            )}
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

  card: {
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  /* ── Accent strip + header ── */
  accentStrip: {
    height: 5,
    width: '100%',
  },
  headerContent: {
    padding: SPACING.md + 2,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.10)',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: SPACING.sm + 2,
  },
  faceWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    marginBottom: 2,
  },
  aqiRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  aqiNumber: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    lineHeight: 36,
  },
  aqiUnit: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
  },
  advisoryText: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 20,
  },

  /* ── Body ── */
  body: {
    padding: SPACING.md,
  },

  section: {
    marginBottom: SPACING.sm + 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  tipIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.85)',
    flex: 1,
    lineHeight: 20,
  },

  /* ── Columns ── */
  columns: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  col: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.sm + 4,
  },
  colSafe: {
    backgroundColor: 'rgba(34,197,94,0.20)',
  },
  colAvoid: {
    backgroundColor: 'rgba(239,68,68,0.20)',
  },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 6,
  },
  colLabel: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  colText: {
    fontSize: 13,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18,
    paddingVertical: 2,
  },
});

HealthRecommendations.propTypes = {
  aqi: PropTypes.number.isRequired,
};

export default HealthRecommendations;
