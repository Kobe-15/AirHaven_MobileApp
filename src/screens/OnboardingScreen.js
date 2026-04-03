/**
 * OnboardingScreen.js — Swipeable introduction walkthrough.
 *
 * Presents 4 gradient-themed pages introducing AirHaven’s features:
 * air quality monitoring, live sensor data, health insights, and
 * area coverage. Includes animated entrance, dot indicators, skip/next
 * navigation, and a final “Get Started” action.
 *
 * @module OnboardingScreen
 * @exports OnboardingScreen
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  useWindowDimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { PALETTE, FONTS, SPACING, RADIUS } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

/* ────────────────────────────────────────
   Onboarding Data
   ──────────────────────────────────────── */
const getPages = (t) => [
  {
    icon: 'shield-check-outline',
    title: t('onboardingTitle1'),
    subtitle: t('onboardingSub1'),
    body: t('onboardingBody1'),
    gradient: [PALETTE.navy, PALETTE.deepBlue],
    accent: PALETTE.lightBlue,
  },
  {
    icon: 'access-point',
    title: t('onboardingTitle2'),
    subtitle: t('onboardingSub2'),
    body: t('onboardingBody2'),
    gradient: [PALETTE.deepBlue, PALETTE.brightBlue],
    accent: PALETTE.skyBlue,
  },
  {
    icon: 'heart-pulse',
    title: t('onboardingTitle3'),
    subtitle: t('onboardingSub3'),
    body: t('onboardingBody3'),
    gradient: [PALETTE.brightBlue, PALETTE.lightBlue],
    accent: PALETTE.white,
  },
  {
    icon: 'map-marker-radius-outline',
    title: t('onboardingTitle4'),
    subtitle: t('onboardingSub4'),
    body: t('onboardingBody4'),
    gradient: [PALETTE.deepBlue, '#1A3F78'],
    accent: PALETTE.lightBlue,
  },
];

/* ────────────────────────────────────────
   Dot Indicator
   ──────────────────────────────────────── */
const DotIndicator = ({ total, current }) => (
  <View style={styles.dotRow}>
    {Array.from({ length: total }, (_, i) => (
      <Animated.View
        key={i}
        style={[
          styles.dot,
          {
            backgroundColor: i === current ? PALETTE.white : 'rgba(255,255,255,0.35)',
            width: i === current ? 24 : 8,
          },
        ]}
      />
    ))}
  </View>
);

/* ────────────────────────────────────────
   Onboarding Page
   ──────────────────────────────────────── */
const OnboardingPage = ({ page, width }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.page, { width }]}>
      <LinearGradient colors={page.gradient} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      {/* Decorative circles */}
      <View style={[styles.decoCircle, styles.decoCircle1, { borderColor: page.accent + '15' }]} />
      <View style={[styles.decoCircle, styles.decoCircle2, { borderColor: page.accent + '10' }]} />
      <View style={[styles.decoCircle, styles.decoCircle3, { backgroundColor: page.accent + '06' }]} />

      <Animated.View style={[styles.content, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Icon with glow */}
        <View style={[styles.iconContainer, { backgroundColor: page.accent + '18' }]}>
          <MaterialCommunityIcons name={page.icon} size={52} color={page.accent} />
        </View>

        {/* Text */}
        <Text style={styles.title}>{page.title}</Text>
        <Text style={[styles.subtitle, { color: page.accent }]}>{page.subtitle}</Text>
        <Text style={styles.body}>{page.body}</Text>
      </Animated.View>
    </View>
  );
};

/* ────────────────────────────────────────
   Onboarding Screen
   ──────────────────────────────────────── */
const OnboardingScreen = ({ onComplete }) => {
  const { width } = useWindowDimensions();
  const { t } = useTheme();
  const PAGES = getPages(t);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef(null);
  const isLast = currentPage === PAGES.length - 1;

  const onScroll = useCallback((e) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    if (page !== currentPage && page >= 0 && page < PAGES.length) {
      setCurrentPage(page);
    }
  }, [currentPage, width]);

  const goNext = () => {
    if (isLast) {
      onComplete?.();
    } else {
      scrollRef.current?.scrollTo({ x: (currentPage + 1) * width, animated: true });
    }
  };

  const skip = () => {
    onComplete?.();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Pages */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width}
        snapToAlignment="start"
      >
        {PAGES.map((page, idx) => (
          <OnboardingPage key={idx} page={page} width={width} isLast={idx === PAGES.length - 1} onGetStarted={onComplete} />
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomBar}>
        {/* Dots */}
        <DotIndicator total={PAGES.length} current={currentPage} />

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {!isLast ? (
            <TouchableOpacity onPress={skip} activeOpacity={0.7} accessibilityLabel="Skip onboarding" accessibilityRole="button">
              <Text style={styles.skipText}>{t('skip')}</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}

          <TouchableOpacity
            style={[styles.nextButton, isLast && styles.getStartedButton]}
            onPress={goNext}
            activeOpacity={0.85}
            accessibilityLabel={isLast ? "Get Started" : "Next page"}
            accessibilityRole="button"
          >
            {isLast ? (
              <Text style={styles.getStartedText}>{t('getStarted')}</Text>
            ) : (
              <MaterialCommunityIcons name="arrow-right" size={22} color={PALETTE.navy} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ────────────────────────────────────────
   Styles
   ──────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.navy,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /* Decorative circles */
  decoCircle: {
    position: 'absolute',
    borderRadius: 999,
  },
  decoCircle1: {
    width: 300,
    height: 300,
    borderWidth: 1,
    top: '8%',
    right: '-15%',
  },
  decoCircle2: {
    width: 200,
    height: 200,
    borderWidth: 1,
    bottom: '20%',
    left: '-10%',
  },
  decoCircle3: {
    width: 160,
    height: 160,
    top: '35%',
    right: '-8%',
  },

  /* Content */
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    maxWidth: 380,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: FONTS.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.md,
    letterSpacing: 0.5,
  },
  body: {
    fontSize: 15,
    fontWeight: FONTS.regular,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },

  /* Bottom bar */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 48,
    paddingHorizontal: SPACING.lg,
  },
  dotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 15,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.60)',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  nextButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: PALETTE.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  getStartedButton: {
    width: 'auto',
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.round,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.navy,
    letterSpacing: 0.3,
  },
});

OnboardingScreen.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default OnboardingScreen;
