import { createFileRoute } from "@tanstack/react-router";
import { GuestOrdersFeature } from "~/features/guest-orders";

export const Route = createFileRoute("/(auth)/(tabs)/guest-order/")({
  component: GuestOrderPage,
});

function GuestOrderPage() {
  return <GuestOrdersFeature />;
}
