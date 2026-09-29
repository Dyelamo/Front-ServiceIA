import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import ClientNavigator from "./ClientNavigator";
import ProfessionalNavigator from "./ProfessionalNavigator";

import LoginScreen from "../features/auth/screens/LoginScreen";
import RegisterScreen from "../features/auth/screens/RegisterScreen";

import ProfessionalOnboardingScreen from "../screens/ProfessionalOnboardingScreen";

import { useAuth } from "../hook/useAuth";

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
          <>
            <RootStack.Screen
              name="Login"
              component={LoginScreen}
            />

            <RootStack.Screen
              name="Register"
              component={RegisterScreen}
            />
          </>
        ) : (
          <>
            <RootStack.Screen
              name="Client"
              component={ClientNavigator}
            />

            <RootStack.Screen
              name="Professional"
              component={ProfessionalNavigator}
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