/**
 * NodeDetailScreen.js — Individual sensor node detail view.
 *
 * Reuses the same shared dashboard components (AQIHeroCard, AQIReference,
 * HealthRecommendations, HourlyForecast, WeeklyForecast, EnvironmentCards,
 * PollutantBreakdown) to display per-node air quality data with consistent styling.
 *
 * @module NodeDetailScreen
 * @exports NodeDetailScreen
 */

import React from 'react';
import { ScrollView, View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

import AQIHeroCard from '../components/AQIHeroCard';
import AQIReference from '../components/AQIReference';
import HealthRecommendations from '../components/HealthRecommendations';
import EnvironmentCards from '../components/EnvironmentCards';
import PollutantBreakdown from '../components/PollutantBreakdown';
import HourlyForecast from '../components/HourlyForecast';
import WeeklyForecast from '../components/WeeklyForecast';

const NodeDetailScreen = ({ node }) => {
  const { t } = useTheme();
  if (!node) return null;

  return (
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      {/* ─── Compact Node Header ─── */}
      <View style={s.header}>
        <View style={s.headerIcon}>
          <MaterialCommunityIcons name="access-point" size={18} color={PALETTE.white} />
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>{node.name}</Text>
          <Text style={s.headerSub}>
            {node.latitude.toFixed(5)}°N, {node.longitude.toFixed(5)}°E
          </Text>
        </View>
        <View style={s.livePill}>
          <View style={s.liveDot} />
          <Text style={s.liveText}>{t('live')}</Text>
        </View>
      </View>

      {/* ─── AQI Hero Card (same component as main dashboard) ─── */}
      <View style={s.hero}>
        <AQIHeroCard
          aqi={node.aqi}
          updatedAt={node.updatedAt}
          pollutants={node.pollutants}
        />
      </View>

      {/* ─── AQI Reference (full variant, like main dashboard) ─── */}
      <View style={s.gap}>
        <AQIReference aqi={node.aqi} />
      </View>

      {/* ─── Health Recommendations ─── */}
      <View style={s.gap}>
        <HealthRecommendations aqi={node.aqi} />
      </View>

      {/* ─── Hourly Forecast ─── */}
      {node.hourly && (
        <View style={s.gap}>
          <HourlyForecast data={node.hourly} />
        </View>
      )}

      {/* ─── Weekly Forecast ─── */}
      {node.weekly && (
        <View style={s.gap}>
          <WeeklyForecast data={node.weekly} />
        </View>
      )}

      {/* ─── Environment Cards ─── */}
      <View style={s.gap}>
        <EnvironmentCards temperature={node.temperature} humidity={node.humidity} />
      </View>

      {/* ─── Pollutant Breakdown ─── */}
      <View style={s.gap}>
        <PollutantBreakdown pollutants={node.pollutants} />
      </View>

      {/* ─── Footer ─── */}
      <View style={s.footerWrap}>
        <View style={s.coordRow}>
          <MaterialCommunityIcons name="crosshairs-gps" size={11} color="rgba(255,255,255,0.30)" />
          <Text style={s.coordText}>
            {node.latitude.toFixed(5)}°N, {node.longitude.toFixed(5)}°E
          </Text>
        </View>
        <Text style={s.footer}>AirHaven {new Date().getFullYear()}</Text>
      </View>

      <View style={{ height: SPACING.xxl + SPACING.lg }} />
    </ScrollView>
  );
};

const s = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl },

  /* Compact Node Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerName: { fontSize: 17, fontWeight: FONTS.bold, color: PALETTE.white },
  headerSub: { fontSize: 11, fontWeight: FONTS.medium, color: 'rgba(255,255,255,0.50)', marginTop: 1 },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.22)',
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: '#4ADE80' },
  liveText: { fontSize: 9, fontWeight: FONTS.bold, letterSpacing: 1, color: PALETTE.white },

  /* Section spacing (matches main dashboard) */
  hero: { marginTop: SPACING.xs },
  gap: { marginTop: SPACING.md + 4 },

  /* Footer */
  footerWrap: {
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: 4,
  },
  coordRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  coordText: { fontSize: 10, fontWeight: FONTS.medium, color: 'rgba(255,255,255,0.30)', fontVariant: ['tabular-nums'] },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.5,
  },
});

NodeDetailScreen.propTypes = {
  node: PropTypes.object.isRequired,
};

export default NodeDetailScreen;
