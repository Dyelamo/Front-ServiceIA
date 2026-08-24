// src/navigation/ProfessionalNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import ProHomeScreen from '../screens/professional/ProHomeScreen';
import RequestsScreen from '../screens/professional/RequestsScreen';
import JobsScreen from '../screens/professional/JobScreen';
import BalanceScreen from '../screens/professional/BalnceScreen';
import ProfileScreen from '../screens/professional/ProfileScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
  Inicio: 'home',
  Solicitudes: 'clipboard',
  Trabajos: 'briefcase',
  Saldo: 'card',
  Perfil: 'person',
};

export default function ProfessionalNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { borderTopColor: colors.border },
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={`${ICONS[route.name]}${focused ? '' : '-outline'}`}
            size={size ? size - 4 : 20}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Inicio" component={ProHomeScreen} />
      <Tab.Screen name="Solicitudes" component={RequestsScreen} />
      <Tab.Screen name="Trabajos" component={JobsScreen} />
      <Tab.Screen name="Saldo" component={BalanceScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
