/**
 * AQIHeroCard.js — Primary AQI display card with semi-circular gauge.
 *
 * Renders a speedometer-style SVG gauge colored by US EPA AQI segments,
 * an animated needle, category label, and an expandable pollutant
 * breakdown section with staggered row animations.
 *
 * @module AQIHeroCard
 * @exports AQIHeroCard
 */

import React, { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, Easing,
  TouchableOpacity, LayoutAnimation, UIManager, Platform,
} from 'react-native';
import Svg, { Path, Line, Circle as SvgCircle, Text as SvgText } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { getAQICategory, POLLUTANTS, getPollutantAQI } from '../constants/aqi';
import { useTheme } from '../constants/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SW } = Dimensions.get('window');

/* ─── Gauge Geometry — Semi-circular AQI speedometer ─── */
const GAUGE_W = Math.min(SW - 40, 380);
const GAUGE_H = GAUGE_W * 0.62;
const GCX = GAUGE_W / 2;
const GCY = GAUGE_H * 0.88;
const GR = GAUGE_W * 0.36;
const ARC_W = 18;
const LABEL_R = GR + ARC_W / 2 + 16;

const SEGMENTS = [
  { from: 180, to: 150, color: '#00E400' },
  { from: 150, to: 120, color: '#FFFF00' },
  { from: 120, to: 90,  color: '#FF7E00' },
  { from: 90,  to: 60,  color: '#FF0000' },
  { from: 60,  to: 30,  color: '#8F3F97' },
  { from: 30,  to: 0,   color: '#7E0023' },
];

const TICK_LABELS = [
  { value: 50,  angle: 150 },
  { value: 100, angle: 120 },
  { value: 150, angle: 90 },
  { value: 200, angle: 60 },
  { value: 300, angle: 30 },
];

const ANGLE_MAP = [
  [0, 180], [50, 150], [100, 120], [150, 90], [200, 60], [300, 30], [500, 0],
];

const polar = (deg, r) => {
  const rad = (deg * Math.PI) / 180;
  return { x: GCX + r * Math.cos(rad), y: GCY - r * Math.sin(rad) };
};

const aqiToAngle = (aqi) => {
  const v = Math.max(0, Math.min(500, aqi));
  for (let i = 0; i < ANGLE_MAP.length - 1; i++) {
    if (v >= ANGLE_MAP[i][0] && v <= ANGLE_MAP[i + 1][0]) {
      const frac = (v - ANGLE_MAP[i][0]) / (ANGLE_MAP[i + 1][0] - ANGLE_MAP[i][0]);
      return ANGLE_MAP[i][1] + frac * (ANGLE_MAP[i + 1][1] - ANGLE_MAP[i][1]);
    }
  }
  return 0;
};

const makeArc = (from, to, r) => {
  const s = polar(from, r);
  const e = polar(to, r);
  return `M ${s.x} ${s.y} A ${r} ${r} 0 0 1 ${e.x} ${e.y}`;
};

const makePie = (from, to, r) => {
  const s = polar(from, r);
  const e = polar(to, r);
  const large = Math.abs(from - to) > 180 ? 1 : 0;
  return `M ${GCX} ${GCY} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
};

/* -----------------------------------------------
   Animated Pollutant Row - staggered fade-slide in
   ----------------------------------------------- */
const POLLUTANT_KEYS = ['pm25', 'pm10', 'co', 'no2', 'o3'];

const AnimatedPollutantRow = ({ pKey, value, isDominant, index }) => {
  const { t, tCat } = useTheme();
  const info = POLLUTANTS[pKey];
  const { aqi: subAqi, category: rawSubCat } = getPollutantAQI(pKey, value);
  const subCat = tCat(rawSubCat);
  const rowOpacity = useRef(new Animated.Value(0)).current;
  const rowSlide   = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rowOpacity, { toValue: 1, duration: 320, delay: index * 80, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.timing(rowSlide,   { toValue: 0, duration: 320, delay: index * 80, useNativeDriver: true, easing: Easing.out(Easing.cubic) }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      s.pollRow,
      isDominant && { backgroundColor: (subCat.lightColor || subCat.color) + '18', borderWidth: 1, borderColor: (subCat.lightColor || subCat.color) + '30' },
      { opacity: rowOpacity, transform: [{ translateY: rowSlide }] },
    ]}>
      <View style={s.pollLeft}>
        <View style={[s.pollIconWrap, { backgroundColor: (subCat.lightColor || subCat.color) + '20' }]}>
          <MaterialCommunityIcons name={info.icon} size={16} color={subCat.lightColor || subCat.color} />
        </View>
        <View>
          <View style={s.pollLabelRow}>
            <Text style={s.pollLabel}>{info.label}</Text>
            {isDominant && (
              <View style={[s.dominantBadge, { backgroundColor: (subCat.lightColor || subCat.color) + '30' }]}>
                <MaterialCommunityIcons name="crown" size={10} color={subCat.lightColor || subCat.color} />
                <Text style={[s.dominantText, { color: subCat.lightColor || subCat.color }]}>{t('dominant')}</Text>
              </View>
            )}
          </View>
          <Text style={s.pollConc}>
            {value.toFixed(pKey === 'co' ? 2 : 1)} {info.unit}
          </Text>
        </View>
      </View>
      <View style={s.pollRight}>
        <Text style={[s.pollAqi, { color: subCat.lightColor || subCat.color }]}>{subAqi}</Text>
        <Text style={[s.pollCatLabel, { color: subCat.lightColor || subCat.color }]}>
          {subCat.shortLabel || subCat.label}
        </Text>
      </View>
    </Animated.View>
  );
};

/* -----------------------------------------------
   AQIHeroCard - Gauge-style AQI display
   Semi-circular speedometer with colored EPA segments,
   needle, category fill, and tappable pollutant breakdown.
   ----------------------------------------------- */
const AQIHeroCard = ({ aqi, updatedAt, pollutants }) => {
  const { t, tCat, language } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [displayAqi, setDisplayAqi] = useState(aqi);
  const rawCat = getAQICategory(aqi);
  const cat = tCat(rawCat);

  /* Needle geometry */
  const needleAngle = aqiToAngle(aqi);
  const needleTip = polar(needleAngle, GR + 3);
  const needleBase = polar(needleAngle, 14);

  /* Animated values */
  const mountOpacity  = useRef(new Animated.Value(0)).current;
  const mountScale    = useRef(new Animated.Value(0.92)).current;
  const pressScale    = useRef(new Animated.Value(1)).current;
  const chevronSpin   = useRef(new Animated.Value(0)).current;
  const numberOpacity = useRef(new Animated.Value(1)).current;

  /* Mount entrance */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(mountOpacity, { toValue: 1, duration: 600, useNativeDriver: true, easing: Easing.out(Easing.ease) }),
      Animated.spring(mountScale, { toValue: 1, friction: 9, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  /* AQI number fade crossfade */
  useEffect(() => {
    if (aqi === displayAqi) return;
    Animated.timing(numberOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setDisplayAqi(aqi);
      Animated.timing(numberOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  }, [aqi]);

  /* Pollutant data + dominant */
  const pollutantData = useMemo(() => {
    if (!pollutants) return { items: [], dominantKey: null };
    const items = POLLUTANT_KEYS.map((k) => {
      const val = pollutants[k] ?? 0;
      const { aqi: subAqi } = getPollutantAQI(k, val);
      return { key: k, value: val, subAqi };
    });
    const dominant = items.reduce((best, cur) => (cur.subAqi > best.subAqi ? cur : best), items[0]);
    return { items, dominantKey: dominant?.key };
  }, [pollutants]);

  const dominantInfo = pollutantData.dominantKey ? POLLUTANTS[pollutantData.dominantKey] : null;

  /* Press feedback */
  const handlePressIn = useCallback(() => {
    Animated.spring(pressScale, { toValue: 0.975, friction: 8, tension: 160, useNativeDriver: true }).start();
  }, []);
  const handlePressOut = useCallback(() => {
    Animated.spring(pressScale, { toValue: 1, friction: 6, tension: 120, useNativeDriver: true }).start();
  }, []);
  const handleToggle = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.create(300, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
    Animated.timing(chevronSpin, { toValue: expanded ? 0 : 1, duration: 300, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }).start();
    setExpanded((prev) => !prev);
  }, [expanded]);

  const chevronRotate = chevronSpin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const locale = language === 'fil' ? 'fil-PH' : 'en-US';
  const timeStr = new Date().toLocaleTimeString(locale, {
    hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true,
  });
  const dateStr = new Date().toLocaleDateString(locale, {
    month: 'short', day: 'numeric',
  });

  return (
    <Animated.View style={{ opacity: mountOpacity, transform: [{ scale: Animated.multiply(mountScale, pressScale) }] }}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handleToggle}
        style={[s.card, { backgroundColor: 'rgba(15,38,71,0.82)' }]}
      >
        {/* SVG Gauge */}
        <View style={s.gaugeWrap}>
          <Svg width={GAUGE_W} height={GAUGE_H} viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`}>
            {/* Interior fill - full semicircle in category color */}
            <Path
              d={makePie(180, 0.1, GR - ARC_W / 2 - 3)}
              fill={cat.color}
              fillOpacity={0.18}
            />

            {/* Colored arc segments */}
            {SEGMENTS.map((seg, i) => (
              <Path
                key={i}
                d={makeArc(seg.from, seg.to, GR)}
                stroke={seg.color}
                strokeWidth={ARC_W}
                fill="none"
                strokeLinecap="butt"
              />
            ))}

            {/* Tick marks at boundaries */}
            {TICK_LABELS.map((lbl, i) => {
              const inner = polar(lbl.angle, GR - ARC_W / 2 - 3);
              const outer = polar(lbl.angle, GR + ARC_W / 2 + 3);
              return (
                <Line
                  key={`tick-${i}`}
                  x1={inner.x} y1={inner.y}
                  x2={outer.x} y2={outer.y}
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Breakpoint number labels */}
            {TICK_LABELS.map((lbl, i) => {
              const pos = polar(lbl.angle, LABEL_R);
              return (
                <SvgText
                  key={`lbl-${i}`}
                  x={pos.x}
                  y={pos.y + 4}
                  fill="rgba(255,255,255,0.45)"
                  fontSize={10}
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {lbl.value}
                </SvgText>
              );
            })}

            {/* Needle line */}
            <Line
              x1={needleBase.x} y1={needleBase.y}
              x2={needleTip.x} y2={needleTip.y}
              stroke={PALETTE.white}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Needle tip dot */}
            <SvgCircle cx={needleTip.x} cy={needleTip.y} r={4} fill={PALETTE.white} />
            {/* Center hub */}
            <SvgCircle cx={GCX} cy={GCY} r={7} fill={PALETTE.white} />
            <SvgCircle cx={GCX} cy={GCY} r={4} fill={cat.color} />
          </Svg>

          {/* Category + AQI number centered inside the gauge */}
          <View style={[s.catOverlay, { top: GCY - GR * 0.72 }]}>
            <Text style={[s.catText, { color: cat.lightColor || cat.color }]}>{cat.shortLabel || cat.label}</Text>
            <Animated.Text style={[s.gaugeAqi, { opacity: numberOpacity, color: PALETTE.white }]}>
              {displayAqi}
            </Animated.Text>
            <Text style={s.gaugeUnit}>{t('usAqi')}</Text>
          </View>
        </View>

        {/* Info section below gauge */}
        <View style={s.infoSection}>
          <View style={s.timestampRow}>
            <MaterialCommunityIcons name="clock-outline" size={13} color="rgba(255,255,255,0.45)" />
            <Text style={s.timestampText}>{t('updated')} {timeStr}</Text>
            <View style={s.dot} />
            <Text style={s.timestampText}>{dateStr}</Text>
          </View>

          {dominantInfo && (
            <View style={[s.primaryPill, { backgroundColor: (cat.lightColor || cat.color) + '18', borderColor: (cat.lightColor || cat.color) + '35' }]}>
              <MaterialCommunityIcons name={dominantInfo.icon} size={14} color={cat.lightColor || cat.color} />
              <Text style={[s.primaryPillLabel, { color: cat.lightColor || cat.color }]}>{dominantInfo.label}</Text>
              <Text style={s.primaryPillSub}>{t('primaryPollutant')}</Text>
            </View>
          )}
        </View>

        {/* Tap hint + chevron */}
        <View style={s.tapHint}>
          <Text style={s.tapText}>{expanded ? t('tapToCollapse') : t('tapForBreakdown')}</Text>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <MaterialCommunityIcons name="chevron-down" size={16} color="rgba(255,255,255,0.45)" />
          </Animated.View>
        </View>

        {/* Expanded pollutant breakdown */}
        {expanded && pollutants && (
          <View style={s.breakdownWrap}>
            <View style={s.breakdownDivider} />
            <Text style={s.breakdownTitle}>{t('pollutantBreakdown')}</Text>
            <Text style={s.breakdownSub}>{t('breakdownSubtitle')}</Text>

            {pollutantData.items.map((item, idx) => (
              <AnimatedPollutantRow
                key={item.key}
                pKey={item.key}
                value={item.value}
                isDominant={item.key === pollutantData.dominantKey}
                index={idx}
              />
            ))}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

/* -----------------------------------------------
   Styles
   ----------------------------------------------- */
const s = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
    overflow: 'hidden',
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },

  /* Gauge */
  gaugeWrap: {
    width: GAUGE_W,
    height: GAUGE_H,
  },
  catOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  catText: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    textAlign: 'center',
    maxWidth: GR * 1.4,
    letterSpacing: 0.3,
  },
  gaugeAqi: {
    fontSize: 42,
    fontWeight: FONTS.bold,
    lineHeight: 48,
    marginTop: 2,
  },
  gaugeUnit: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop: -2,
  },

  /* Info section */
  infoSection: {
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: 8,
  },
  timestampRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timestampText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.50)',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  primaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    borderWidth: 1,
  },
  primaryPillLabel: {
    fontSize: 13,
    fontWeight: FONTS.bold,
  },
  primaryPillSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: FONTS.medium,
    marginLeft: 2,
  },

  /* Tap hint */
  tapHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.md,
  },
  tapText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    fontWeight: FONTS.medium,
  },

  /* Breakdown */
  breakdownWrap: {
    width: '100%',
    marginTop: SPACING.md,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: SPACING.md,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    marginBottom: 2,
  },
  breakdownSub: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.50)',
    marginBottom: SPACING.sm,
  },

  /* Pollutant rows */
  pollRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: RADIUS.md,
    marginBottom: 6,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  pollLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  pollIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pollLabel: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: PALETTE.white,
  },
  pollConc: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.50)',
    marginTop: 1,
  },
  dominantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  dominantText: {
    fontSize: 9,
    fontWeight: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pollRight: {
    alignItems: 'flex-end',
  },
  pollAqi: {
    fontSize: 18,
    fontWeight: FONTS.bold,
  },
  pollCatLabel: {
    fontSize: 10,
    fontWeight: FONTS.semiBold,
  },
});

AQIHeroCard.propTypes = {
  aqi: PropTypes.number.isRequired,
  updatedAt: PropTypes.string,
  pollutants: PropTypes.object,
};

export default AQIHeroCard;
