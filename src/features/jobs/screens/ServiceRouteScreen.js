import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../core/query/query-keys";
import { AppHeader, ResponsiveContainer, Screen } from "../../../shared/layout";
import { Button, Card, ErrorState, Skeleton } from "../../../shared/ui";
import { colors, layout, spacing } from "../../../theme";
import { currentPoint, hasPoint } from "../../location/location";
import RouteMap from "../../location/RouteMap";
import { fetchPublicationById } from "../../requests/api/requests.api";
import ProfessionalNotificationButton from "../../notifications/components/ProfessionalNotificationButton";

export default function ServiceRouteScreen({ navigation, route }) {
  const publicationId = route?.params?.publicationId;
  const [origin, setOrigin] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const publication = useQuery({
    queryKey: queryKeys.publicationDetail(publicationId),
    queryFn: () => fetchPublicationById(publicationId),
    enabled: Boolean(publicationId),
  });
  const destination = publication.data;

  const loadCurrentLocation = useCallback(async () => {
    if (!hasPoint(destination)) return;
    setLocating(true);
    setLocationError("");
    try {
      const current = await currentPoint();
      setOrigin(current);
    } catch (error) {
      setLocationError(error?.message || "No pudimos obtener tu ubicación actual.");
    } finally {
      setLocating(false);
    }
  }, [destination]);

  useEffect(() => {
    if (hasPoint(destination)) loadCurrentLocation();
  }, [destination, loadCurrentLocation]);

  return (
    <Screen scroll backgroundColor={colors.background}>
      <AppHeader
        title="Ubicación del servicio"
        onBack={() => navigation.goBack()}
        maxWidth={layout.content.wide}
        action={<ProfessionalNotificationButton navigation={navigation} />}
      />
      <ResponsiveContainer maxWidth={layout.content.medium} style={styles.container}>
        {publication.isLoading || (locating && !origin) ? (
          <Skeleton height={360} />
        ) : publication.isError ? (
          <ErrorState
            title="No pudimos cargar la ubicación del servicio"
            onRetry={publication.refetch}
          />
        ) : !hasPoint(destination) ? (
          <ErrorState
            title="Ubicación no disponible"
            description="La publicación no tiene coordenadas válidas para mostrar el punto del cliente."
          />
        ) : origin ? (
          <>
            <RouteMap origin={origin} destination={destination} />
            <Card variant="outlined" style={styles.summary}>
              <View style={styles.legendRow}>
                <View style={[styles.dot, styles.originDot]} />
                <Text style={styles.legendText}>Tu ubicación actual</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.dot, styles.destinationDot]} />
                <Text style={styles.legendText}>
                  {destination.location || destination.direccion}
                </Text>
              </View>
              {locationError ? <Text style={styles.error}>{locationError}</Text> : null}
              <View style={styles.actions}>
                <Button
                  variant="outline"
                  size="sm"
                  onPress={loadCurrentLocation}
                  loading={locating}>
                  Actualizar mi ubicación
                </Button>
              </View>
            </Card>
          </>
        ) : locationError ? (
          <ErrorState
            title="No pudimos obtener tu ubicación"
            description={locationError}
            onRetry={loadCurrentLocation}
          />
        ) : null}
      </ResponsiveContainer>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.xl, gap: spacing.lg },
  summary: { padding: spacing.lg, gap: spacing.sm },
  legendRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2 },
  originDot: { backgroundColor: "#22C55E", borderColor: "#15803D" },
  destinationDot: { backgroundColor: "#EF4444", borderColor: "#B91C1C" },
  legendText: { flex: 1, color: colors.text, fontSize: 13 },
  error: { color: colors.error, fontSize: 13 },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
});
