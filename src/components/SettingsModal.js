/**
 * SettingsModal.js — Slide-up settings panel.
 *
 * Provides toggle options (notifications) and read-only
 * information rows (app version, AQI standard, monitoring area, active
 * nodes). Uses a sectioned card layout. Push notification toggle syncs
 * with the OS permission state via expo-notifications.
 *
 * @module SettingsModal
 * @exports SettingsModal
 */

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  ScrollView, Switch, Platform, Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import PropTypes from 'prop-types';
import { FONTS, SPACING, RADIUS, PALETTE } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

/** Build section data using the translation function. */
const getSections = (t) => [
  {
    section: t('display'),
    items: [
      { key: 'notifications', label: t('pushNotifications'), icon: 'bell-outline', type: 'toggle' },
    ],
  },
  {
    section: t('language'),
    items: [
      { key: 'language', label: t('language'), icon: 'translate', type: 'language' },
    ],
  },
  {
    section: t('data'),
    items: [
      { key: 'units', label: t('aqiStandard'), icon: 'chart-bar', type: 'info', value: 'US EPA' },
    ],
  },
  {
    section: t('about'),
    items: [
      { key: 'version', label: t('appVersion'), icon: 'information-outline', type: 'info', value: '1.0.0' },
      { key: 'location', label: t('monitoringArea'), icon: 'map-marker', type: 'info', value: 'Kartilya ng Katipunan' },
      { key: 'nodes', label: t('activeSensorNodes'), icon: 'access-point', type: 'info', value: '3' },
    ],
  },
];

/**
 * SettingsModal — slide-up settings panel with toggle options and info rows.
 */
const SettingsModal = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState(false);
  const { t, language, setLanguage } = useTheme();

  /* ─── Sync toggle with actual OS permission on open ─── */
  useEffect(() => {
    if (!visible) return;
    Notifications.getPermissionsAsync().then(({ status }) => {
      setNotifications(status === 'granted');
    });
  }, [visible]);

  /* ─── Request / explain-away OS permission ─── */
  const handleNotificationsToggle = async () => {
    const { status: existing } = await Notifications.getPermissionsAsync();

    if (existing === 'granted') {
      // Already granted — we can't revoke programmatically; guide user to Settings
      Alert.alert(
        t('pushNotifications'),
        Platform.OS === 'ios'
          ? 'To turn off notifications, go to Settings → AirHaven → Notifications.'
          : 'To turn off notifications, go to your device Settings → Apps → AirHaven → Notifications.',
        [{ text: 'OK' }]
      );
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setNotifications(true);
    } else {
      setNotifications(false);
      Alert.alert(
        t('pushNotifications'),
        'Permission denied. You can enable notifications in your device Settings.',
        [{ text: 'OK' }]
      );
    }
  };

  const SECTION_ITEMS = getSections(t);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <View style={s.sheet}>
          {/* Handle bar */}
          <View style={s.handleBar} />

          {/* Header */}
          <View style={s.header}>
            <Text style={s.headerTitle}>{t('settings')}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={s.closeBtn} accessibilityLabel="Close settings" accessibilityRole="button">
              <MaterialCommunityIcons name="close" size={22} color="rgba(255,255,255,0.60)" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
            {SECTION_ITEMS.map((section) => (
              <View key={section.section} style={s.section}>
                <Text style={s.sectionLabel}>{section.section}</Text>
                <View style={s.sectionCard}>
                  {section.items.map((item, idx) => (
                    <View
                      key={item.key}
                      style={[s.row, idx < section.items.length - 1 && s.rowBorder]}
                    >
                      <View style={s.rowLeft}>
                        <View style={s.iconWrap}>
                          <MaterialCommunityIcons name={item.icon} size={18} color={PALETTE.brightBlue} />
                        </View>
                        <Text style={s.rowLabel}>{item.label}</Text>
                      </View>

                      {item.type === 'toggle' ? (
                        <Switch
                          value={notifications}
                          onValueChange={handleNotificationsToggle}
                          trackColor={{ false: 'rgba(255,255,255,0.15)', true: PALETTE.brightBlue + '40' }}
                          thumbColor={notifications ? PALETTE.brightBlue : 'rgba(255,255,255,0.4)'}
                          ios_backgroundColor="rgba(255,255,255,0.10)"
                        />
                      ) : item.type === 'language' ? (
                        <View style={s.langPicker}>
                          <TouchableOpacity
                            style={[s.langBtn, language === 'en' && s.langBtnActive]}
                            onPress={() => setLanguage('en')}
                            activeOpacity={0.7}
                          >
                            <Text style={[s.langBtnText, language === 'en' && s.langBtnTextActive]}>
                              {t('english')}
                            </Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[s.langBtn, language === 'fil' && s.langBtnActive]}
                            onPress={() => setLanguage('fil')}
                            activeOpacity={0.7}
                          >
                            <Text style={[s.langBtnText, language === 'fil' && s.langBtnTextActive]}>
                              {t('filipino')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <Text style={s.rowValue}>{item.value}</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F2647',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    maxHeight: '80%',
    paddingBottom: Platform.OS === 'ios' ? 34 : SPACING.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignSelf: 'center',
    marginTop: SPACING.sm + 4,
    marginBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: FONTS.bold,
    color: PALETTE.white,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },

  section: {
    marginBottom: SPACING.md + 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: FONTS.bold,
    color: 'rgba(255,255,255,0.50)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.md,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: FONTS.medium,
    color: PALETTE.white,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: FONTS.medium,
    color: 'rgba(255,255,255,0.50)',
  },
  langPicker: {
    flexDirection: 'row',
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.round,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  langBtnActive: {
    backgroundColor: PALETTE.brightBlue + '30',
    borderColor: PALETTE.brightBlue + '60',
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: FONTS.semiBold,
    color: 'rgba(255,255,255,0.50)',
  },
  langBtnTextActive: {
    color: PALETTE.brightBlue,
  },
});

SettingsModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;