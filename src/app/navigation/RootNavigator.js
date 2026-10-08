import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";

import ClientNavigator from "./ClientNavigator";

import ProfessionalNavigator from "./ProfessionalNavigator";

import ProfessionalOnboardingScreen from "../../features/professional/screens/ProfessionalOnboardingScreen";

import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "../../theme/index";

import { useAuth } from "../../hook/useAuth";

import { AppModeContext } from "../../features/app-mode/context/AppModeContext";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  const { mode } = useContext(AppModeContext);

  if (isLoading) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.brand}>Serv-IA</Text>

        <ActivityIndicator size="small" color={colors.primary} />

        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : mode === "profesional" ? (
          <RootStack.Group navigationKey="profesional">
            <RootStack.Screen
              name="Professional"
              component={ProfessionalNavigator}
            />

            <RootStack.Screen
              name="ProfessionalOnboarding"
              component={ProfessionalOnboardingScreen}
            />
          </RootStack.Group>
        ) : (
          <RootStack.Group navigationKey="cliente">
            <RootStack.Screen name="Client" component={ClientNavigator} />

            <RootStack.Screen
              name="ProfessionalOnboarding"
              component={ProfessionalOnboardingScreen}
            />
          </RootStack.Group>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: colors.background,
  },

  brand: {
    color: colors.primary,

    fontSize: 26,
    fontWeight: "800",

    marginBottom: spacing.xl,
  },

  loadingText: {
    color: colors.textSecondary,

    fontSize: 13,

    marginTop: spacing.md,
  },
});
