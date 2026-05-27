import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Payments</h1>
      <p className="text-muted-foreground">Payments feature coming soon...</p>
    </div>
  );
}
