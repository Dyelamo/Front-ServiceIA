import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme";

import ClientHomeScreen from "../../features/requests/screens/client/ClientHomeScreen";
import ClientRequestsScreen from "../../features/requests/screens/client/ClientRequestsScreen";
import RequestDetailScreen from "../../features/requests/screens/client/RequestDetailScreen";
import ClientProfileScreen from "../../features/profile/screens/ClientProfileScreen";
import NotificationsScreen from "../../features/notifications/screens/NotificationsScreen";

import DescribeScreen from "../../features/requests/screens/client/create/DescribeScreen";
import CategoryScreen from "../../features/requests/screens/client/create/CategoryScreen";
import LocationScreen from "../../features/requests/screens/client/create/LocationScreen";
import UrgencyScreen from "../../features/requests/screens/client/create/UrgencyScreen";
import PhotosScreen from "../../features/requests/screens/client/create/PhotosScreen";
import ReviewScreen from "../../features/requests/screens/client/create/ReviewScreen";
import SuccessScreen from "../../features/requests/screens/client/create/SuccessScreen";

import { StyleSheet } from "react-native";

import { useResponsive } from "../../shared/hooks/useResponsive";

import { RequestDraftProvider } from "../../features/requests/context/RequestDraftContext";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function ClientTabs() {
  const { isDesktop } = useResponsive();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarPosition: isDesktop ? "left" : "bottom",

        tabBarLabelPosition: isDesktop ? "beside-icon" : "below-icon",

        tabBarActiveTintColor: colors.primary,

        tabBarInactiveTintColor: colors.textMuted,

        tabBarActiveBackgroundColor: isDesktop
          ? colors.primaryLight
          : undefined,

        tabBarHideOnKeyboard: true,

        tabBarStyle: isDesktop ? styles.desktopTabBar : styles.mobileTabBar,

        tabBarItemStyle: isDesktop ? styles.desktopTabItem : undefined,

        tabBarLabelStyle: isDesktop ? styles.desktopLabel : styles.mobileLabel,

        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }

          if (route.name === "MyRequests") {
            iconName = focused ? "document-text" : "document-text-outline";
          }

          if (route.name === "Notifications") {
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
        component={ClientProfileScreen}
        options={{
          title: "Perfil",
        }}
      />
    </Tab.Navigator>
  );
}

export default function ClientNavigator() {
  return (
    <RequestDraftProvider>
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
    </RequestDraftProvider>
  );
}

const styles = StyleSheet.create({
  mobileTabBar: {
    minHeight: 64,

    paddingTop: 6,

    borderTopColor: colors.border,

    backgroundColor: colors.surface,
  },

  mobileLabel: {
    fontSize: 12,

    fontWeight: "600",
  },

  desktopTabBar: {
    width: 230,

    paddingHorizontal: 12,

    paddingTop: 24,

    paddingBottom: 24,

    borderTopWidth: 0,

    borderRightWidth: 1,

    borderRightColor: colors.border,

    backgroundColor: colors.surface,
  },

  desktopTabItem: {
    minHeight: 50,

    borderRadius: 12,

    marginVertical: 3,
  },

  desktopLabel: {
    fontSize: 14,

    fontWeight: "700",
  },
});
