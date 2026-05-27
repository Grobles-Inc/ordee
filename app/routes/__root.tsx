import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "~/auth";
import appCss from '../../styles/app.css?url'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <NeonAuthUIProvider authClient={authClient}>
        <Outlet />
        <Toaster position="top-right" richColors />
      </NeonAuthUIProvider>
    </QueryClientProvider>
  );
}
