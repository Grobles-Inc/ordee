import { ITenant } from "@/interfaces";
import { supabase } from "./supabase";

export const PLAN_LIMITS = {
  FREE: {
    users: 5,
    categories: 5,
  },
  ESSENTIAL: {
    users: 10,
    categories: 10,
  },
};

export const getPlanLimits = async (restaurantId: string) => {
  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .select("*, plans:id_plan(name)")
    .eq("id", restaurantId)
    .single<ITenant>();

  if (tenantError) {
    throw new Error("Error getting restaurant plan");
  }

  const planName = tenant?.plans?.name?.toUpperCase() || "FREE";

  // Get current counts
  const { data: users, error: usersError } = await supabase
    .from("accounts")
    .select("id")
    .eq("id_tenant", restaurantId);

  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .select("id")
    .eq("id_tenant", restaurantId);

  if (usersError || categoriesError) {
    throw new Error("Error checking plan limits");
  }

  return {
    users: users?.length || 0,
    categories: categories?.length || 0,
    limits: PLAN_LIMITS[planName as keyof typeof PLAN_LIMITS],
  };
};

export const isUserLimitReached = async (
  restaurantId: string
): Promise<boolean> => {
  const { users, limits } = await getPlanLimits(restaurantId);
  return users >= limits.users;
};

export const isCategoryLimitReached = async (
  restaurantId: string
): Promise<boolean> => {
  const { categories, limits } = await getPlanLimits(restaurantId);
  return categories >= limits.categories;
};
