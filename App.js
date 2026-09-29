// App.js
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppModeProvider } from "./src/lib/AppModeContext";
import { AuthProvider } from "./src/hook/useAuth";
import RootNavigator from "./src/navigation/RootNavigator";
import UIPreview from "./src/screens/UiPreviewScreen";

export default function App() {
  return(
    <SafeAreaProvider>
        <UIPreview />
    </SafeAreaProvider>
  );
  // (
  //   <SafeAreaProvider>
  //     <AppModeProvider>
  //       <AuthProvider>
  //         <StatusBar style="dark" />
  //         <RootNavigator />
  //       </AuthProvider>
  //     </AppModeProvider>
  //   </SafeAreaProvider>
  // );
}
