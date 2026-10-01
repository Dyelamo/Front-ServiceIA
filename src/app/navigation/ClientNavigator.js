import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme";

// TEMPORAL:
// seguimos usando tus pantallas actuales.
// Las iremos sustituyendo en la Fase 7.

import ClientHomeScreen from "../../features/requests/screen/client/ClientHomeScreen";
import ClientRequestsScreen from "../../features/requests/screen/client/ClientRequestsScreen";
import RequestDetailScreen from "../../features/requests/screen/client/RequestDetailScreen";
import { ProfileScreen } from "../../screens/ProfileScreen";
import NotificationsScreen from "../../features/notifications/screen/NotificationsScreen";

// Si todavía no existe NotificationsScreen,
// créala temporalmente más adelante.
// Por ahora podemos ocultarla o usar un placeholder.

import DescribeScreen from "../../features/requests/screen/client/create/DescribeScreen";

import CategoryScreen from "../../features/requests/screen/client/create/CategoryScreen";

import LocationScreen from "../../features/requests/screen/client/create/LocationScreen";

import UrgencyScreen from "../../features/requests/screen/client/create/UrgencyScreen";

import PhotosScreen from "../../features/requests/screen/client/create/PhotosScreen";

import ReviewScreen from "../../features/requests/screen/client/create/ReviewScreen";

import SuccessScreen from "../../features/requests/screen/client/create/SuccessScreen";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,

        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },

        tabBarIcon: ({ color, size, focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "MyRequests") {
            iconName = focused ? "document-text" : "document-text-outline";
          }

          if(route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          }

          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={ClientHomeScreen}
        options={{
          title: "Inicio",
        }}
      />

      <Tab.Screen
        name="MyRequests"
        component={ClientRequestsScreen}
        options={{
          title: "Publicaciones",
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          title: "Notificaciones",
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
      }}>
      <Stack.Screen name="ClientTabs" component={ClientTabs} />

      <Stack.Screen name="RequestDetail" component={RequestDetailScreen} />

      <Stack.Screen
        name="CreateRequestDescription"
        component={DescribeScreen}
      />

      <Stack.Screen name="CreateRequestCategory" component={CategoryScreen} />

      <Stack.Screen name="CreateRequestLocation" component={LocationScreen} />

      <Stack.Screen name="CreateRequestUrgency" component={UrgencyScreen} />

      <Stack.Screen name="CreateRequestPhotos" component={PhotosScreen} />

      <Stack.Screen name="CreateRequestReview" component={ReviewScreen} />

      <Stack.Screen name="CreateRequestSuccess" component={SuccessScreen} />
    </Stack.Navigator>
  );
}
