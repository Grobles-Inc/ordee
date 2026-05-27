import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        {/* TODO: Add sign-in form with Neon Auth */}
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/sign-up" className="underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
