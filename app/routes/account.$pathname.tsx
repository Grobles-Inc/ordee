import { createFileRoute } from "@tanstack/react-router";
import { AccountView } from "@neondatabase/auth-ui";

export const Route = createFileRoute("/account/$pathname")({
  component: AccountPage,
});

function AccountPage() {
  const { pathname } = Route.useParams();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AccountView pathname={pathname} />
    </div>
  );
}
