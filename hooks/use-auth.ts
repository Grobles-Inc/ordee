import { authClient } from "~/auth";

export function useAuth() {
  const { data, isLoading, error } = authClient.useSession();

  return {
    session: data?.session ?? null,
    profile: data?.user ?? null,
    isLoading,
    error,
  };
}
