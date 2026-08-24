// src/navigation/RootNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClientNavigator from './ClientNavigator';
import ProfessionalNavigator from './ProfessionalNavigator';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Client" component={ClientNavigator} />
        <RootStack.Screen name="Professional" component={ProfessionalNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
