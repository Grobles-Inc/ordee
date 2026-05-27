import { createFileRoute } from "@tanstack/react-router";
import { MembershipFeature } from "~/features/membership";

export const Route = createFileRoute("/(auth)/(tabs)/profile/membership/")({
  component: MembershipPage,
});

function MembershipPage() {
  return <MembershipFeature />;
}
