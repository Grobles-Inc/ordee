import { createFileRoute } from "@tanstack/react-router";
import { AuthView } from "@neondatabase/auth-ui";

export const Route = createFileRoute("/auth/$pathname")({
  component: AuthPage,
});

function AuthPage() {
  const { pathname } = Route.useParams();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <AuthView pathname={pathname} />
    </div>
  );
}
