// App.js
import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppModeProvider } from "./src/lib/AppModeContext";
import { AuthProvider } from "./src/hook/useAuth";
import RootNavigator from "./src/app/navigation/RootNavigator";
import { RequestDraftProvider } from "./src/features/requests/context/RequestDraftContext";
import UIPreview from "./src/screens/UiPreviewScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RequestDraftProvider>
          <AppModeProvider>
            <RootNavigator />
          </AppModeProvider>
        </RequestDraftProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// (
//   <SafeAreaProvider>
//       <UIPreview />
//   </SafeAreaProvider>
// );
