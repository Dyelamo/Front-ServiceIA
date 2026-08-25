// App.js
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppModeProvider } from './src/lib/AppModeContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppModeProvider>
        <StatusBar style="dark" />
        <RootNavigator />
      </AppModeProvider>
    </SafeAreaProvider>
  );
}

