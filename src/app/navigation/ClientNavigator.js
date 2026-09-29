import React from "react";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import {
  colors,
} from "../../theme";


// TEMPORAL:
// seguimos usando tus pantallas actuales.
// Las iremos sustituyendo en la Fase 7.

import ClientHomeScreen from "../../screens/client/HomeScreen";
import ClientRequestsScreen from "../../screens/client/ClientRequestsScreen";
import {ProfileScreen} from "../../screens/ProfileScreen";


// Si todavía no existe NotificationsScreen,
// créala temporalmente más adelante.
// Por ahora podemos ocultarla o usar un placeholder.

import Step1DescriptionScreen from "../../screens/client/Step1DescribeScreen";
import Step2CategoryScreen from "../../screens/client/Step2LocationScreen";
import Step3LocationScreen from "../../screens/client/Step3UrgencyScreen";
import Step4UrgencyScreen from "../../screens/client//Step4PhotosScreen";
import Step5ReviewScreen from "../../screens/client/Step5ReviewScreen";

const Tab =
  createBottomTabNavigator();

const Stack =
  createNativeStackNavigator();


  function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor:
          colors.primary,

        tabBarInactiveTintColor:
          colors.textMuted,

        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor:
            colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({
          color,
          size,
          focused,
        }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused
              ? "home"
              : "home-outline";
          }

          if (
            route.name ===
            "MyRequests"
          ) {
            iconName = focused
              ? "document-text"
              : "document-text-outline";
          }

          if (
            route.name ===
            "Profile"
          ) {
            iconName = focused
              ? "person"
              : "person-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={22}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={ClientHomeScreen}
        options={{
          title: "Inicio",
        }}
      />

      <Tab.Screen
        name="MyRequests"
        component={
          ClientRequestsScreen
        }
        options={{
          title: "Publicaciones",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

export default function ClientNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="ClientTabs"
        component={ClientTabs}
      />

      <Stack.Screen
        name="CreateRequestDescription"
        component={
          Step1DescriptionScreen
        }
      />

      <Stack.Screen
        name="CreateRequestCategory"
        component={
          Step2CategoryScreen
        }
      />

      <Stack.Screen
        name="CreateRequestLocation"
        component={
          Step3LocationScreen
        }
      />

      <Stack.Screen
        name="CreateRequestUrgency"
        component={
          Step4UrgencyScreen
        }
      />

      <Stack.Screen
        name="CreateRequestReview"
        component={
          Step5ReviewScreen
        }
      />
    </Stack.Navigator>
  );
}