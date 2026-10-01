import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";

import ClientNavigator from "./ClientNavigator";

import ProfessionalNavigator from "./ProfessionalNavigator";

import ProfessionalOnboardingScreen from "../../features/professional/screens/ProfessionalOnboardingScreen";

import { useAuth } from "../../hook/useAuth";

import { AppModeContext } from "../../features/app-mode/context/AppModeContext";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  const { mode } = useContext(AppModeContext);

  if (isLoading) {
    return null;
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
