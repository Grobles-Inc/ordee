import { createFileRoute } from "@tanstack/react-router";
import { AccountsFeature } from "~/features/accounts";

export const Route = createFileRoute("/(auth)/(tabs)/profile/users/")({
  component: UsersPage,
});

function UsersPage() {
  return <AccountsFeature />;
}
