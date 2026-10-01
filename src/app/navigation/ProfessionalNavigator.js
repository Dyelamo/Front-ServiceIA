import React from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../theme/index";

import ProfessionalHomeScreen from "../../features/professional/screens/ProfessionalHomeScreen";

import AvailableRequestsScreen from "../../features/requests/screen/professional/AvailableRequestsScreen";

import ProfessionalRequestDetailScreen from "../../features/requests/screen/professional/ProfessionalRequestDetailScreen";

import CreateOfferScreen from "../../features/offers/screens/CreateOfferScreen";

import ProfessionalProfileScreen from "../../features/professional/screens/ProfessionalProfileScreen";
import ProfessionalOffersScreen from "../../features/offers/screens/ProfessionalOffersScreen";
import BalanceScreen from "../../features/wallet/BalanceScreen";
import JobsScreen from "../../features/jobs/screens/JobsScreen";
const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

function ProfessionalTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,

        tabBarInactiveTintColor: colors.textMuted,

        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },

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

            case "ProfessionalProfile":
              iconName = focused ? "person" : "person-outline";
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
        name="ProfessionalProfile"
        component={ProfessionalProfileScreen}
        options={{
          title: "Perfil",
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
        name="ProfessionalRequestDetail"
        component={ProfessionalRequestDetailScreen}
      />

      <Stack.Screen name="CreateOffer" component={CreateOfferScreen} />

      <Stack.Screen name="Balance" component={BalanceScreen} />
    </Stack.Navigator>
  );
}
