import { db } from "~/server/db";
import { accounts } from "~/server/db/schema/accounts";
import { tenants } from "~/server/db/schema/tenants";
import { eq, and, ne } from "drizzle-orm";
import type { NewAccount } from "./types";

export async function getAccountById(id: string) {
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getAccountWithTenant(id: string) {
  const result = await db
    .select({
      id: accounts.id,
      name: accounts.name,
      lastName: accounts.lastName,
      email: accounts.email,
      imageUrl: accounts.imageUrl,
      role: accounts.role,
      idTenant: accounts.idTenant,
      disabled: accounts.disabled,
      createdAt: accounts.createdAt,
      tenants: {
        id: tenants.id,
        name: tenants.name,
        logo: tenants.logo,
      },
    })
    .from(accounts)
    .leftJoin(tenants, eq(accounts.idTenant, tenants.id))
    .where(eq(accounts.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getAccountsByTenant(tenantId: string) {
  return db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.idTenant, tenantId),
        eq(accounts.disabled, false)
      )
    )
    .orderBy(accounts.name);
}

export async function getUsersByTenant(tenantId: string, excludeUserId: string) {
  return db
    .select()
    .from(accounts)
    .where(
      and(
        eq(accounts.idTenant, tenantId),
        eq(accounts.disabled, false),
        ne(accounts.id, excludeUserId)
      )
    )
    .orderBy(accounts.name);
}

export async function createAccount(data: NewAccount) {
  const result = await db
    .insert(accounts)
    .values(data)
    .returning();

  return result[0];
}

export async function updateAccount(id: string, data: Partial<NewAccount>) {
  const result = await db
    .update(accounts)
    .set(data)
    .where(eq(accounts.id, id))
    .returning();

  return result[0];
}

export async function disableAccount(id: string) {
  const result = await db
    .update(accounts)
    .set({ disabled: true })
    .where(eq(accounts.id, id))
    .returning();

  return result[0];
}
