import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/profile/membership/paywall"
)({
  component: PaywallPage,
});

function PaywallPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Paywall</h1>
      <p className="text-muted-foreground">Paywall coming soon...</p>
    </div>
  );
}
