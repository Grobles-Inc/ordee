import { createFileRoute } from "@tanstack/react-router";
import { PaymentsFeature } from "~/features/payments";

export const Route = createFileRoute("/(auth)/(tabs)/payments/")({
  component: PaymentsPage,
});

function PaymentsPage() {
  return <PaymentsFeature />;
}
