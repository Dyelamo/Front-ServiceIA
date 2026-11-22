import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/index";

import ProfessionalHomeScreen from "../../features/professional/screens/ProfessionalHomeScreen";

import AvailableRequestsScreen from "../../features/requests/screens/professional/AvailableRequestsScreen";

import ProfessionalRequestDetailScreen from "../../features/requests/screens/professional/ProfessionalRequestDetailScreen";

import CreateOfferScreen from "../../features/offers/screens/CreateOfferScreen";

import ProfessionalProfileScreen from "../../features/professional/screens/ProfessionalProfileScreen";
import WorkerProfileScreen from "../../features/professional/screens/WorkerProfileScreen";
import NotificationsScreen from "../../features/notifications/screens/NotificationsScreen";
import ProfessionalOffersScreen from "../../features/offers/screens/ProfessionalOffersScreen";
import BalanceScreen from "../../features/wallet/screens/BalanceScreen";
import JobsScreen from "../../features/jobs/screens/JobsScreen";
import MessagesScreen from "../../features/chat/screens/MessagesScreen";
import ChatScreen from "../../features/chat/screens/ChatScreen";

import { StyleSheet } from "react-native";

import { useResponsive } from "../../shared/hooks/useResponsive";
import { useUnreadMessages } from "../../features/chat/hooks/useUnreadMessages";

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function ProfessionalTabs() {
  const { isDesktop } = useResponsive();
  const { unreadCount } = useUnreadMessages();
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

          switch (route.name) {
            case "ProfessionalHome":
              iconName = focused ? "home" : "home-outline";
              break;

            case "AvailableRequests":
              iconName = focused ? "search" : "search-outline";
              break;

            case "ProfessionalOffers":
              iconName = focused ? "paper-plane" : "paper-plane-outline";
              break;

            case "Jobs":
              iconName = focused ? "briefcase" : "briefcase-outline";
              break;

            case "Messages":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;

            default:
              iconName = "ellipse-outline";
          }

          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}>
      <Tab.Screen
        name="ProfessionalHome"
        component={ProfessionalHomeScreen}
        options={{
          title: "Inicio",
        }}
      />

      <Tab.Screen
        name="AvailableRequests"
        component={AvailableRequestsScreen}
        options={{
          title: "Solicitudes",
        }}
      />

      <Tab.Screen
        name="ProfessionalOffers"
        component={ProfessionalOffersScreen}
        options={{
          title: "Ofertas",
        }}
      />

      <Tab.Screen
        name="Jobs"
        component={JobsScreen}
        options={{
          title: "Trabajos",
        }}
      />

      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: "Mensajes",
          tabBarBadge:
            unreadCount > 0
              ? unreadCount > 99
                ? "99+"
                : unreadCount
              : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#EF4444",
            color: "#FFFFFF",
            fontSize: 10,
            fontWeight: "700",
            minWidth: 18,
            height: 18,
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function ProfessionalNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="ProfessionalTabs" component={ProfessionalTabs} />

      <Stack.Screen
        name="ProfessionalProfile"
        component={ProfessionalProfileScreen}
      />

      <Stack.Screen
        name="ProfessionalRequestDetail"
        component={ProfessionalRequestDetailScreen}
      />

      <Stack.Screen name="CreateOffer" component={CreateOfferScreen} />

      <Stack.Screen name="Balance" component={BalanceScreen} />

      <Stack.Screen name="WorkerProfile" component={WorkerProfileScreen} />

      <Stack.Screen name="Notifications" component={NotificationsScreen} />

      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
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
    fontSize: 11,

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
