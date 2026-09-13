// src/screens/professional/ProHomeScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../../theme';
import AppHeader from '../../components/AppHeader';
import StatCard from '../../components/StatCard';
import RequestCard from '../../components/RequestCard';
import { formatCOP } from '../../utils';
import { MOCK_PROFESSIONAL, MOCK_NEW_REQUESTS } from '../../data/mockData';
import { getMyProfessionalProfileApi } from '../../features/usuario/usuario.api';

export default function ProHomeScreen({ navigation }) {
  const [available, setAvailable] = useState(true);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getMyProfessionalProfileApi();
        console.log("PERFIL PROFESIONAL:", data);
        setProfile(data);
      } catch (error) {
        console.error(
          "Error cargando perfil profesional:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return (
    <View style={styles.screen}>
      <AppHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.greetingRow}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color={colors.primary} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.greetingSmall}>Hola,</Text>
            <Text style={styles.greetingName}>{MOCK_PROFESSIONAL.name}</Text>
          </View>
          <Pressable style={styles.bellBtn}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.textPrimary}
            />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        <View style={styles.availabilityCard}>
          <View style={styles.availabilityRow}>
            <View style={styles.dot} />
            <View style={{ flex: 1 }}>
              <Text style={styles.availabilityTitle}>
                {available ? "Disponible para trabajar" : "No disponible"}
              </Text>
              <Text style={styles.availabilitySubtitle}>
                Estás recibiendo solicitudes en Valledupar
              </Text>
            </View>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ true: colors.success, false: colors.border }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="briefcase-outline"
            value={formatCOP(MOCK_PROFESSIONAL.monthEarnings)}
            label="Este mes"
          />
          <StatCard
            icon="star-outline"
            value={MOCK_PROFESSIONAL.rating}
            label="Calificación"
          />
          <StatCard
            icon="trending-up-outline"
            value={MOCK_PROFESSIONAL.services}
            label="Servicios"
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nuevas solicitudes</Text>
          <Pressable onPress={() => navigation.navigate("Solicitudes")}>
            <Text style={styles.sectionLink}>Ver todas →</Text>
          </Pressable>
        </View>

        {(requests.length > 0 ? requests.slice(0, 3) : MOCK_NEW_REQUESTS).map(
          (req) => (
            <RequestCard
              key={req.id}
              request={req}
              ctaLabel="Ver solicitud"
              onPress={() => navigation.navigate("Solicitudes")}
            />
          ),
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  greetingSmall: { ...typography.caption, color: colors.textSecondary },
  greetingName: { ...typography.h3, color: colors.textPrimary },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  availabilityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.successLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  availabilityRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: spacing.sm,
  },
  availabilityTitle: { ...typography.bodyBold, color: colors.textPrimary },
  availabilitySubtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.xl },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionLink: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
  },
});
