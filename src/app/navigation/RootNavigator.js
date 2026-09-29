import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import AuthNavigator from "./AuthNavigator";
import ClientNavigator from "./ClientNavigator";
import ProfessionalNavigator from "./ProfessionalNavigator";

import ProfessionalOnboardingScreen
  from "../../screens/ProfessionalOnboardingScreen";

import {
  useAuth,
} from "../../hook/useAuth";

const RootStack =
  createNativeStackNavigator();

export default function RootNavigator() {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!isAuthenticated ? (
          <RootStack.Screen
            name="Auth"
            component={AuthNavigator}
          />
        ) : (
          <>
            <RootStack.Screen
              name="Client"
              component={ClientNavigator}
            />

            <RootStack.Screen
              name="Professional"
              component={
                ProfessionalNavigator
              }
            />

            <RootStack.Screen
              name="ProfessionalOnboarding"
              component={
                ProfessionalOnboardingScreen
              }
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}