import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../../core/errors/error-message";
import { Button } from "../../shared/ui";
import { colors, spacing } from "../../theme";
import LocationMap from "./LocationMap";
import { currentPoint, hasPoint, lookupAddress } from "./location";

export default function LocationPicker({
  point,
  address,
  onSelect,
  onAddress,
  autoLocate = false,
}) {
  const revision = useRef(0);
  const addressRef = useRef(address);
  const [pending, setPending] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    addressRef.current = address;
  }, [address]);

  async function select(selected, movePoint = true) {
    const request = ++revision.current;
    const previousAddress = addressRef.current;
    setNotice("");
    if (movePoint) onSelect(selected);
    setPending("address");
    try {
      const result = await lookupAddress({
        latitud: selected.latitud,
        longitud: selected.longitud,
      });
      if (request !== revision.current || previousAddress !== addressRef.current) return;
      if (result?.direccion) {
        onAddress(result);
        setNotice("Dirección sugerida. Revisa la calle y completa la numeración si hace falta.");
      } else {
        setNotice("No encontramos una dirección para ese punto. Escríbela manualmente.");
      }
    } catch (error) {
      if (request === revision.current) {
        setNotice(getApiErrorMessage(error, "Escribe la dirección manualmente."));
      }
    } finally {
      if (request === revision.current) setPending("");
    }
  }

  async function locate() {
    const request = ++revision.current;
    setPending("gps");
    setNotice("");
    try {
      const selected = await currentPoint();
      if (!hasPoint(selected)) throw new Error("Punto inválido");
      if (request === revision.current) await select(selected);
    } catch {
      if (request === revision.current) {
        setNotice("No pudimos obtener tu ubicación. Puedes marcar el punto en el mapa.");
      }
    } finally {
      if (request === revision.current) setPending("");
    }
  }

  useEffect(() => {
    if (autoLocate && !hasPoint(point)) locate();
    // Solo al abrir el paso: una selección manual posterior nunca se reemplaza.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.help}>Toca el mapa para marcar el punto de referencia.</Text>
      <LocationMap point={point} onSelect={select} />
      <Button
        variant="outline"
        disabled={Boolean(pending)}
        loading={pending === "gps"}
        onPress={locate}>
        Usar mi ubicación actual
      </Button>
      {hasPoint(point) ? (
        <Button
          variant="outline"
          disabled={Boolean(pending)}
          loading={pending === "address"}
          onPress={() => select(point, false)}>
          {pending === "address" ? "Buscando dirección…" : "Volver a buscar dirección"}
        </Button>
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
  container: { gap: spacing.sm, marginVertical: spacing.md },
  help: { color: colors.textSecondary, fontSize: 13 },
});
