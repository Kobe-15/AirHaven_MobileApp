/**
 * SplashScreen.js — Branded loading screen with animated particles.
 *
 * Displays the AirHaven logo, app name, and tagline over a white
 * background with floating bubble, dust, and wisp particles imported
 * from the shared ParticleSystem module. Automatically transitions
 * out after the specified duration.
 */

import React, { useEffect, useRef, useMemo } from 'react';
import {
  View, Image, StyleSheet, Animated, Easing,
  StatusBar, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import { PALETTE, FONTS, SPACING } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import {
  makeBubbles, makeDust, makeWisps,
  RisingBubble, DustParticle, WindWisp,
} from '../components/ParticleSystem';

const SW = Dimensions.get('window').width;

/**
 * SplashScreen — white bg, rising bubbles, floating dust, wind wisps, breathing logo aura.
 */
const SplashScreen = ({ onFinish, duration = 3500 }) => {
  const { t } = useTheme();

  /* Generate particle configurations with splash-specific appearance */
  const bubbles = useMemo(() => makeBubbles(8, PALETTE.brightBlue, {
    sizeMin: 20, sizeMax: 70,
    opacityMin: 0.06, opacityMax: 0.20,
    riseMin: 4000, riseMax: 9000,
  }), []);

  const dust = useMemo(() => makeDust(10, PALETTE.lightBlue, {
    sizeMax: 6,
    opacityMin: 0.08, opacityMax: 0.20,
    driftMin: 5000, driftMax: 11000,
  }), []);

  const wisps = useMemo(() => makeWisps(6, PALETTE.brightBlue, {
    widthMin: 60, widthMax: 180,
    opacityMin: 0.05, opacityMax: 0.13,
    slideMin: 3000, slideMax: 6000,
  }), []);

  /* ── Animated values ── */
  const logoFade    = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.55)).current;
  const titleFade   = useRef(new Animated.Value(0)).current;
  const titleSlide  = useRef(new Animated.Value(24)).current;
  const taglineFade = useRef(new Animated.Value(0)).current;
  const exitFade    = useRef(new Animated.Value(1)).current;



  useEffect(() => {
    /* Phase 1 — Logo spring in */
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1, duration: 800,
        useNativeDriver: true, easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(logoScale, {
        toValue: 1, tension: 28, friction: 5, useNativeDriver: true,
      }),
    ]).start();



    /* Phase 2 — Title slide */
    const t1 = setTimeout(() => {
      Animated.parallel([
        Animated.timing(titleFade, { toValue: 1, duration: 550, useNativeDriver: true }),
        Animated.timing(titleSlide, {
          toValue: 0, duration: 550, useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]).start();
    }, 450);

    /* Phase 3 — Tagline */
    const t2 = setTimeout(() => {
      Animated.timing(taglineFade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    }, 800);

    /* Exit */
    const tExit = setTimeout(() => {
      Animated.timing(exitFade, {
        toValue: 0, duration: 600,
        useNativeDriver: true, easing: Easing.in(Easing.cubic),
      }).start(() => onFinish?.());
    }, duration);

    return () => {
      [t1, t2, tExit].forEach(clearTimeout);
    };
  }, [duration]);

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Soft background accent */}
      <View style={styles.bgAccent} />

      {/* ── Air particles layer ── */}
      {bubbles.map(b => <RisingBubble key={b.id} config={b} />)}
      {dust.map(d => <DustParticle key={d.id} config={d} />)}
      {wisps.map(w => <WindWisp key={w.id} config={w} />)}

      {/* ── Center content ── */}
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={{
          opacity: logoFade,
          transform: [{ scale: logoScale }],
          marginBottom: SPACING.md,
        }}>
          <Image
            source={require('../../assets/airhaven_logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="AirHaven logo"
          />
        </Animated.View>

        <Animated.Text style={[styles.appName, {
          opacity: titleFade,
          transform: [{ translateY: titleSlide }],
        }]}>
          AirHaven
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: taglineFade }]}>
          {t('tagline')}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },

  bgAccent: {
    position: 'absolute',
    top: -SW * 0.4,
    alignSelf: 'center',
    width: SW * 1.3,
    height: SW * 1.3,
    borderRadius: SW * 0.65,
    backgroundColor: PALETTE.paleBlue || '#E8F4FD',
    opacity: 0.35,
  },

  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },

  logo: {
    width: 150,
    height: 150,
  },

  appName: {
    fontSize: 36,
    fontWeight: FONTS.bold,
    color: PALETTE.navy,
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  tagline: {
    fontSize: 15,
    fontWeight: FONTS.regular,
    color: PALETTE.deepBlue,
    opacity: 0.5,
    letterSpacing: 0.3,
  },
});

SplashScreen.propTypes = {
  onFinish: PropTypes.func.isRequired,
  duration: PropTypes.number,
};

export default SplashScreen;
