import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_layout")({
  beforeLoad: async () => {
    // TODO: Check session with Neon Auth
    // If no session, redirect to sign-in
    // const session = await getSession();
    // if (!session) {
    //   throw redirect({ to: "/sign-in" });
    // }
  },
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Add sidebar/header navigation */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
