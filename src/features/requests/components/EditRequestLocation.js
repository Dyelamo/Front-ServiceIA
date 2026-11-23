import React, { useState } from "react";
import { Text, View } from "react-native";

import { Button, Input } from "../../../shared/ui";
import { colors, spacing } from "../../../theme";
import LocationPicker from "../../location/LocationPicker";
import { hasPoint } from "../../location/location";
import { getApiErrorMessage } from "../../../core/errors/error-message";
import { updatePublicationLocation } from "../api/requests.api";

export default function EditRequestLocation({ request, onSaved }) {
  const [draft, setDraft] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (changes) => setDraft((current) => current && { ...current, ...changes });

  async function save() {
    setSaving(true);
    setError("");
    try {
      const updated = await updatePublicationLocation(request.id, draft);
      onSaved(updated);
      setDraft(null);
    } catch (err) {
      setError(getApiErrorMessage(err, "No pudimos actualizar la ubicación."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={{ gap: spacing.sm, marginTop: spacing.md }}>
      {draft ? (
        <>
          <LocationPicker
            point={draft}
            address={draft.direccion}
            onSelect={update}
            onAddress={({ direccion, barrio, ciudad }) =>
              update({ direccion, ...(barrio ? { barrio } : {}), ...(ciudad ? { ciudad } : {}) })
            }
          />
          <Input
            label="Dirección del servicio"
            value={draft.direccion}
            editable={!saving}
            onChangeText={(direccion) => update({ direccion })}
          />
          <Input
            label="Barrio o sector"
            value={draft.barrio}
            editable={!saving}
            onChangeText={(barrio) => update({ barrio })}
          />
          <Button
            loading={saving}
            disabled={!hasPoint(draft) || !draft.direccion.trim()}
            onPress={save}>
            Guardar ubicación
          </Button>
          <Button
            variant="outline"
            disabled={saving}
            onPress={() => {
              setDraft(null);
              setError("");
            }}>
            Volver
          </Button>
          {error ? (
            <Text accessibilityLiveRegion="polite" style={{ color: colors.error }}>
              {error}
            </Text>
          ) : null}
        </>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onPress={() =>
            setDraft({
              latitud: request.latitud,
              longitud: request.longitud,
              direccion: request.direccion || "",
              barrio: request.barrio || "",
            })
          }>
          {hasPoint(request) ? "Editar ubicación" : "Agregar punto en el mapa"}
        </Button>
      )}
    </View>
  );
}
