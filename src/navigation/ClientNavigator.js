// src/navigation/ClientNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RequestFormProvider } from "../lib/RequestFormContext";

import HomeScreen from "../screens/client/HomeScreen";
import Step1DescribeScreen from "../screens/client/Step1DescribeScreen";
import Step2LocationScreen from "../screens/client/Step2LocationScreen";
import Step3UrgencyScreen from "../screens/client/Step3UrgencyScreen";
import Step4PhotosScreen from "../screens/client/Step4PhotosScreen";
import Step5ReviewScreen from "../screens/client/Step5ReviewScreen";
import AIReviewScreen from "../screens/client/AIReviewScreen";
import ClientRequestsScreen from "../screens/client/ClientRequestsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function ClientNavigator() {
  return (
    <RequestFormProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Step1Describe" component={Step1DescribeScreen} />
        <Stack.Screen name="Step2Location" component={Step2LocationScreen} />
        <Stack.Screen name="Step3Urgency" component={Step3UrgencyScreen} />
        <Stack.Screen name="Step4Photos" component={Step4PhotosScreen} />
        <Stack.Screen name="Step5Review" component={Step5ReviewScreen} />
        <Stack.Screen name="AIReview" component={AIReviewScreen} />
        <Stack.Screen
          name="MisPublicaciones"
          component={ClientRequestsScreen}
        />
        <Stack.Screen name="Perfil" component={ProfileScreen} />
      </Stack.Navigator>
    </RequestFormProvider>
  );
}
