/**
 * MiniMap.js — Compact map card displaying sensor node locations (native).
 */

import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getAQICategory } from '../constants/aqi';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const INITIAL_REGION = {
  latitude: 14.59091,
  longitude: 120.98134,
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

// ─── Android: Leaflet map with custom AQI bubble markers ──────────────────────
const buildLeafletHTML = (nodes) => {
  const markersJS = nodes
    .map((node) => {
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
                border-radius: 5px;
                padding: 2px 3px;
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 3px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
              ">
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  gap: 1px;
                ">
                  <div style="width:3px;height:3px;border-radius:50%;background:${cat.color};"></div>
                  <div style="width:1px;height:5px;background:${cat.color};"></div>
                  <div style="width:3px;height:3px;border-radius:50%;background:${cat.color};"></div>
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
                    padding: 0px 4px;
                  ">
                    <span style="
                      color: ${cat.badgeText || '#fff'};
                      font-size: 10px;
                      font-weight: bold;
                      font-family: sans-serif;
                      line-height: 14px;
                    ">${node.aqi}</span>
                  </div>
                  <span style="font-size:8px;">⚡</span>
                </div>
              </div>
              <div style="
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 6px solid ${cat.color};
                margin-top: -1px;
              "></div>
            </div>
          \`,
          iconAnchor: [20, 36],
          iconSize: [40, 36],
        });

        L.marker([${node.latitude}, ${node.longitude}], { icon: icon_${node.id} })
          .addTo(map)
          .bindPopup("<b>${node.name}</b><br>AQI: ${node.aqi} — ${cat.label}");
      `;
    })
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body, #map {
            width: 100%;
            height: 100%;
            background: #0f2647;
            touch-action: none;
            overflow: hidden;
          }
          .leaflet-container {
            touch-action: none;
          }
          .leaflet-control-attribution { display: none; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            zoomControl: false,
            dragging: true,
            inertia: true,
            inertiaDeceleration: 3000,
            touchZoom: true,
            tap: false,
            tapTolerance: 15,
            scrollWheelZoom: false,
            bounceAtZoomLimits: false,
          }).setView(
            [${INITIAL_REGION.latitude}, ${INITIAL_REGION.longitude}], 17
          );
          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19
          }).addTo(map);
          ${markersJS}
        </script>
      </body>
    </html>
  `;
};

// ─── Component ─────────────────────────────────────────────────────────────────
const MiniMap = ({ nodes }) => {
  const { t } = useTheme();

  return (
    <View style={s.card}>
      {/* Header */}
      <View style={s.header}>
        <MaterialCommunityIcons name="map-marker-radius" size={15} color={PALETTE.brightBlue} />
        <Text style={s.title}>{t('sensorNodes')}</Text>
        <View style={s.badge}>
          <Text style={s.badgeTxt}>{nodes.length} {t('active')}</Text>
        </View>
      </View>

      {/* Map area — responder props fully removed for Android WebView compatibility */}
      <View style={s.mapWrap}>
        {Platform.OS === 'android' ? (
          <WebView
            style={StyleSheet.absoluteFill}
            source={{ html: buildLeafletHTML(nodes) }}
            originWhitelist={['*']}
            javaScriptEnabled
            nestedScrollEnabled={true}
            overScrollMode="never"
            scrollEnabled={false}
            setBuiltInZoomControls={false}
            androidLayerType="hardware"
          />
        ) : (
          <MapView
            style={s.map}
            initialRegion={INITIAL_REGION}
            scrollEnabled={false}
            zoomEnabled={false}
            pitchEnabled={false}
            rotateEnabled={false}
            showsUserLocation={false}
            showsCompass={false}
            showsScale={false}
            mapType="none"
            userInterfaceStyle="dark"
          >
            <UrlTile
              urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
              flipY={false}
            />
            {nodes.map((node) => {
              const cat = getAQICategory(node.aqi);
              return (
                <Marker
                  key={node.id}
                  coordinate={{ latitude: node.latitude, longitude: node.longitude }}
                  title={node.name}
                  description={`AQI: ${node.aqi} — ${cat.label}`}
                  anchor={{ x: 0.5, y: 1 }}
                >
                  <View style={s.pinWrap}>
                    <View style={[s.pinBox, { borderColor: cat.color }]}>
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
                          <MaterialCommunityIcons name="flash" size={9} color={cat.color} />
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
      </View>

      {/* Legend */}
      <View style={s.legend}>
        {nodes.map((node) => {
          const cat = getAQICategory(node.aqi);
          return (
            <View key={node.id} style={s.legendItem}>
              <View style={[s.dot, { backgroundColor: cat.color }]} />
              <Text style={s.legendName}>{node.name}</Text>
              <Text style={s.legendAqi}>AQI {node.aqi}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    marginHorizontal: SPACING.md,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(15,38,71,0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    shadowColor: '#0A2A66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    padding: SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
    flex: 1,
  },
  badge: {
    backgroundColor: PALETTE.brightBlue + '18',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.round,
  },
  badgeTxt: {
    fontSize: 11,
    fontWeight: FONTS.semiBold,
    color: PALETTE.brightBlue,
  },
  mapWrap: {
    height: 170,
    borderRadius: RADIUS.lg,
    marginHorizontal: SPACING.sm,
    overflow: 'hidden',
  },
  map: { ...StyleSheet.absoluteFillObject },
  pinWrap: { alignItems: 'center' },
  pinBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 5,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.20,
    shadowRadius: 3,
    elevation: 4,
  },
  pinInner: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  pinSensors: { alignItems: 'center', gap: 1 },
  pinSensorDot: { width: 3, height: 3, borderRadius: 1.5 },
  pinSensorLine: { width: 1, height: 4 },
  pinRight: { alignItems: 'center', gap: 1 },
  pinDisplay: { paddingHorizontal: 4, paddingVertical: 0, borderRadius: 2 },
  pinAqi: { fontSize: 10, fontWeight: FONTS.bold, lineHeight: 13 },
  pinArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 5,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.sm,
  },
  legendItem: { alignItems: 'center', gap: 2 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  legendName: { fontSize: 12, fontWeight: FONTS.bold, color: 'rgba(255,255,255,0.85)' },
  legendAqi: { fontSize: 11, fontWeight: FONTS.semiBold, color: 'rgba(255,255,255,0.50)' },
});

MiniMap.propTypes = {
  nodes: PropTypes.array.isRequired,
};

export default MiniMap;