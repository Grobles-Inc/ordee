import { createFileRoute } from "@tanstack/react-router";
import {
  SignedIn,
  RedirectToSignIn,
  UserButton,
} from "@neondatabase/auth-ui";
import { authClient } from "~/auth";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data } = authClient.useSession();

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to Ordee</h1>
            <p className="text-muted-foreground mt-2">
              Restaurant management made simple
            </p>
            <div className="mt-4">
              <UserButton />
            </div>
            {data?.session && (
              <pre className="mt-6 max-w-2xl overflow-x-auto rounded-lg bg-muted p-4 text-left text-sm">
                <code>
                  {JSON.stringify(
                    { session: data.session, user: data.user },
                    null,
                    2
                  )}
                </code>
              </pre>
            )}
          </div>
        </div>
      </SignedIn>
      <RedirectToSignIn />
    </>
  );
}
