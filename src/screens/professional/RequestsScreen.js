// src/screens/professional/RequestsScreen.js
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import RequestCard from '../../components/RequestCard';
import { MOCK_NEW_REQUESTS } from '../../data/mockData';

const TABS = [
  { id: 'nuevas', label: 'Nuevas' },
  { id: 'ofertas', label: 'Ofertas enviadas' },
];

export default function RequestsScreen() {
  const [tab, setTab] = useState('nuevas');

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.subtitle}>Clientes que necesitan un servicio cerca de ti.</Text>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}
            >
              <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
        </View>

        {tab === 'nuevas' ? (
          MOCK_NEW_REQUESTS.map((req) => (
            <RequestCard key={req.id} request={req} ctaLabel="Ver solicitud y enviar oferta" onPress={() => {}} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aún no has enviado ofertas.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: { ...typography.h1, fontSize: 24, color: colors.textPrimary, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.pill, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.background },
  tabText: { ...typography.caption, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: colors.textPrimary },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyText: { ...typography.body, color: colors.textSecondary },
});
