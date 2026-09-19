import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@/styles/a11y-overrides.css";
import "@/styles/lec-shell.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { ProtectedSessionBoundary } from "@/features/auth/protected-session-boundary";
import "./i18n";
import { queryClient } from "@/lib/query-client";
import { mantineCssResolver, theme } from "@/theme";

export function LecDocAppRoot() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme} cssVariablesResolver={mantineCssResolver}>
        <ProtectedSessionBoundary>
          <ModalsProvider>
            <QueryClientProvider client={queryClient}>
              <Notifications position="bottom-center" limit={3} zIndex={10000} />
              <HelmetProvider>
                <App />
              </HelmetProvider>
            </QueryClientProvider>
          </ModalsProvider>
        </ProtectedSessionBoundary>
      </MantineProvider>
    </BrowserRouter>
  );
}
