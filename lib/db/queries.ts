import { eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { accounts, loginTypes, apiProviders } from "./schema";
import type { Account, TypeDefinition, EmailAccount, ApiKeyAccount } from "@/lib/types/account";
import { DEFAULT_LOGIN_TYPES, DEFAULT_API_PROVIDERS } from "@/lib/types/account";

function dbAccountToAccount(row: typeof accounts.$inferSelect): Account {
  if (row.accountType === "api-key") {
    return {
      id: row.id,
      type: "api-key",
      provider: row.provider!,
      apiKey: row.apiKey!,
      account: row.apiAccount ?? undefined,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    } as ApiKeyAccount;
  }
  return {
    id: row.id,
    type: row.type,
    email: row.email!,
    password: row.password!,
    totpSecret: row.totpSecret ?? undefined,
    recoveryEmail: row.recoveryEmail ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  } as EmailAccount;
}

function dbTypeToTypeDefinition(row: typeof loginTypes.$inferSelect | typeof apiProviders.$inferSelect): TypeDefinition {
  return {
    id: row.id,
    label: row.label,
    color: row.color,
    createdAt: row.createdAt,
  };
}

export async function getAllAccounts(): Promise<Account[]> {
  const rows = await db.select().from(accounts);
  return rows.map(dbAccountToAccount);
}

export async function createAccount(account: Account): Promise<void> {
  const isApiKey = account.type === "api-key";
  await db.insert(accounts).values({
    id: account.id,
    accountType: isApiKey ? "api-key" : "email",
    type: account.type,
    email: isApiKey ? null : (account as EmailAccount).email,
    password: isApiKey ? null : (account as EmailAccount).password,
    totpSecret: isApiKey ? null : (account as EmailAccount).totpSecret,
    recoveryEmail: isApiKey ? null : (account as EmailAccount).recoveryEmail,
    provider: isApiKey ? (account as ApiKeyAccount).provider : null,
    apiKey: isApiKey ? (account as ApiKeyAccount).apiKey : null,
    apiAccount: isApiKey ? (account as ApiKeyAccount).account : null,
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  });
}

export async function updateAccount(id: string, data: Partial<Account>): Promise<void> {
  const updateData: Record<string, unknown> = { updatedAt: Date.now() };
  
  if ("password" in data) updateData.password = data.password;
  if ("totpSecret" in data) updateData.totpSecret = data.totpSecret;
  if ("recoveryEmail" in data) updateData.recoveryEmail = data.recoveryEmail;
  if ("apiKey" in data) updateData.apiKey = data.apiKey;
  if ("account" in data) updateData.apiAccount = data.account;

  await db.update(accounts).set(updateData).where(eq(accounts.id, id));
}

export async function deleteAccount(id: string): Promise<void> {
  await db.delete(accounts).where(eq(accounts.id, id));
}

export async function deleteAccounts(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await db.delete(accounts).where(inArray(accounts.id, ids));
}

export async function getAllLoginTypes(): Promise<TypeDefinition[]> {
  const rows = await db.select().from(loginTypes);
  return rows.map(dbTypeToTypeDefinition);
}

export async function createLoginType(type: TypeDefinition): Promise<void> {
  await db.insert(loginTypes).values({
    id: type.id,
    label: type.label,
    color: type.color,
    createdAt: type.createdAt,
  });
}

export async function updateLoginType(id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>): Promise<void> {
  await db.update(loginTypes).set(data).where(eq(loginTypes.id, id));
}

export async function deleteLoginType(id: string): Promise<void> {
  await db.delete(loginTypes).where(eq(loginTypes.id, id));
}

export async function getAllApiProviders(): Promise<TypeDefinition[]> {
  const rows = await db.select().from(apiProviders);
  return rows.map(dbTypeToTypeDefinition);
}

export async function createApiProvider(provider: TypeDefinition): Promise<void> {
  await db.insert(apiProviders).values({
    id: provider.id,
    label: provider.label,
    color: provider.color,
    createdAt: provider.createdAt,
  });
}

export async function updateApiProvider(id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>): Promise<void> {
  await db.update(apiProviders).set(data).where(eq(apiProviders.id, id));
}

export async function deleteApiProvider(id: string): Promise<void> {
  await db.delete(apiProviders).where(eq(apiProviders.id, id));
}

export async function initializeDefaults(): Promise<void> {
  const existingLoginTypes = await db.select().from(loginTypes);
  if (existingLoginTypes.length === 0) {
    for (const type of DEFAULT_LOGIN_TYPES) {
      await db.insert(loginTypes).values({
        id: type.id,
        label: type.label,
        color: type.color,
        createdAt: type.createdAt,
      });
    }
  }

  const existingApiProviders = await db.select().from(apiProviders);
  if (existingApiProviders.length === 0) {
    for (const provider of DEFAULT_API_PROVIDERS) {
      await db.insert(apiProviders).values({
        id: provider.id,
        label: provider.label,
        color: provider.color,
        createdAt: provider.createdAt,
      });
    }
  }
}

export async function getAllData() {
  const [accountsData, loginTypesData, apiProvidersData] = await Promise.all([
    getAllAccounts(),
    getAllLoginTypes(),
    getAllApiProviders(),
  ]);
  return {
    accounts: accountsData,
    loginTypes: loginTypesData,
    apiProviders: apiProvidersData,
  };
}

export async function importData(
  importedAccounts: Account[],
  importedLoginTypes: TypeDefinition[],
  importedApiProviders: TypeDefinition[]
): Promise<{ added: number; updated: number }> {
  let added = 0;
  let updated = 0;
  const now = Date.now();

  const existingAccounts = await getAllAccounts();
  const existingAccountMap = new Map(existingAccounts.map(a => {
    const key = a.type === "api-key" 
      ? `api:${(a as ApiKeyAccount).apiKey}` 
      : `email:${(a as EmailAccount).email.toLowerCase()}`;
    return [key, a];
  }));

  for (const account of importedAccounts) {
    const key = account.type === "api-key"
      ? `api:${(account as ApiKeyAccount).apiKey}`
      : `email:${(account as EmailAccount).email.toLowerCase()}`;
    const existing = existingAccountMap.get(key);

    if (existing) {
      await db.update(accounts).set({
        password: account.type !== "api-key" ? (account as EmailAccount).password : null,
        totpSecret: account.type !== "api-key" ? (account as EmailAccount).totpSecret : null,
        recoveryEmail: account.type !== "api-key" ? (account as EmailAccount).recoveryEmail : null,
        apiKey: account.type === "api-key" ? (account as ApiKeyAccount).apiKey : null,
        apiAccount: account.type === "api-key" ? (account as ApiKeyAccount).account : null,
        updatedAt: now,
      }).where(eq(accounts.id, existing.id));
      updated++;
    } else {
      const newId = crypto.randomUUID();
      const isApiKey = account.type === "api-key";
      await db.insert(accounts).values({
        id: newId,
        accountType: isApiKey ? "api-key" : "email",
        type: account.type,
        email: isApiKey ? null : (account as EmailAccount).email,
        password: isApiKey ? null : (account as EmailAccount).password,
        totpSecret: isApiKey ? null : (account as EmailAccount).totpSecret,
        recoveryEmail: isApiKey ? null : (account as EmailAccount).recoveryEmail,
        provider: isApiKey ? (account as ApiKeyAccount).provider : null,
        apiKey: isApiKey ? (account as ApiKeyAccount).apiKey : null,
        apiAccount: isApiKey ? (account as ApiKeyAccount).account : null,
        createdAt: now,
        updatedAt: now,
      });
      added++;
    }
  }

  const existingLoginTypes = await getAllLoginTypes();
  const existingLoginTypeMap = new Map(existingLoginTypes.map(t => [t.label.toLowerCase(), t]));

  for (const type of importedLoginTypes) {
    const existing = existingLoginTypeMap.get(type.label.toLowerCase());
    if (existing) {
      if (existing.color !== type.color) {
        await db.update(loginTypes).set({ color: type.color }).where(eq(loginTypes.id, existing.id));
        updated++;
      }
    } else {
      await db.insert(loginTypes).values({
        id: type.id || `login-${crypto.randomUUID()}`,
        label: type.label,
        color: type.color,
        createdAt: type.createdAt || now,
      });
      added++;
    }
  }

  const existingApiProviders = await getAllApiProviders();
  const existingApiProviderMap = new Map(existingApiProviders.map(p => [p.label.toLowerCase(), p]));

  for (const provider of importedApiProviders) {
    const existing = existingApiProviderMap.get(provider.label.toLowerCase());
    if (existing) {
      if (existing.color !== provider.color) {
        await db.update(apiProviders).set({ color: provider.color }).where(eq(apiProviders.id, existing.id));
        updated++;
      }
    } else {
      await db.insert(apiProviders).values({
        id: provider.id || `api-${crypto.randomUUID()}`,
        label: provider.label,
        color: provider.color,
        createdAt: provider.createdAt || now,
      });
      added++;
    }
  }

  return { added, updated };
}
