/**
 * MiniMap.web.js — Web-platform variant of the MiniMap component.
 *
 * Replaces react-native-maps with an embedded OpenStreetMap iframe
 * inside a themed gradient card. Supports light/dark mode via ThemeContext.
 * Includes a node legend identical to the native MiniMap variant.
 *
 * @module MiniMap
 * @exports MiniMap
 * @platform web
 * @see MiniMap.js for the native platform variant
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { useTheme } from '../constants/ThemeContext';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, SHADOWS, PALETTE } from '../constants/theme';

const CENTER_LAT = 14.59116;
const CENTER_LNG = 120.98152;

const MiniMap = ({ nodes }) => {
  const { colors, isDark, t, tCat } = useTheme();
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${CENTER_LNG - 0.002}%2C${CENTER_LAT - 0.0015}%2C${CENTER_LNG + 0.002}%2C${CENTER_LAT + 0.0015}&layer=mapnik`;

  const cardGradient = isDark
    ? ['rgba(30,41,59,0.75)', 'rgba(30,41,59,0.45)']
    : ['#FFFFFF', PALETTE.paleBlue + '60'];

  return (
    <View style={[styles.cardWrap, SHADOWS.sm]}>
      <LinearGradient
        colors={cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          isDark && { borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
          !isDark && { borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.iconBadge, { backgroundColor: isDark ? 'rgba(79,169,230,0.15)' : PALETTE.paleBlue }]}>
            <MaterialCommunityIcons name="map-marker-radius" size={14} color={PALETTE.brightBlue} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>{t('sensorNodes')}</Text>
          <View style={[styles.countBadge, { backgroundColor: PALETTE.brightBlue + '15' }]}>
            <Text style={[styles.count, { color: PALETTE.brightBlue }]}>
              {nodes.length} {t('active')}
            </Text>
          </View>
        </View>

        <View style={styles.mapWrap}>
          <iframe
            src={src}
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
            title="Sensor Map"
          />
        </View>

        {/* Node legend */}
        <View style={styles.legend}>
          {nodes.map((node) => {
            const cat = getAQICategory(node.aqi);
            return (
              <View key={node.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
                <Text style={[styles.legendName, { color: colors.textPrimary }]}>
                  {node.name}
                </Text>
                <Text style={[styles.legendAqi, { color: colors.textMuted }]}>
                  AQI {node.aqi}
                </Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrap: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
  },
  card: {
    borderRadius: RADIUS.xxl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: 8,
  },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.semiBold,
    flex: 1,
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.round,
  },
  count: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
  },
  mapWrap: {
    height: 180,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.md,
    overflow: 'hidden',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
  },
  legendItem: {
    alignItems: 'center',
    gap: 2,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    fontSize: 12,
    fontWeight: FONTS.semiBold,
  },
  legendAqi: {
    fontSize: 11,
    fontWeight: FONTS.regular,
  },
});

MiniMap.propTypes = {
  nodes: PropTypes.array.isRequired,
};

export default MiniMap;
