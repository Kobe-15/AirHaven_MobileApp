/**
 * FullMapModal.js — Full-screen interactive sensor map modal.
 *
 * Displays a MapView with colored AQI markers for each sensor node.
 * Tapping a marker slides up a detail card showing AQI category,
 * pollutant readings, temperature, and humidity.
 *
 * @module FullMapModal
 * @exports FullMapModal
 */

import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  Animated, Dimensions, Platform,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getAQICategory, POLLUTANTS, getPollutantAQI } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const { width: SW } = Dimensions.get('window');

const INITIAL_REGION = {
  latitude: 14.59091,
  longitude: 120.98134,
  latitudeDelta: 0.004,
  longitudeDelta: 0.004,
};

// ─── Android: Leaflet HTML with custom AQI bubble markers ────────────────────
const buildLeafletHTML = (nodes) => {
  const markersJS = nodes.map((node) => {
    const cat = getAQICategory(node.aqi);
    return `
      var icon_${node.id} = L.divIcon({
        className: '',
        html: \`
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
          ">
            <div style="
              background: white;
              border: 2.5px solid ${cat.color};
              border-radius: 6px;
              padding: 3px 4px;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 3px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            ">
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1px;
              ">
                <div style="width:4px;height:4px;border-radius:50%;background:${cat.color};"></div>
                <div style="width:1.5px;height:5px;background:${cat.color};"></div>
                <div style="width:4px;height:4px;border-radius:50%;background:${cat.color};"></div>
              </div>
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 1px;
              ">
                <div style="
                  background: ${cat.color};
                  border-radius: 3px;
                  padding: 1px 5px;
                ">
                  <span style="
                    color: ${cat.badgeText || '#fff'};
                    font-size: 11px;
                    font-weight: bold;
                    font-family: sans-serif;
                    line-height: 15px;
                  ">${node.aqi}</span>
                </div>
                <span style="font-size:9px;">⚡</span>
              </div>
            </div>
            <div style="
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-top: 7px solid ${cat.color};
              margin-top: -1px;
            "></div>
          </div>
        \`,
        iconAnchor: [22, 42],
        iconSize: [44, 42],
      });

      var marker_${node.id} = L.marker(
        [${node.latitude}, ${node.longitude}],
        { icon: icon_${node.id} }
      ).addTo(map);

      marker_${node.id}.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        window.ReactNativeWebView.postMessage(JSON.stringify({ id: "${node.id}" }));
      });
    `;
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #map { width: 100%; height: 100%; background: #0A2A66; }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView(
            [${INITIAL_REGION.latitude}, ${INITIAL_REGION.longitude}], 17
          );
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);

          map.on('click', function() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ id: null }));
          });

          ${markersJS}
        </script>
      </body>
    </html>
  `;
};

/** FullMapModal — see module JSDoc above for details. */
const FullMapModal = ({ visible, onClose, nodes }) => {
  const { t, tCat } = useTheme();
  const [selectedNode, setSelectedNode] = useState(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const showCard = (node) => {
    setSelectedNode(node);
    Animated.spring(slideAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  };

  const hideCard = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedNode(null));
  };

  const handleMarkerPress = (node) => {
    if (selectedNode?.id === node.id) {
      hideCard();
    } else {
      showCard(node);
    }
  };

  const handleMapPress = () => {
    if (selectedNode) hideCard();
  };

  // ── Android: handle messages from Leaflet markers ──
  const handleWebViewMessage = (event) => {
    try {
      const { id } = JSON.parse(event.nativeEvent.data);
      if (!id) {
        handleMapPress();
      } else {
        const node = nodes.find((n) => String(n.id) === String(id));
        if (node) handleMarkerPress(node);
      }
    } catch (_) {}
  };

  const cardTranslateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={s.container}>

        {/* ── Map area ── */}
        {Platform.OS === 'android' ? (
          <WebView
            style={StyleSheet.absoluteFill}
            source={{ html: buildLeafletHTML(nodes) }}
            originWhitelist={['*']}
            javaScriptEnabled
            onMessage={handleWebViewMessage}
          />
        ) : (
          <MapView
            style={StyleSheet.absoluteFill}
            initialRegion={INITIAL_REGION}
            showsUserLocation={false}
            showsCompass={false}
            showsScale={false}
            mapType="none"
            userInterfaceStyle="dark"
            onPress={handleMapPress}
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            {nodes.map((node) => {
              const cat = getAQICategory(node.aqi);
              const isSelected = selectedNode?.id === node.id;
              return (
                <Marker
                  key={node.id}
                  coordinate={{ latitude: node.latitude, longitude: node.longitude }}
                  onPress={() => handleMarkerPress(node)}
                  anchor={{ x: 0.5, y: 1 }}
                >
                  <View style={s.pinWrap}>
                    <View style={[
                      s.pinBox,
                      { borderColor: cat.color },
                      isSelected && s.pinBoxActive,
                    ]}>
                      <View style={s.pinInner}>
                        <View style={s.pinSensors}>
                          <View style={[s.pinSensorDot, { backgroundColor: cat.color }]} />
                          <View style={[s.pinSensorLine, { backgroundColor: cat.color }]} />
                          <View style={[s.pinSensorDot, { backgroundColor: cat.color }]} />
                        </View>
                        <View style={s.pinRight}>
                          <View style={[s.pinDisplay, { backgroundColor: cat.color }]}>
                            <Text style={[s.pinAqi, { color: cat.badgeText || '#FFF' }]}>{node.aqi}</Text>
                          </View>
                          <MaterialCommunityIcons name="flash" size={10} color={cat.color} />
                        </View>
                      </View>
                    </View>
                    <View style={[s.pinArrow, { borderTopColor: cat.color }]} />
                  </View>
                </Marker>
              );
            })}
          </MapView>
        )}

        {/* Close button */}
        <TouchableOpacity
          style={s.closeBtn}
          onPress={onClose}
          activeOpacity={0.7}
          accessibilityLabel="Close map"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons name="close" size={22} color={PALETTE.white} />
        </TouchableOpacity>

        {/* Title bar */}
        <View style={s.titleBar}>
          <MaterialCommunityIcons name="map-marker-radius" size={16} color={PALETTE.white} />
          <Text style={s.titleText}>{t('sensorMap')}</Text>
          <View style={s.titleBadge}>
            <Text style={s.titleBadgeTxt}>{nodes.length} {t('nodesCount')}</Text>
          </View>
        </View>

        {/* Selected node detail card */}
        {selectedNode && (
          <Animated.View
            style={[
              s.detailCard,
              { transform: [{ translateY: cardTranslateY }] },
            ]}
          >
            <NodeInfoCard node={selectedNode} tCat={tCat} t={t} />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};

/* ─── Node Info Card ─── */
const NodeInfoCard = ({ node, tCat, t }) => {
  const cat = tCat(getAQICategory(node.aqi));

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={[s.cardDot, { backgroundColor: cat.color }]} />
        <View style={s.cardHeaderInfo}>
          <Text style={s.cardName}>{node.name}</Text>
          <Text style={s.cardCoords}>
            {node.latitude.toFixed(5)}°N, {node.longitude.toFixed(5)}°E
          </Text>
        </View>
        <View style={[s.aqiBadge, { backgroundColor: cat.color }]}>
          <Text style={[s.aqiBadgeTxt, { color: cat.badgeText || '#000' }]}>{node.aqi}</Text>
          <Text style={[s.aqiBadgeLabel, { color: cat.badgeText || '#000' }]}>AQI</Text>
        </View>
      </View>

      <View style={[s.catPill, { backgroundColor: cat.color + '20', borderColor: cat.color + '40' }]}>
        <MaterialCommunityIcons name={cat.icon} size={13} color={cat.lightColor || cat.color} />
        <Text style={[s.catPillText, { color: cat.lightColor || cat.color }]}>{cat.label}</Text>
      </View>

      <View style={s.envRow}>
        <View style={s.envItem}>
          <MaterialCommunityIcons name="thermometer" size={16} color="#FF6B6B" />
          <Text style={s.envValue}>{node.temperature}°C</Text>
          <Text style={s.envLabel}>{t('temp')}</Text>
        </View>
        <View style={s.envDivider} />
        <View style={s.envItem}>
          <MaterialCommunityIcons name="water-percent" size={16} color="#4ECDC4" />
          <Text style={s.envValue}>{node.humidity}%</Text>
          <Text style={s.envLabel}>{t('humidity')}</Text>
        </View>
      </View>

      <View style={s.pollGrid}>
        {Object.entries(node.pollutants).map(([key, val]) => {
          const info = POLLUTANTS[key];
          if (!info) return null;
          const pResult = getPollutantAQI(key, val);
          const pCat = pResult ? getAQICategory(pResult.aqi) : cat;
          return (
            <View key={key} style={s.pollItem}>
              <View style={s.pollItemTop}>
                <MaterialCommunityIcons name={info.icon} size={13} color={pCat.lightColor || pCat.color} />
                <Text style={s.pollItemLabel}>{info.label}</Text>
              </View>
              <Text style={s.pollItemValue}>{val} <Text style={s.pollItemUnit}>{info.unit}</Text></Text>
              {pResult && (
                <View style={[s.pollAqiPill, { backgroundColor: pCat.color + '25' }]}>
                  <Text style={[s.pollAqiText, { color: pCat.lightColor || pCat.color }]}>AQI {pResult.aqi}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A2A66' },
  pinWrap: { alignItems: 'center' },
  pinBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 6,
    padding: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pinBoxActive: { transform: [{ scale: 1.15 }], borderWidth: 2.5 },
  pinInner: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pinSensors: { alignItems: 'center', gap: 1 },
  pinSensorDot: { width: 4, height: 4, borderRadius: 2 },
  pinSensorLine: { width: 1.5, height: 5 },
  pinRight: { alignItems: 'center', gap: 1 },
  pinDisplay: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3 },
  pinAqi: { fontSize: 11, fontWeight: FONTS.bold, lineHeight: 14 },
  pinArrow: {
    width: 0, height: 0,
    borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    marginTop: -1,
  },
  closeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 42,
    right: 16,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(15,38,71,0.85)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 10,
  },
  titleBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 42,
    left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(15,38,71,0.85)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: RADIUS.round,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  titleText: { fontSize: 14, fontWeight: FONTS.bold, color: PALETTE.white },
  titleBadge: {
    backgroundColor: PALETTE.brightBlue + '25',
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  titleBadgeTxt: { fontSize: 10, fontWeight: FONTS.bold, color: PALETTE.brightBlue },
  detailCard: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: Platform.OS === 'ios' ? 34 : 16 },
  card: {
    marginHorizontal: 12,
    backgroundColor: 'rgba(15,38,71,0.92)',
    borderRadius: RADIUS.xxl,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardDot: { width: 10, height: 10, borderRadius: 5 },
  cardHeaderInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: FONTS.bold, color: PALETTE.white },
  cardCoords: { fontSize: 10, fontWeight: FONTS.medium, color: 'rgba(255,255,255,0.45)', marginTop: 1 },
  aqiBadge: { alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.lg, minWidth: 52 },
  aqiBadgeTxt: { fontSize: 22, fontWeight: FONTS.bold, lineHeight: 24 },
  aqiBadgeLabel: { fontSize: 8, fontWeight: FONTS.bold, letterSpacing: 1, marginTop: -1 },
  catPill: {
    flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
    gap: 5, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: RADIUS.round, borderWidth: 1, marginTop: SPACING.sm,
  },
  catPillText: { fontSize: 11, fontWeight: FONTS.bold },
  envRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginTop: SPACING.sm + 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.lg, paddingVertical: 10,
  },
  envItem: { flex: 1, alignItems: 'center', gap: 2 },
  envValue: { fontSize: 16, fontWeight: FONTS.bold, color: PALETTE.white },
  envLabel: { fontSize: 9, fontWeight: FONTS.medium, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5 },
  envDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.12)' },
  pollGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: SPACING.sm + 2, gap: 6 },
  pollItem: {
    width: (SW - 12 * 2 - SPACING.md * 2 - 6 * 2) / 3,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.md, padding: 8, gap: 3,
  },
  pollItemTop: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pollItemLabel: { fontSize: 10, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.55)' },
  pollItemValue: { fontSize: 13, fontWeight: FONTS.bold, color: PALETTE.white },
  pollItemUnit: { fontSize: 9, fontWeight: FONTS.medium, color: 'rgba(255,255,255,0.40)' },
  pollAqiPill: { alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 1, borderRadius: RADIUS.round },
  pollAqiText: { fontSize: 9, fontWeight: FONTS.bold },
});

NodeInfoCard.propTypes = {
  node: PropTypes.object.isRequired,
  tCat: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

FullMapModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  nodes: PropTypes.array.isRequired,
};

export default FullMapModal;