// src/screens/professional/RequestsScreen.js
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import RequestCard from '../../components/RequestCard';
import { MOCK_NEW_REQUESTS } from '../../data/mockData';
import {
  fetchProfessionalPublications,
  fetchProfessionalOffers,
} from '../../api/requestsService';

const TABS = [
  { id: 'nuevas', label: 'Nuevas' },
  { id: 'ofertas', label: 'Ofertas enviadas' },
];

// Forma real que devuelve /publicaciones/publicaciones-categorias-prestador
// (con incluir_usuario=True, incluir_categoria=True del lado del backend):
// { id, descripcion, categoria_id, urgencia, usuario_id, estado,
//   created_at, updated_at,
//   usuario: { nombre_completo, foto_perfil },
//   categoria: { nombre, icono } }
//
// Nota: `publicaciones` hoy NO tiene columna de ubicación/dirección,
// por eso location siempre cae al texto por defecto. Si tu marketplace
// necesita mostrar cercanía, hay que agregar esa columna a futuro.
function normalizeRequest(item) {
  return {
    id: item.id,
    title: item.descripcion || 'Solicitud de servicio',
    category: item.categoria?.nombre || 'Servicio general',
    categoryIcon: item.categoria?.icono || null,
    description: item.descripcion || '',
    urgency: item.urgencia || 'normal',
    location: 'Ubicación no especificada',
    time: item.created_at || 'Recientemente',
    status: item.estado || 'Nueva',
    clientName: item.usuario?.nombre_completo || 'Cliente',
    clientPhoto: item.usuario?.foto_perfil || null,
  };
}

function normalizeOffer(item) {
  return {
    id: item.id || item.oferta_id,
    publicationTitle:
      item.publicationTitle ||
      item.publicacion?.descripcion ||
      'Publicación',
    category: item.category || item.categoria || 'Servicio general',
    price: item.price ?? item.precio,
    status: item.status || item.estado || 'Enviada',
    time: item.time || item.fecha || item.created_at || 'Recientemente',
  };
}

export default function RequestsScreen() {
  const [tab, setTab] = useState('nuevas');
  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    const [requestsResult] = await Promise.allSettled([
      fetchProfessionalPublications()
    ]);

    setRequests(
      requestsResult.status === 'fulfilled' && requestsResult.value.length > 0
        ? requestsResult.value.map(normalizeRequest)
        : MOCK_NEW_REQUESTS
    );
    setOffers(
      offersResult.status === 'fulfilled' && offersResult.value.length > 0
        ? offersResult.value.map(normalizeOffer)
        : []
    );
    setRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
            tintColor={colors.primary}
          />
        }>
        <Text style={styles.title}>Solicitudes</Text>
        <Text style={styles.subtitle}>
          Clientes que necesitan un servicio cerca de ti.
        </Text>

        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={[styles.tabBtn, tab === t.id && styles.tabBtnActive]}>
              <Text
                style={[
                  styles.tabText,
                  tab === t.id && styles.tabTextActive,
                ]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'nuevas' ? (
          requests.length > 0 ? (
            requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                ctaLabel="Ver solicitud y enviar oferta"
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No hay solicitudes en tus categorías todavía.
              </Text>
            </View>
          )
        ) : offers.length > 0 ? (
          offers.map((offer) => (
            <View style={styles.card} key={offer.id}>
              <Text style={styles.cardTitle}>{offer.publicationTitle}</Text>
              <Text style={styles.category}>
                {offer.category} · {offer.time}
              </Text>
              <Text style={styles.status}>{offer.status}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Aún no has enviado ofertas.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  title: {
    ...typography.h1,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  tabBtnActive: { backgroundColor: colors.background },
  tabText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  tabTextActive: { color: colors.textPrimary },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.bodyBold, color: colors.textPrimary },
  category: { ...typography.small, color: colors.textSecondary, marginTop: 3 },
  status: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xxxl },
  emptyText: { ...typography.body, color: colors.textSecondary },
});