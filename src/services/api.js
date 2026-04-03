/**
 * api.js — AirHaven Firebase service layer
 *
 * Connects directly to Firebase Realtime Database to fetch
 * live sensor data from node_1, node_2, node_3.
 *
 * Provides:
 *   - api.getNodes()          → all nodes with latest reading (no forecast fields)
 *   - api.getCurrentReading() → averaged reading across all nodes
 *   - api.getHourlyForecast() → hourly forecast from Firebase (forecasts/hourly/data)
 *   - api.getWeeklyForecast() → weekly forecast (not yet available, returns null)
 *   - useLiveData(intervalMs) → auto-refreshing hook for components
 *
 * Forecasts are dashboard-level only — individual node pages do not show forecasts.
 *
 * @module api
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import logger from '../utils/logger';

/* ─── Firebase Configuration ─── */

const FIREBASE_CONFIG = {
  apiKey:      process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:  process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:   process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId:       process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only once
const firebaseApp = getApps().length === 0
  ? initializeApp(FIREBASE_CONFIG)
  : getApps()[0];

const database = getDatabase(firebaseApp);

/* ─── Node Metadata ─── */
// Static info about each sensor node (location name, coordinates)

const NODE_META = {
  node_1: {
    id: 'node_1',
    name: 'Node 1',
    subtitle: 'Kartilya ng Katipunan',
    latitude: 14.59056,
    longitude: 120.98088,
  },
  node_2: {
    id: 'node_2',
    name: 'Node 2',
    subtitle: 'Sensor Node 2',
    latitude: 14.59139,
    longitude: 120.98135,
  },
  node_3: {
    id: 'node_3',
    name: 'Node 3',
    subtitle: 'Sensor Node 3',
    latitude: 14.59078,
    longitude: 120.98180,
  },
};

/* ─── AQI Calculation ─── */

const AQI_BREAKPOINTS = {
  PM2_5: [
    { cLow: 0.0,   cHigh: 12.0,  iLow: 0,   iHigh: 50  },
    { cLow: 12.1,  cHigh: 35.4,  iLow: 51,  iHigh: 100 },
    { cLow: 35.5,  cHigh: 55.4,  iLow: 101, iHigh: 150 },
    { cLow: 55.5,  cHigh: 150.4, iLow: 151, iHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
    { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
    { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 },
  ],
  PM10: [
    { cLow: 0,   cHigh: 54,  iLow: 0,   iHigh: 50  },
    { cLow: 55,  cHigh: 154, iLow: 51,  iHigh: 100 },
    { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
    { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
    { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
    { cLow: 425, cHigh: 504, iLow: 301, iHigh: 400 },
    { cLow: 505, cHigh: 604, iLow: 401, iHigh: 500 },
  ],
  O3: [
    { cLow: 0.000, cHigh: 0.054, iLow: 0,   iHigh: 50  },
    { cLow: 0.055, cHigh: 0.070, iLow: 51,  iHigh: 100 },
    { cLow: 0.071, cHigh: 0.085, iLow: 101, iHigh: 150 },
    { cLow: 0.086, cHigh: 0.105, iLow: 151, iHigh: 200 },
    { cLow: 0.106, cHigh: 0.200, iLow: 201, iHigh: 300 },
    { cLow: 0.201, cHigh: 0.404, iLow: 301, iHigh: 400 },
    { cLow: 0.405, cHigh: 0.504, iLow: 401, iHigh: 500 },
  ],
  NO2: [
    { cLow: 0,    cHigh: 53,   iLow: 0,   iHigh: 50  },
    { cLow: 54,   cHigh: 100,  iLow: 51,  iHigh: 100 },
    { cLow: 101,  cHigh: 360,  iLow: 101, iHigh: 150 },
    { cLow: 361,  cHigh: 649,  iLow: 151, iHigh: 200 },
    { cLow: 650,  cHigh: 1249, iLow: 201, iHigh: 300 },
    { cLow: 1250, cHigh: 1649, iLow: 301, iHigh: 400 },
    { cLow: 1650, cHigh: 2049, iLow: 401, iHigh: 500 },
  ],
  CO: [
    { cLow: 0.0,  cHigh: 4.4,  iLow: 0,   iHigh: 50  },
    { cLow: 4.5,  cHigh: 9.4,  iLow: 51,  iHigh: 100 },
    { cLow: 9.5,  cHigh: 12.4, iLow: 101, iHigh: 150 },
    { cLow: 12.5, cHigh: 15.4, iLow: 151, iHigh: 200 },
    { cLow: 15.5, cHigh: 30.4, iLow: 201, iHigh: 300 },
    { cLow: 30.5, cHigh: 40.4, iLow: 301, iHigh: 400 },
    { cLow: 40.5, cHigh: 50.4, iLow: 401, iHigh: 500 },
  ],
};

const calcSubIndex = (concentration, breakpoints) => {
  for (const bp of breakpoints) {
    if (concentration >= bp.cLow && concentration <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
        (concentration - bp.cLow) + bp.iLow
      );
    }
  }
  return 500;
};

const calculateAQI = (readings) => {
  const subIndices = {};

  if (readings.PM2_5 != null && readings.PM2_5 >= 0)
    subIndices['PM2.5'] = calcSubIndex(readings.PM2_5, AQI_BREAKPOINTS.PM2_5);
  if (readings.PM10 != null && readings.PM10 >= 0)
    subIndices['PM10']  = calcSubIndex(readings.PM10,  AQI_BREAKPOINTS.PM10);
  if (readings.O3 != null && readings.O3 >= 0)
    subIndices['O3']    = calcSubIndex(readings.O3,    AQI_BREAKPOINTS.O3);
  if (readings.NO2 != null && readings.NO2 >= 0)
    subIndices['NO2']   = calcSubIndex(readings.NO2,   AQI_BREAKPOINTS.NO2);
  if (readings.co != null && readings.co >= 0)
    subIndices['CO']    = calcSubIndex(readings.co,    AQI_BREAKPOINTS.CO);

  if (Object.keys(subIndices).length === 0) {
    return { aqi: 0, dominant: 'N/A', subIndices: {} };
  }

  const entries  = Object.entries(subIndices);
  const dominant = entries.reduce((a, b) => a[1] > b[1] ? a : b);

  return {
    aqi:        dominant[1],
    dominant:   dominant[0],
    subIndices: subIndices,
  };
};

const getAQILabel = (aqi) => {
  if (aqi <= 50)  return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

/* ─── Firebase Fetchers ─── */

/** 2 minutes — matches the ~60s sensor upload cycle on the website */
const STALE_THRESHOLD_MS = 2 * 60 * 1000;

const fetchLatestNodeReading = async (nodeId, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const nodeRef = query(
        ref(database, `sensor_data/${nodeId}`),
        orderByChild('timestamp'),
        limitToLast(1)
      );

      const snapshot = await get(nodeRef);
      if (!snapshot.exists()) return null;

      let latest = null;
      snapshot.forEach((child) => { latest = child.val(); });
      if (!latest) return null;

      const ts    = latest.timestamp;
      const tsMs  = ts > 1e12 ? ts : ts * 1000;
      const ageMs = Date.now() - tsMs;

      if (ageMs > STALE_THRESHOLD_MS) {
        const ageMin = Math.round(ageMs / 60000);
        logger.warn(`[AirHaven] ${nodeId} skipped — last reading was ${ageMin} min ago`);
        return null;
      }

      return latest;

    } catch (err) {
      logger.error(`[AirHaven] ${nodeId} attempt ${attempt} failed:`, err);
      if (attempt < retries) {
        // Wait 1s, 2s, 3s before each retry
        await new Promise((res) => setTimeout(res, attempt * 1000));
      }
    }
  }
  return null;
};

/* ─── API Methods ─── */

export const api = {

  /**
   * Fetches all nodes with their latest sensor readings.
   * NOTE: hourly and weekly are intentionally omitted from each node —
   * forecasts are dashboard-level only (trained on all 3 nodes combined).
   */
  getNodes: async () => {
    const nodeIds = Object.keys(NODE_META);

    const readings = await Promise.all(
      nodeIds.map((id) => fetchLatestNodeReading(id))
    );

    return nodeIds
      .map((id, i) => {
        const reading = readings[i];
        if (!reading) return null;

        const aqiResult = calculateAQI({
          PM2_5: reading.pm25   != null ? +parseFloat(reading.pm25).toFixed(1)            : null,
          PM10:  reading.pm100  != null ? +parseFloat(reading.pm100).toFixed(1)           : null,
          O3:    reading.o3_ppb != null ? +(parseFloat(reading.o3_ppb) / 1000).toFixed(3) : null, // ppb → ppm
          NO2:   reading.no2    != null ? +parseFloat(reading.no2).toFixed(1)             : null,
          co:    reading.co     != null ? +parseFloat(reading.co).toFixed(2)              : null,
        });
        const aqi = aqiResult.aqi;

        return {
          ...NODE_META[id],
          aqi,
          dominant: aqiResult.dominant,
          label: getAQILabel(aqi),
          temperature: reading.temperature ?? 0,
          humidity: reading.humidity ?? 0,
          updatedAt: reading.timestamp
              ? new Date(reading.timestamp).toISOString()
              : null,
          pollutants: {
            pm25:  reading.pm25    ?? 0,
            pm10:  reading.pm100   ?? 0,
            co:    reading.co      ?? 0,
            no2:   reading.no2     ?? 0,
            o3:    reading.o3_ppb  ?? 0,
          },
          // hourly and weekly intentionally omitted —
          // NodeDetailScreen checks node.hourly && node.weekly,
          // so undefined = falsy = forecast sections are hidden automatically.
        };
      })
      .filter(Boolean);
  },

  /**
   * Fetches the current reading for the dashboard.
   * Averages pollutants across all fresh nodes.
   */
  getCurrentReading: async () => {
    const nodes = await api.getNodes();
    if (nodes.length === 0) return EMPTY_STATE.current;

    const avgField = (field) => {
      const values = nodes
        .map(n => parseFloat(n.pollutants[field]))
        .filter(v => !isNaN(v) && v >= 0);
      if (values.length === 0) return null;
      return values.reduce((a, b) => a + b, 0) / values.length;
    };

    const avgPm25  = avgField('pm25');
    const avgPm10  = avgField('pm10');
    const avgO3Ppb = avgField('o3');
    const avgNo2   = avgField('no2');
    const avgCo    = avgField('co');
    const avgTemp  = nodes.reduce((s, n) => s + n.temperature, 0) / nodes.length;
    const avgHum   = nodes.reduce((s, n) => s + n.humidity,    0) / nodes.length;

    const aqiInput = {};
    if (avgPm25  != null) aqiInput.PM2_5 = +avgPm25.toFixed(1);
    if (avgPm10  != null) aqiInput.PM10  = +avgPm10.toFixed(1);
    if (avgO3Ppb != null) aqiInput.O3    = +(avgO3Ppb / 1000).toFixed(3); // ppb → ppm
    if (avgNo2   != null) aqiInput.NO2   = +avgNo2.toFixed(1);
    if (avgCo    != null) aqiInput.co    = +avgCo.toFixed(2);

    const aqiResult = calculateAQI(aqiInput);
    const aqi       = aqiResult.aqi;

    const primary = nodes[0];

    return {
      aqi,
      dominant:    aqiResult.dominant,
      label:       getAQILabel(aqi),
      location:    primary.name,
      temperature: +avgTemp.toFixed(1),
      humidity:    +avgHum.toFixed(1),
      updatedAt:   primary.updatedAt,
      pollutants: {
        pm25: avgPm25  != null ? +avgPm25.toFixed(1)  : 0,
        pm10: avgPm10  != null ? +avgPm10.toFixed(1)  : 0,
        o3:   avgO3Ppb != null ? +avgO3Ppb.toFixed(1) : 0,
        no2:  avgNo2   != null ? +avgNo2.toFixed(1)   : 0,
        co:   avgCo    != null ? +avgCo.toFixed(2)    : 0,
      },
    };
  },

  /**
   * Fetches hourly forecast from Firebase.
   * Path: forecasts/hourly/data
   *
   * Firebase structure:
   * {
   *   "hourly": {
   *     "generated_at": "...",
   *     "data": [
   *       { "PM2_5", "PM10", "O3" (ppm), "NO2", "co", "temperature", "humidity", "timestamp" },
   *       ...
   *     ]
   *   }
   * }
   *
   * O3 in forecast data is already in ppm — no conversion needed.
   */
  getHourlyForecast: async () => {
  try {
    const snapshot = await get(ref(database, 'forecasts/hourly/data'));
    if (!snapshot.exists()) return null;

    const raw = snapshot.val();
    const items = Array.isArray(raw) ? raw : Object.values(raw);
    if (!items || items.length === 0) return null;

    const now = new Date();
    const currentHourStart = new Date(now);
    currentHourStart.setMinutes(0, 0, 0, 0);

    const filtered = items
      .filter((item) => new Date(item.timestamp).getTime() >= currentHourStart.getTime())
      .map((item) => {
        const date = new Date(item.timestamp);
        const aqiResult = calculateAQI({
          PM2_5: item.PM2_5 != null ? +parseFloat(item.PM2_5).toFixed(1) : null,
          PM10:  item.PM10  != null ? +parseFloat(item.PM10).toFixed(1)  : null,
          O3:    item.O3    != null ? +parseFloat(item.O3).toFixed(3)    : null,
          NO2:   item.NO2   != null ? +parseFloat(item.NO2).toFixed(1)   : null,
          co:    item.co    != null ? +parseFloat(item.co).toFixed(2)    : null,
        });
        return {
          hour:       date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          aqi:        aqiResult.aqi,
          temp:       +item.temperature.toFixed(1),
          humidity:   +item.humidity.toFixed(1),
          isNowSlot:  false,
          _hourOfDay: date.getHours(), // ✅ Fix 2: retain hour number for reliable comparison
        };
      });

    // use _hourOfDay instead of re-finding timestamp from raw items
    const firstIsCurrentHour = filtered[0]?._hourOfDay === now.getHours();

    if (!firstIsCurrentHour) {
      // use getCurrentReading() which averages pollutants first, then calculates AQI
      const live = await api.getCurrentReading();
      if (live) {
        filtered.unshift({
          hour:      'Now',
          aqi:       live.aqi,
          temp:      live.temperature,
          humidity:  live.humidity,
          isNowSlot: true,
          _hourOfDay: now.getHours(),
        });
      }
    } else {
      // First item IS the current hour — mark it as Now
      filtered[0].isNowSlot = true;
    }

    return filtered.length > 0 ? filtered : null;

  } catch (err) {
    logger.error('[AirHaven] Failed to fetch hourly forecast:', err);
    return null;
  }
},

  /**
   * Fetches weekly forecast from Firebase.
   * Path: forecasts/weekly/data
   *
   * Firebase structure:
   * {
   *   "weekly": {
   *     "generated_at": "...",
   *     "data": [
   *       { "PM2_5", "PM10", "O3" (ppm), "NO2", "co", "temperature", "humidity", "timestamp" },
   *       ...
   *     ]
   *   }
   * }
   *
   * Returns null (and hides WeeklyForecast section) until data is pushed to Firebase.
   */
  getWeeklyForecast: async () => {
    try {
      const snapshot = await get(ref(database, 'forecasts/weekly/data'));
      if (!snapshot.exists()) return null;

      const raw = snapshot.val();

      // Firebase may return array or object with numeric keys — normalize to array
      const items = Array.isArray(raw) ? raw : Object.values(raw);
      if (!items || items.length === 0) return null;

      return items.map((item) => {
        const date = new Date(item.timestamp);

        // Calculate AQI from forecast pollutants
        // NOTE: O3 is already in ppm in forecast data (unlike live sensor which sends ppb)
        const aqiResult = calculateAQI({
          PM2_5: item.PM2_5 ?? null,
          PM10:  item.PM10  ?? null,
          O3:    item.O3    ?? null, // already ppm — no conversion
          NO2:   item.NO2   ?? null,
          co:    item.co    ?? null,
        });

        return {
          day:      date.toLocaleDateString([], {
                      weekday: 'short',
                      month:   'short',
                      day:     'numeric',
                    }),
          aqi:      aqiResult.aqi,
          temp:     +item.temperature.toFixed(1),
          humidity: +item.humidity.toFixed(1),
        };
      });
    } catch (err) {
      logger.error('[AirHaven] Failed to fetch weekly forecast:', err);
      return null;
    }
  },

  /**
   * Fetches all dashboard data in parallel.
   */
  getDashboardData: async () => {
    const [nodes, current, hourly, weekly] = await Promise.all([
      api.getNodes(),
      api.getCurrentReading(),
      api.getHourlyForecast(),
      api.getWeeklyForecast(),
    ]);
    return { nodes, current, hourly, weekly };
  },
};

/* ─── Placeholder / fallback data ─── */

const EMPTY_STATE = {
  nodes: [],
  current: {
    aqi: 0,
    label: '—',
    location: '—',
    temperature: 0,
    humidity: 0,
    updatedAt: new Date().toISOString(),
    pollutants: { pm25: 0, pm10: 0, co: 0, no2: 0, o3: 0 },
  },
  hourly: null, // null so HourlyForecast is hidden until data is available
  weekly: null, // null so WeeklyForecast is hidden until data is available
};

/* ─── useLiveData hook ─── */

/**
 * useLiveData(intervalMs)
 *
 * Auto-refreshing hook that polls Firebase every `intervalMs` ms.
 * Default: 30 seconds.
 *
 * Usage:
 *   const { nodes, current, hourly, weekly, loading, error, refresh } = useLiveData(30000);
 */
export const useLiveData = (intervalMs = 30000) => {
  const [data, setData]         = useState(EMPTY_STATE);
  const [revision, setRevision] = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const mountedRef               = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await api.getDashboardData();
      if (!mountedRef.current) return;
      setData(result);
      setRevision((r) => r + 1);
      setError(null);
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err.message || 'Failed to fetch data');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    const id = setInterval(fetchData, intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [intervalMs, fetchData]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  return {
    ...data,
    revision,
    refresh,
    loading,
    error,
  };
};