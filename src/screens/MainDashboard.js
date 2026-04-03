/**
 * MainDashboard.js — Primary application screen with horizontal paging.
 *
 * Contains an overview page (hero card, forecasts, map, health tips)
 * followed by individual node detail pages. Uses an Animated.FlatList
 * horizontal pager with scale/opacity transitions on swipe.
 * Also manages the settings modal, AQI alert modal, and full map modal.
 *
 * @module MainDashboard
 * @exports MainDashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView, View, Text, StyleSheet, StatusBar, Platform,
  Animated, Dimensions, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { getAQICategory } from '../constants/aqi';
import { useTheme } from '../constants/ThemeContext';

import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import AQIHeroCard from '../components/AQIHeroCard';
import HourlyForecast from '../components/HourlyForecast';
import PollutantBreakdown from '../components/PollutantBreakdown';
import MiniMap from '../components/MiniMap';
import HealthRecommendations from '../components/HealthRecommendations';
import WeeklyForecast from '../components/WeeklyForecast';
import EnvironmentCards from '../components/EnvironmentCards';
import SettingsModal from '../components/SettingsModal';
import AQIAlertModal from '../components/AQIAlertModal';
import AQIReference from '../components/AQIReference';
import PageIndicator from '../components/PageIndicator';
import FullMapModal from '../components/FullMapModal';
import NodeDetailScreen from './NodeDetailScreen';

import { useLiveData } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AQI_ALERT_THRESHOLD = 150;

/* ─── Overview page (original main dashboard content) ─── */
const OverviewPage = ({ current, hourly, weekly, nodes, onSettings, error }) => {
  const { t, tCat } = useTheme();
  const overallCat = getAQICategory(current.aqi);
  return (
  <View style={{ flex: 1 }}>
    <ScrollView
      style={s.scroll}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
      scrollEnabled={true}
      disableScrollViewPanResponder={true}  // ← lets child map capture pan gestures
    >
      <Header onSettings={onSettings} />

      {/* ─── Offline / error banner ─── */}
      {error && (
        <View style={s.errorBanner}>
          <MaterialCommunityIcons name="wifi-off" size={14} color="#FFB347" />
          <Text style={s.errorText}>Showing last known data</Text>
        </View>
      )}

      {/* ─── Dashboard badge + node summary ─── */}
      <View style={s.dashBanner}>
        <View style={s.dashBadge}>
          <MaterialCommunityIcons name="view-dashboard" size={13} color={PALETTE.white} />
          <Text style={s.dashBadgeText}>{t('dashboardOverview')}</Text>
        </View>
        <View style={s.nodeChips}>
          {nodes.map((n) => {
            const nCat = getAQICategory(n.aqi);
            return (
              <View key={n.id} style={[s.nodeChip, { borderColor: nCat.color + '50' }]}>
                <View style={[s.nodeChipDot, { backgroundColor: nCat.color }]} />
                <Text style={s.nodeChipName}>{n.name}</Text>
                <Text style={[s.nodeChipAqi, { color: nCat.lightColor || nCat.color }]}>{n.aqi}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={s.hero}>
        <AQIHeroCard
          aqi={current.aqi}
          updatedAt={current.updatedAt}
          pollutants={current.pollutants}
        />
      </View>

      <View style={s.gap}>
        <AQIReference aqi={current.aqi} />
      </View>

      <View style={s.gap}>
        <HealthRecommendations aqi={current.aqi} />
      </View>

      <View style={s.gap}>
        <EnvironmentCards temperature={current.temperature} humidity={current.humidity} />
      </View>

      <View style={s.gap}>
        <PollutantBreakdown pollutants={current.pollutants} />
      </View>

      {/* ─── Hourly Forecast — only shown when Firebase has forecast data ─── */}
      {hourly?.length > 0 && (
        <View style={s.gap}>
          <HourlyForecast data={hourly} />
        </View>
      )}

      {/* ─── Weekly Forecast — only shown when Firebase has forecast data ─── */}
      {weekly?.length > 0 && (
        <View style={s.gap}>
          <WeeklyForecast data={weekly} />
        </View>
      )}

      <View style={s.gap}>
        <MiniMap nodes={nodes} />
      </View>

      <Text style={s.footer}>AirHaven {new Date().getFullYear()}</Text>
      <View style={{ height: SPACING.xxl + SPACING.lg }} />
    </ScrollView>
  </View>
  );
};

/* ─── Helper: darken a hex color ─── */
const darkenHex = (hex, amount = 0.4) => {
  const h = hex.replace('#', '');
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - amount));
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - amount));
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - amount));
  return `rgb(${r},${g},${b})`;
};

/* ─── Node page wrapper — fully AQI-colored background ─── */
const NodePage = ({ node }) => {
  const cat = getAQICategory(node.aqi);
  const base = cat.color;
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[darkenHex(base, 0.25), darkenHex(base, 0.55), darkenHex(base, 0.72)]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <NodeDetailScreen node={node} />
    </View>
  );
};

/**
 * MainDashboard — horizontal pager with overview + individual node pages.
 * Smooth scale/opacity transition on swipe.
 */
const MainDashboard = () => {
  const { nodes, current, hourly, weekly, loading, error } = useLiveData(5000);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const lastAlertTime = useRef(null);
  const COOLDOWN_MS = 2 * 60 * 1000;
  const scrollX = useRef(new Animated.Value(0)).current;

  // Pages: overview + one per node
  const pageCount = 1 + nodes.length;

  /* Show alert automatically when AQI crosses the threshold */
  useEffect(() => {
  if (current.aqi >= AQI_ALERT_THRESHOLD) {
    const now = Date.now();
    const cooldownPassed = !lastAlertTime.current || now - lastAlertTime.current >= COOLDOWN_MS;

    if (cooldownPassed) {
      lastAlertTime.current = now;
      setAlertVisible(false);
      setTimeout(() => setAlertVisible(true), 100);
    }
  } else {
    setAlertVisible(false);
  }
}, [current.aqi]);

  const renderPage = ({ item, index }) => {
    const inputRange = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
      extrapolate: 'clamp',
    });

    const content = index === 0 ? (
      <OverviewPage
        current={current}
        hourly={hourly}
        weekly={weekly}
        nodes={nodes}
        onSettings={() => setSettingsVisible(true)}
        error={error}
      />
    ) : (
      <NodePage node={item} />
    );

    return (
      <Animated.View style={{ width: SCREEN_WIDTH, flex: 1, transform: [{ scale }], opacity }}>
        {content}
      </Animated.View>
    );
  };

  const pagesData = [{ id: 'overview' }, ...nodes];

  if (loading) {
    return (
      <SafeAreaView style={s.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <AnimatedBackground>
          <View style={s.loadingWrap}>
            <ActivityIndicator size="large" color={PALETTE.brightBlue} />
            <Text style={s.loadingText}>Fetching air quality data...</Text>
          </View>
        </AnimatedBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <AnimatedBackground>
        <Animated.FlatList
          data={pagesData}
          keyExtractor={(item) => item.id}
          renderItem={renderPage}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true },
          )}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />

        <PageIndicator
          count={pageCount}
          scrollX={scrollX}
          pageWidth={SCREEN_WIDTH}
        />

        {/* Map FAB — bottom left */}
        <TouchableOpacity
          style={s.mapFab}
          activeOpacity={0.8}
          onPress={() => setMapVisible(true)}
          accessibilityLabel="Open full map"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="map-marker-radius" size={22} color={PALETTE.white} />
        </TouchableOpacity>
      </AnimatedBackground>

      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      <AQIAlertModal
        visible={alertVisible}
        aqi={current.aqi}
        onDismiss={() => setAlertVisible(false)}
      />

      <FullMapModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
        nodes={nodes}
      />
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#4FA9E6' },
  scroll: { flex: 1 },
  content: { paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.xl },
  hero: { marginTop: SPACING.xs },
  gap: { marginTop: SPACING.md + 4 },

  /* Dashboard emphasis banner */
  dashBanner: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  dashBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.sm,
  },
  dashBadgeText: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    letterSpacing: 0.5,
  },
  nodeChips: {
    flexDirection: 'row',
    gap: 8,
  },
  nodeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(15,38,71,0.50)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: RADIUS.round,
  },
  nodeChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  nodeChipName: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.70)',
  },
  nodeChipAqi: {
    fontSize: 12,
    fontWeight: FONTS.bold,
  },

  /* Map FAB */
  mapFab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 46 : 38,
    left: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15,38,71,0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },

  footer: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.50)',
    letterSpacing: 0.5,
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xs,
  },

  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: FONTS.semiBold,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,179,71,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,179,71,0.30)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    color: '#FFB347',
    fontWeight: FONTS.semiBold,
  },
});

OverviewPage.propTypes = {
  current: PropTypes.object,
  hourly: PropTypes.array,
  weekly: PropTypes.array,
  nodes: PropTypes.array,
  onSettings: PropTypes.func,
  error: PropTypes.string,
};

NodePage.propTypes = {
  node: PropTypes.object.isRequired,
};

export default MainDashboard;