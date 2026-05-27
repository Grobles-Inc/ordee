import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/(tabs)/profile/membership/")({
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Membership</h1>
      <p className="text-muted-foreground">Membership plans coming soon...</p>
    </div>
  );
}
