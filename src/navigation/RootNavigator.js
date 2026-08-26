import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ClientNavigator from "./ClientNavigator";
import ProfessionalNavigator from "./ProfessionalNavigator";

import { LoginScreen } from "../screens/LoginScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import ProfessionalOnboardingScreen from "../screens/ProfessionalOnboardingScreen";

import { useAuth } from "../hook/useAuth";

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isAuthenticated ? (
          <>
            <RootStack.Screen name="Login">
              {({ navigation }) => (
                <LoginScreen
                  onLogin={login}
                  onGoToRegister={() => navigation.navigate("Register")}
                />
              )}
            </RootStack.Screen>

            <RootStack.Screen name="Register">
              {({ navigation }) => (
                <RegisterScreen
                  onRegistered={() => navigation.navigate("Login")}
                  onGoToLogin={() => navigation.navigate("Login")}
                />
              )}
            </RootStack.Screen>
          </>
        ) : (
          <>
            <RootStack.Screen name="Client" component={ClientNavigator} />

            <RootStack.Screen
              name="Professional"
              component={ProfessionalNavigator}
            />

            <RootStack.Screen
              name="ProfessionalOnboarding"
              component={ProfessionalOnboardingScreen}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
