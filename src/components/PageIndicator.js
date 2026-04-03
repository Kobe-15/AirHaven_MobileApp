/**
 * PageIndicator.js — Animated dot indicators for horizontal paging.
 *
 * Displays a row of dots that scale and fade based on the current
 * scroll position, providing visual feedback for the active page
 * in the dashboard’s horizontal pager.
 *
 * @module PageIndicator
 * @exports PageIndicator
 */

import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { PALETTE, RADIUS } from '../constants/theme';

/**
 * @param {object} props
 * @param {number} props.count    - Total number of pages
 * @param {Animated.Value} props.scrollX  - Horizontal scroll offset
 * @param {number} props.pageWidth - Width of each page (screen width)
 */
const PageIndicator = ({ count, scrollX, pageWidth }) => {
  return (
    <View style={s.container}>
      <View style={s.dotsRow}>
        {Array.from({ length: count }).map((_, i) => {
          /* Interpolate scale and opacity based on scroll position */
          const inputRange = [
            (i - 1) * pageWidth,
            i * pageWidth,
            (i + 1) * pageWidth,
          ];

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.3, 0.8],
            extrapolate: 'clamp',
          });

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i}
              style={[
                s.dot,
                {
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 99,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(15,38,71,0.70)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.round,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PALETTE.white,
  },
});

PageIndicator.propTypes = {
  count: PropTypes.number.isRequired,
  scrollX: PropTypes.object.isRequired,
  pageWidth: PropTypes.number.isRequired,
};

export default PageIndicator;
