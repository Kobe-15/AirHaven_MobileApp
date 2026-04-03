/**
 * AnimatedBackground.js — Full-screen gradient backdrop with floating particles.
 *
 * Renders a light-blue linear gradient overlaid with three particle layers
 * (bubbles, dust, wisps) sourced from the shared ParticleSystem module.
 * Children are rendered on top via an absolute-fill content wrapper.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { LinearGradient } from 'expo-linear-gradient';
import { PALETTE } from '../constants/theme';
import {
  makeBubbles, makeDust, makeWisps,
  RisingBubble, DustParticle, WindWisp,
} from './ParticleSystem';

const SW = Dimensions.get('window').width;

/**
 * AnimatedBackground — light blue gradient with floating white particles.
 * Wraps children so they render on top of the animated backdrop.
 */
const AnimatedBackground = ({ children }) => {
  const bubbles = useMemo(() => makeBubbles(6, PALETTE.white, {
    sizeMin: 16, sizeMax: 56,
    opacityMin: 0.12, opacityMax: 0.30,
    riseMin: 6000, riseMax: 14000,
  }), []);

  const dust = useMemo(() => makeDust(8, PALETTE.white, {
    opacityMin: 0.18, opacityMax: 0.40,
    driftMin: 6000, driftMax: 14000,
  }), []);

  const wisps = useMemo(() => makeWisps(4, PALETTE.white, {
    opacityMin: 0.10, opacityMax: 0.25,
    slideMin: 4000, slideMax: 8000,
  }), []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4FA9E6', '#5BB5ED', '#6BC1F4', '#4FA9E6']}
        locations={[0, 0.35, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative gradient accent */}
      <View style={styles.bgGlow} />

      {/* Particle layers */}
      {bubbles.map((b) => <RisingBubble key={b.id} config={b} />)}
      {dust.map((d) => <DustParticle key={d.id} config={d} />)}
      {wisps.map((w) => <WindWisp key={w.id} config={w} />)}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

/* ─── Styles ─── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4FA9E6',
    overflow: 'hidden',
  },
  bgGlow: {
    position: 'absolute',
    top: -SW * 0.3,
    alignSelf: 'center',
    width: SW * 1.2,
    height: SW * 1.2,
    borderRadius: SW * 0.6,
    backgroundColor: PALETTE.white,
    opacity: 0.12,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  },
});

AnimatedBackground.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AnimatedBackground;
