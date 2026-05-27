import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/guest-order/")({
  component: GuestOrderPage,
});

function GuestOrderPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Guest Orders</h1>
      <p className="text-muted-foreground">Guest orders feature coming soon...</p>
    </div>
  );
}
