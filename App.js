// App.js
import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GlobalErrorProvider } from "./src/core/errors/GlobalErrorContext";
import { AppQueryProvider } from "./src/core/query/AppQueryProvider";
import { AppModeProvider } from "./src/features/app-mode/context/AppModeContext";
import { AuthProvider } from "./src/hook/useAuth";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <GlobalErrorProvider>
        <AppQueryProvider>
          <AuthProvider>
            <AppModeProvider>
              <RootNavigator />
            </AppModeProvider>
          </AuthProvider>
        </AppQueryProvider>
      </GlobalErrorProvider>
    </SafeAreaProvider>
  );
}
