import React, { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import {
  focusManager,
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useGlobalError } from "../errors/GlobalErrorContext";
import { shouldRetryRequest, shouldShowGlobalError } from "../errors/error-message";

export function AppQueryProvider({ children }) {
  const { notifyError } = useGlobalError();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.state.data !== undefined && shouldShowGlobalError(error)) {
              notifyError(error, "No pudimos actualizar la información.");
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (shouldShowGlobalError(error)) {
              notifyError(error, "No pudimos completar la operación.");
            }
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 10 * 60_000,
            retry: shouldRetryRequest,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(() => {
    if (Platform.OS === "web") {
      return undefined;
    }

    const subscription = AppState.addEventListener("change", (status) => {
      focusManager.setFocused(status === "active");
    });

    return () => subscription.remove();
  }, []);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
