import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius, shadows, spacing } from "../../theme";
import { getApiErrorMessage } from "./error-message";

const GlobalErrorContext = createContext(null);
const AUTO_DISMISS_MS = 6000;

export function GlobalErrorProvider({ children }) {
  const [message, setMessage] = useState("");

  const dismissError = useCallback(() => {
    setMessage("");
  }, []);

  const notifyError = useCallback((error, fallback) => {
    setMessage(getApiErrorMessage(error, fallback));
  }, []);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeout = setTimeout(dismissError, AUTO_DISMISS_MS);
    return () => clearTimeout(timeout);
  }, [dismissError, message]);

  const value = useMemo(() => ({ dismissError, notifyError }), [dismissError, notifyError]);

  return (
    <GlobalErrorContext.Provider value={value}>
      <View style={styles.app}>{children}</View>

      {message ? (
        <View pointerEvents="box-none" style={styles.overlay}>
          <View accessibilityLiveRegion="assertive" style={styles.banner}>
            <Ionicons name="alert-circle" size={22} color={colors.error} />
            <Text style={styles.message}>{message}</Text>
            <Pressable
              accessibilityLabel="Cerrar mensaje de error"
              accessibilityRole="button"
              hitSlop={8}
              onPress={dismissError}
              style={styles.closeButton}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
        </View>
      ) : null}
    </GlobalErrorContext.Provider>
  );
}

export function useGlobalError() {
  const context = useContext(GlobalErrorContext);

  if (!context) {
    throw new Error("useGlobalError debe utilizarse dentro de GlobalErrorProvider");
  }

  return context;
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: spacing.lg,
    left: spacing.md,
    right: spacing.md,
    alignItems: "center",
  },
  banner: {
    width: "100%",
    maxWidth: 620,
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  message: {
    flex: 1,
    marginHorizontal: spacing.sm,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
