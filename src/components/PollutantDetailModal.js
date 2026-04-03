/**
 * PollutantDetailModal.js — Detailed pollutant information sheet.
 *
 * Slide-up modal displaying a specific pollutant’s full name, current
 * reading with sub-AQI, description, emission sources, health effects,
 * and protection advice. Includes an AQI scale bar for context.
 *
 * @module PollutantDetailModal
 * @exports PollutantDetailModal
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Easing, Platform, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { POLLUTANTS, getPollutantAQI, AQI_CATEGORIES } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import { getLocalizedPollutantDetail } from '../constants/i18n';

/**
 * PollutantDetailModal — detailed info sheet about a specific pollutant.
 * Pollutant details (fullName, description, sources, healthEffects, protection)
 * are now loaded from the i18n translation system.
 */
const PollutantDetailModal = ({ visible, pollutantKey, value, onClose }) => {
  const { t, tCat } = useTheme();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const info = POLLUTANTS[pollutantKey];
  const detail = getLocalizedPollutantDetail(pollutantKey, t);

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, { toValue: 1, duration: 350, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  if (!info || !detail) return null;

  const { aqi, category: rawCategory } = getPollutantAQI(pollutantKey, value);
  const category = tCat(rawCategory);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <Animated.View style={[s.sheet, { opacity: slideAnim }]}>
          {/* Handle */}
          <View style={s.handleBar} />

          {/* Header */}
          <View style={s.header}>
            <View style={[s.headerIcon, { backgroundColor: category.color + '20' }]}>
              <MaterialCommunityIcons name={info.icon} size={28} color={category.color} />
            </View>
            <View style={s.headerText}>
              <Text style={s.headerLabel}>{info.label}</Text>
              <Text style={s.headerFullName}>{detail.fullName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={s.closeBtn} accessibilityLabel="Close details" accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={22} color="rgba(255,255,255,0.60)" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
            {/* Current reading card */}
            <View style={[s.readingCard, { borderColor: category.color + '40' }]}>
              <View style={s.readingRow}>
                <View>
                  <Text style={s.readingLabel}>{t('currentReading')}</Text>
                  <Text style={[s.readingValue, { color: category.color }]}>
                    {typeof value === 'number' ? value.toFixed(pollutantKey === 'co' ? 2 : 1) : value} {info.unit}
                  </Text>
                </View>
                <View style={s.readingRight}>
                  <Text style={[s.readingAqi, { color: category.color }]}>{aqi}</Text>
                  <Text style={s.readingAqiLabel}>{t('subAqi')}</Text>
                </View>
              </View>
              <View style={[s.statusPill, { backgroundColor: category.color + '20' }]}>
                <View style={[s.statusDot, { backgroundColor: category.color }]} />
                <Text style={[s.statusText, { color: category.color }]}>{category.label}</Text>
              </View>
            </View>

            {/* AQI Scale */}
            <View style={s.scaleCard}>
              <Text style={s.sectionTitle}>{t('aqiScale')}</Text>
              <View style={s.scaleBar}>
                {AQI_CATEGORIES.map((cat, i) => (
                  <View
                    key={i}
                    style={[
                      s.scaleSegment,
                      { backgroundColor: cat.color, flex: 1 },
                      i === 0 && { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
                      i === AQI_CATEGORIES.length - 1 && { borderTopRightRadius: 4, borderBottomRightRadius: 4 },
                    ]}
                  />
                ))}
              </View>
              <View style={s.scaleLabels}>
                <Text style={s.scaleLabelText}>0</Text>
                <Text style={s.scaleLabelText}>50</Text>
                <Text style={s.scaleLabelText}>100</Text>
                <Text style={s.scaleLabelText}>150</Text>
                <Text style={s.scaleLabelText}>200</Text>
                <Text style={s.scaleLabelText}>300</Text>
                <Text style={s.scaleLabelText}>500</Text>
              </View>
            </View>

            {/* Description */}
            <View style={s.infoCard}>
              <Text style={s.sectionTitle}>{t('aboutSection')}</Text>
              <Text style={s.bodyText}>{detail.description}</Text>
            </View>

            {/* Sources */}
            <View style={s.infoCard}>
              <View style={s.infoHeader}>
                <MaterialCommunityIcons name="factory" size={16} color={PALETTE.brightBlue} />
                <Text style={s.sectionTitle}>{t('sources')}</Text>
              </View>
              {detail.sources.map((src, i) => (
                <View key={i} style={s.bulletRow}>
                  <View style={s.bullet} />
                  <Text style={s.bulletText}>{src}</Text>
                </View>
              ))}
            </View>

            {/* Health Effects */}
            <View style={s.infoCard}>
              <View style={s.infoHeader}>
                <MaterialCommunityIcons name="heart-pulse" size={16} color="#EF4444" />
                <Text style={s.sectionTitle}>{t('healthEffects')}</Text>
              </View>
              {detail.healthEffects.map((effect, i) => (
                <View key={i} style={s.bulletRow}>
                  <View style={[s.bullet, { backgroundColor: '#EF4444' }]} />
                  <Text style={s.bulletText}>{effect}</Text>
                </View>
              ))}
            </View>

            {/* Protection */}
            <View style={[s.infoCard, { backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.25)' }]}>
              <View style={s.infoHeader}>
                <MaterialCommunityIcons name="shield-check" size={16} color="#22C55E" />
                <Text style={[s.sectionTitle, { color: '#22C55E' }]}>{t('protection')}</Text>
              </View>
              <Text style={s.bodyText}>{detail.protection}</Text>
            </View>

            <View style={{ height: SPACING.xl }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F2647',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignSelf: 'center',
    marginTop: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  headerFullName: {
    fontSize: 13,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.60)',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },

  // Reading card
  readingCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  readingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 12,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.60)',
    marginBottom: 4,
  },
  readingValue: {
    fontSize: 28,
    fontWeight: FONTS.bold,
  },
  readingRight: {
    alignItems: 'center',
  },
  readingAqi: {
    fontSize: 32,
    fontWeight: FONTS.bold,
  },
  readingAqiLabel: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
    marginTop: SPACING.sm,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },

  // Scale
  scaleCard: {
    marginBottom: SPACING.md,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: SPACING.sm,
  },
  scaleSegment: {
    height: 8,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleLabelText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.50)',
    fontWeight: FONTS.medium,
  },

  // Info cards
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: SPACING.md,
    marginBottom: SPACING.sm + 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  bodyText: {
    fontSize: 13,
    fontWeight: FONTS.regular,
    color: 'rgba(255,255,255,0.70)',
    lineHeight: 20,
    marginTop: 4,
  },

  // Bullets
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.brightBlue,
    marginTop: 6,
  },
  bulletText: {
    fontSize: 13,
    fontWeight: FONTS.regular,
    color: 'rgba(255,255,255,0.70)',
    flex: 1,
    lineHeight: 19,
  },
});

PollutantDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  pollutantKey: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PollutantDetailModal;
