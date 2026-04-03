/**
 * ParticleSystem.js — Reusable animated particle components.
 *
 * Provides three particle types (bubbles, dust, wisps) used by both
 * AnimatedBackground and SplashScreen. Each component is driven by
 * a configuration object generated at mount time.
 *
 * @exports makeBubbles  — Generate rising bubble configurations
 * @exports makeDust     — Generate drifting dust configurations
 * @exports makeWisps    — Generate horizontal wind wisp configurations
 * @exports RisingBubble — Animated rising bubble component
 * @exports DustParticle — Animated floating dust dot component
 * @exports WindWisp     — Animated horizontal streak component
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import PropTypes from 'prop-types';

const { width: SW, height: SH } = Dimensions.get('window');

/* ─── Configuration Generators ─── */

/**
 * Creates rising bubble configurations.
 * @param {number} count  — Number of bubbles to generate
 * @param {string} color  — Fill color for the bubbles
 * @param {object} [opts] — Optional overrides for size/speed ranges
 */
export const makeBubbles = (count, color = '#FFF', opts = {}) => {
  const {
    sizeMin = 16, sizeMax = 56,
    opacityMin = 0.10, opacityMax = 0.28,
    riseMin = 5000, riseMax = 13000,
  } = opts;
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `b${i}`,
      color,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      left: 5 + Math.random() * 90,
      delay: Math.random() * 3000,
      riseDuration: riseMin + Math.random() * (riseMax - riseMin),
      opacity: opacityMin + Math.random() * (opacityMax - opacityMin),
      swayAmount: 8 + Math.random() * 14,
      swaySpeed: 1400 + Math.random() * 1400,
    });
  }
  return items;
};

/**
 * Creates drifting dust particle configurations.
 * @param {number} count  — Number of dust particles
 * @param {string} color  — Fill color for the dots
 * @param {object} [opts] — Optional overrides
 */
export const makeDust = (count, color = '#FFF', opts = {}) => {
  const {
    sizeMin = 2, sizeMax = 5,
    opacityMin = 0.10, opacityMax = 0.30,
    driftMin = 5000, driftMax = 13000,
  } = opts;
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `d${i}`,
      color,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      startX: Math.random() * SW,
      startY: Math.random() * SH,
      delay: Math.random() * 3000,
      driftDuration: driftMin + Math.random() * (driftMax - driftMin),
      driftX: -40 + Math.random() * 80,
      driftY: -60 + Math.random() * -30,
      opacity: opacityMin + Math.random() * (opacityMax - opacityMin),
    });
  }
  return items;
};

/**
 * Creates horizontal wind wisp configurations.
 * @param {number} count  — Number of wisps
 * @param {string} color  — Fill color for the wisps
 * @param {object} [opts] — Optional overrides
 */
export const makeWisps = (count, color = '#FFF', opts = {}) => {
  const {
    widthMin = 50, widthMax = 150,
    opacityMin = 0.06, opacityMax = 0.18,
    slideMin = 3500, slideMax = 8000,
  } = opts;
  const items = [];
  for (let i = 0; i < count; i++) {
    items.push({
      id: `w${i}`,
      color,
      width: widthMin + Math.random() * (widthMax - widthMin),
      height: 1 + Math.random() * 1.2,
      top: 100 + Math.random() * (SH - 250),
      delay: Math.random() * 2500,
      slideDuration: slideMin + Math.random() * (slideMax - slideMin),
      opacity: opacityMin + Math.random() * (opacityMax - opacityMin),
    });
  }
  return items;
};

/* ─── Animated Particle Components ─── */

/** Bubble that rises from below the screen with gentle horizontal sway. */
export const RisingBubble = ({ config }) => {
  const translateY = useRef(new Animated.Value(SH + 50)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [];
    const timer = setTimeout(() => {
      const fadeAnim = Animated.timing(fadeIn, { toValue: 1, duration: 700, useNativeDriver: true });
      fadeAnim.start();
      animations.push(fadeAnim);

      const riseAnim = Animated.loop(
        Animated.timing(translateY, {
          toValue: -80,
          duration: config.riseDuration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      );
      riseAnim.start();
      animations.push(riseAnim);

      const swayAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(sway, {
            toValue: config.swayAmount,
            duration: config.swaySpeed,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(sway, {
            toValue: -config.swayAmount,
            duration: config.swaySpeed,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      );
      swayAnim.start();
      animations.push(swayAnim);
    }, config.delay);

    return () => {
      clearTimeout(timer);
      animations.forEach((a) => a.stop());
    };
  }, []);

  return (
    <Animated.View
      style={[
        s.bubble,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          left: `${config.left}%`,
          backgroundColor: config.color,
          opacity: fadeIn.interpolate({
            inputRange: [0, 1],
            outputRange: [0, config.opacity],
          }),
          transform: [{ translateY }, { translateX: sway }],
        },
      ]}
    />
  );
};

/** Tiny dot that drifts horizontally and upward with a pulsing fade. */
export const DustParticle = ({ config }) => {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const driftX = useRef(new Animated.Value(0)).current;
  const driftY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [];
    const timer = setTimeout(() => {
      const fadeAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(fadeIn, { toValue: 1, duration: 1300, useNativeDriver: true }),
          Animated.timing(fadeIn, { toValue: 0, duration: 1300, useNativeDriver: true }),
        ]),
      );
      fadeAnim.start();
      animations.push(fadeAnim);

      const dxAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(driftX, {
            toValue: config.driftX,
            duration: config.driftDuration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
          Animated.timing(driftX, {
            toValue: -config.driftX,
            duration: config.driftDuration,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.sin),
          }),
        ]),
      );
      dxAnim.start();
      animations.push(dxAnim);

      const dyAnim = Animated.loop(
        Animated.timing(driftY, {
          toValue: config.driftY,
          duration: config.driftDuration,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
      );
      dyAnim.start();
      animations.push(dyAnim);
    }, config.delay);

    return () => {
      clearTimeout(timer);
      animations.forEach((a) => a.stop());
    };
  }, []);

  return (
    <Animated.View
      style={[
        s.dustDot,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          left: config.startX,
          top: config.startY,
          backgroundColor: config.color,
          opacity: fadeIn.interpolate({
            inputRange: [0, 1],
            outputRange: [0, config.opacity],
          }),
          transform: [{ translateX: driftX }, { translateY: driftY }],
        },
      ]}
    />
  );
};

/** Thin horizontal streak that slides from left to right with a fade envelope. */
export const WindWisp = ({ config }) => {
  const slideX = useRef(new Animated.Value(-config.width)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [];
    const timer = setTimeout(() => {
      const slideAnim = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(slideX, { toValue: -config.width, duration: 0, useNativeDriver: true }),
            Animated.timing(fade, { toValue: 0, duration: 0, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(slideX, {
              toValue: SW + config.width,
              duration: config.slideDuration,
              useNativeDriver: true,
              easing: Easing.linear,
            }),
            Animated.sequence([
              Animated.timing(fade, {
                toValue: 1,
                duration: config.slideDuration * 0.3,
                useNativeDriver: true,
              }),
              Animated.timing(fade, {
                toValue: 1,
                duration: config.slideDuration * 0.4,
                useNativeDriver: true,
              }),
              Animated.timing(fade, {
                toValue: 0,
                duration: config.slideDuration * 0.3,
                useNativeDriver: true,
              }),
            ]),
          ]),
        ]),
      );
      slideAnim.start();
      animations.push(slideAnim);
    }, config.delay);

    return () => {
      clearTimeout(timer);
      animations.forEach((a) => a.stop());
    };
  }, []);

  return (
    <Animated.View
      style={[
        s.wisp,
        {
          width: config.width,
          height: config.height,
          top: config.top,
          backgroundColor: config.color,
          opacity: fade.interpolate({
            inputRange: [0, 1],
            outputRange: [0, config.opacity],
          }),
          transform: [{ translateX: slideX }],
        },
      ]}
    />
  );
};

/* ─── Minimal Styles ─── */

const s = StyleSheet.create({
  bubble: { position: 'absolute' },
  dustDot: { position: 'absolute' },
  wisp: { position: 'absolute', left: 0, borderRadius: 1 },
});

/* ─── PropTypes ─── */

const particleConfigShape = PropTypes.object.isRequired;

RisingBubble.propTypes = { config: particleConfigShape };
DustParticle.propTypes = { config: particleConfigShape };
WindWisp.propTypes = { config: particleConfigShape };
