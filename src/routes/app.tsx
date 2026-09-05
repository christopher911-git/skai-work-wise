import { Outlet, createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/sk/app-shell";
import { Toaster } from "@/components/ui/sonner";
import { SkProvider } from "@/lib/sk-store";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <SkProvider>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster position="top-right" />
    </SkProvider>
  );
}
