/**
 * aqi.js — US EPA AQI categories, pollutant metadata, and AQI calculation.
 *
 * Defines the 6 standard EPA AQI levels with associated colors, labels,
 * icons, and health descriptions. Includes EPA breakpoint tables for
 * converting raw pollutant concentrations to AQI sub-indices.
 *
 * Color key:
 *   color      — standard EPA swatch
 *   lightColor — brighter tint for text/icons on dark backgrounds (WCAG AA)
 *   textColor  — dark shade for text on light backgrounds
 *   badgeText  — text color for solid `color` badge fills
 *
 * @module aqi
 * @exports AQI_CATEGORIES
 * @exports getAQICategory
 * @exports POLLUTANTS
 * @exports getPollutantAQI
 */

export const AQI_CATEGORIES = [
  {
    label: 'Good',
    range: [0, 50],
    color: '#00E400',
    lightColor: '#00E400',
    textColor: '#166534',
    badgeText: '#000000',
    bgColor: 'rgba(0,228,0,0.10)',
    icon: 'leaf',
    faceIcon: 'emoticon-happy-outline',
    description: 'Air quality is satisfactory.',
    advice: 'Enjoy outdoor activities freely.',
  },
  {
    label: 'Moderate',
    range: [51, 100],
    color: '#FFFF00',
    lightColor: '#FFFF00',
    textColor: '#B8860B',
    badgeText: '#000000',
    bgColor: 'rgba(255,255,0,0.10)',
    icon: 'weather-partly-cloudy',
    faceIcon: 'emoticon-neutral-outline',
    description: 'Acceptable air quality.',
    advice: 'Sensitive individuals should limit prolonged outdoor exertion.',
  },
  {
    label: 'Unhealthy for Sensitive Groups',
    shortLabel: 'Sensitive',
    range: [101, 150],
    color: '#FF7E00',
    lightColor: '#FFA64D',
    textColor: '#C2410C',
    badgeText: '#000000',
    bgColor: 'rgba(255,126,0,0.10)',
    icon: 'alert-circle-outline',
    faceIcon: 'emoticon-sad-outline',
    description: 'Sensitive groups may be affected.',
    advice: 'Children, elderly, and those with respiratory conditions should reduce outdoor activity.',
  },
  {
    label: 'Unhealthy',
    range: [151, 200],
    color: '#FF0000',
    lightColor: '#FF6B6B',
    textColor: '#DC2626',
    badgeText: '#FFFFFF',
    bgColor: 'rgba(255,0,0,0.10)',
    icon: 'alert-outline',
    faceIcon: 'emoticon-sick-outline',
    description: 'Everyone may begin to feel health effects.',
    advice: 'Avoid prolonged outdoor exertion. Keep windows closed.',
  },
  {
    label: 'Very Unhealthy',
    range: [201, 300],
    color: '#8F3F97',
    lightColor: '#C084FC',
    textColor: '#7C3AED',
    badgeText: '#FFFFFF',
    bgColor: 'rgba(143,63,151,0.10)',
    icon: 'alert',
    faceIcon: 'emoticon-dead-outline',
    description: 'Health alert: risk for everyone.',
    advice: 'Stay indoors as much as possible. Use air purifier if available.',
  },
  {
    label: 'Hazardous',
    range: [301, 500],
    color: '#7E0023',
    lightColor: '#FF4D6A',
    textColor: '#B91C4C',
    badgeText: '#FFFFFF',
    bgColor: 'rgba(126,0,35,0.10)',
    icon: 'skull-crossbones-outline',
    faceIcon: 'skull-outline',
    description: 'Health emergency conditions.',
    advice: 'Avoid all outdoor activity. Use N95 mask if going outside is unavoidable.',
  },
];

/**
 * Get AQI category object for a given AQI value.
 */
export const getAQICategory = (value) => {
  for (const cat of AQI_CATEGORIES) {
    if (value >= cat.range[0] && value <= cat.range[1]) return cat;
  }
  return AQI_CATEGORIES[AQI_CATEGORIES.length - 1];
};

/**
 * Standard pollutant info.
 */
export const POLLUTANTS = {
  pm25: { key: 'pm25', label: 'PM2.5', unit: 'µg/m³', icon: 'blur', goodMax: 35 },
  pm10: { key: 'pm10', label: 'PM10',  unit: 'µg/m³', icon: 'blur-linear', goodMax: 150 },
  co:   { key: 'co',   label: 'CO',    unit: 'ppm',    icon: 'molecule-co', goodMax: 9 },
  no2:  { key: 'no2',  label: 'NO₂',   unit: 'ppb',    icon: 'molecule', goodMax: 100 },
  o3:   { key: 'o3',   label: 'O₃',    unit: 'ppb',    icon: 'weather-sunny', goodMax: 70 },
};

/**
 * US EPA AQI breakpoints per pollutant.
 * Each entry: [AQI_lo, AQI_hi, conc_lo, conc_hi]
 * Used to convert raw concentration → AQI sub-index.
 */
const EPA_BREAKPOINTS = {
  pm25: [
    [0, 50, 0.0, 12.0],
    [51, 100, 12.1, 35.4],
    [101, 150, 35.5, 55.4],
    [151, 200, 55.5, 150.4],
    [201, 300, 150.5, 250.4],
    [301, 500, 250.5, 500.4],
  ],
  pm10: [
    [0, 50, 0, 54],
    [51, 100, 55, 154],
    [101, 150, 155, 254],
    [151, 200, 255, 354],
    [201, 300, 355, 424],
    [301, 500, 425, 604],
  ],
  co: [
    [0, 50, 0.0, 4.4],
    [51, 100, 4.5, 9.4],
    [101, 150, 9.5, 12.4],
    [151, 200, 12.5, 15.4],
    [201, 300, 15.5, 30.4],
    [301, 500, 30.5, 50.4],
  ],
  no2: [
    [0, 50, 0, 53],
    [51, 100, 54, 100],
    [101, 150, 101, 360],
    [151, 200, 361, 649],
    [201, 300, 650, 1249],
    [301, 500, 1250, 2049],
  ],
  o3: [
    [0,   50,  0.000, 0.054],
    [51,  100, 0.055, 0.070],
    [101, 150, 0.071, 0.085],
    [151, 200, 0.086, 0.105],
    [201, 300, 0.106, 0.200],
    [301, 500, 0.201, 0.604],
  ],
};

/**
 * Convert a raw pollutant concentration to its AQI sub-index.
 * Returns { aqi, category } where category is from AQI_CATEGORIES.
 */
export const getPollutantAQI = (key, concentration) => {
  const bps = EPA_BREAKPOINTS[key];
  if (!bps) return { aqi: 0, category: AQI_CATEGORIES[0] };

  // O3 is passed in ppb for display — convert to ppm for EPA breakpoint lookup
  const c = key === 'o3' ? concentration / 1000 : concentration;

  for (const [aqiLo, aqiHi, cLo, cHi] of bps) {
    if (c >= cLo && c <= cHi) {
      const aqi = Math.round(
        ((aqiHi - aqiLo) / (cHi - cLo)) * (c - cLo) + aqiLo
      );
      return { aqi, category: getAQICategory(aqi) };
    }
  }
  return { aqi: 500, category: AQI_CATEGORIES[AQI_CATEGORIES.length - 1] };
};
