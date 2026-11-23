import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { api } from "../../../core/api/client";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { queryKeys } from "../../../core/query/query-keys";
import { Button, Input } from "../../../shared/ui";
import { colors, radius, spacing } from "../../../theme";
import LocationPicker from "../../location/LocationPicker";
import { hasPoint } from "../../location/location";

export default function ProfessionalBaseLocation() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(null);
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const baseKey = [...queryKeys.professionalProfile, "location"];
  const base = useQuery({
    queryKey: baseKey,
    queryFn: async () => (await api.get("/prestadores/mi-ubicacion")).data,
  });

  async function save() {
    setPending(true);
    setNotice("");
    try {
      const { data } = await api.put("/prestadores/mi-ubicacion", draft);
      queryClient.setQueryData(baseKey, data);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.professionalRequests }),
        queryClient.invalidateQueries({ queryKey: ["publication-detail"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs", "provider"] }),
      ]);
      setDraft(null);
      setNotice("Ubicación base guardada.");
    } catch (error) {
      setNotice(getApiErrorMessage(error, "No pudimos guardar tu ubicación base."));
    } finally {
      setPending(false);
    }
  }

  return (
    <View style={styles.section}>
      <View style={styles.row}>
        <View style={styles.summary}>
          <View style={styles.icon}>
            <Ionicons name="navigate-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.title}>Ubicación base</Text>
            <Text style={styles.help}>
              {base.isError
                ? "No pudimos cargar tu ubicación."
                : hasPoint(base.data)
                  ? base.data.direccion
                  : "Configura tu base para ver distancias a las solicitudes."}
            </Text>
          </View>
        </View>
        {!draft ? (
          <Button
            variant="outline"
            size="sm"
            fullWidth={false}
            loading={base.isPending}
            disabled={!base.data && !base.isError}
            onPress={() => {
              if (base.isError) {
                base.refetch();
                return;
              }
              setNotice("");
              setDraft(base.data);
            }}>
            {base.isError ? "Reintentar" : hasPoint(base.data) ? "Editar base" : "Configurar base"}
          </Button>
        ) : null}
      </View>
      {draft ? (
        <View style={styles.editor}>
          <LocationPicker
            point={draft}
            address={draft.direccion}
            onSelect={(point) => setDraft((current) => current && { ...current, ...point })}
            onAddress={({ direccion }) =>
              setDraft((current) => current && { ...current, direccion })
            }
          />
          <Input
            label="Dirección de tu base"
            value={draft.direccion || ""}
            maxLength={250}
            editable={!pending}
            onChangeText={(direccion) => setDraft((current) => ({ ...current, direccion }))}
          />
          <View style={styles.actions}>
            <Button
              variant="outline"
              size="sm"
              fullWidth={false}
              disabled={pending}
              onPress={() => {
                setDraft(null);
                setNotice("");
              }}>
              Volver
            </Button>
            <Button
              size="sm"
              fullWidth={false}
              loading={pending}
              disabled={!hasPoint(draft) || (draft.direccion || "").trim().length < 3}
              onPress={save}>
              Guardar ubicación
            </Button>
          </View>
        </View>
      ) : null}
      {notice ? (
        <Text accessibilityLiveRegion="polite" style={styles.help}>
          {notice}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing.sm },
  summary: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 210,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
  },
  copy: { flex: 1, minWidth: 0, gap: 2 },
  editor: { gap: spacing.sm },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  title: { color: colors.text, fontSize: 15, fontWeight: "700" },
  help: { color: colors.textSecondary, fontSize: 13 },
});
