import type { Account, TypeDefinition } from "@/lib/types/account";
import { isEmailAccount } from "@/lib/types/account";

export interface ExportData {
  version: 1;
  source: "keybox";
  exportedAt: number;
  accounts: Account[];
  loginTypes?: TypeDefinition[];
  apiProviders?: TypeDefinition[];
}

export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  error?: string;
}

function getAccountKey(account: Account): string {
  if (isEmailAccount(account)) {
    return `email:${account.email.toLowerCase()}`;
  }
  return `api:${account.provider.toLowerCase()}`;
}

function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  if (obj.version !== 1) return false;
  if (!Array.isArray(obj.accounts)) return false;

  for (const account of obj.accounts) {
    if (!account || typeof account !== "object") return false;
    if (!("type" in account)) return false;

    const acc = account as Record<string, unknown>;

    if (acc.type !== "api-key") {
      if (!("email" in acc) || !("password" in acc)) return false;
      if (typeof acc.type !== "string") return false;
    } else {
      if (!("provider" in acc) || !("apiKey" in acc)) return false;
      if (typeof acc.provider !== "string") return false;
    }
  }

  if (obj.loginTypes !== undefined && !Array.isArray(obj.loginTypes)) return false;
  if (obj.apiProviders !== undefined && !Array.isArray(obj.apiProviders)) return false;

  return true;
}

export function parseImportFile(content: string): ExportData | null {
  try {
    const data = JSON.parse(content);
    if (validateImportData(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function hasAccountChanges(existing: Account, imported: Account): boolean {
  if (isEmailAccount(existing) && isEmailAccount(imported)) {
    return (
      existing.password !== imported.password ||
      existing.totpSecret !== imported.totpSecret ||
      existing.recoveryEmail !== imported.recoveryEmail ||
      existing.type !== imported.type
    );
  }
  if (!isEmailAccount(existing) && !isEmailAccount(imported)) {
    return (
      existing.apiKey !== imported.apiKey ||
      existing.account !== imported.account
    );
  }
  return true;
}

export function mergeAccounts(
  existing: Account[],
  imported: Account[]
): { accounts: Account[]; added: number; updated: number } {
  const now = Date.now();
  const existingMap = new Map<string, Account>();

  for (const account of existing) {
    existingMap.set(getAccountKey(account), account);
  }

  let added = 0;
  let updated = 0;

  for (const importedAccount of imported) {
    const key = getAccountKey(importedAccount);
    const existingAccount = existingMap.get(key);

    if (existingAccount) {
      if (hasAccountChanges(existingAccount, importedAccount)) {
        existingMap.set(key, {
          ...importedAccount,
          id: existingAccount.id,
          createdAt: existingAccount.createdAt,
          updatedAt: now,
        } as Account);
        updated++;
      }
    } else {
      existingMap.set(key, {
        ...importedAccount,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as Account);
      added++;
    }
  }

  return {
    accounts: Array.from(existingMap.values()),
    added,
    updated,
  };
}

export function mergeTypes(
  existing: TypeDefinition[],
  imported: TypeDefinition[]
): { types: TypeDefinition[]; added: number; updated: number } {
  const existingMap = new Map<string, TypeDefinition>();

  for (const type of existing) {
    existingMap.set(type.label.toLowerCase(), type);
  }

  let added = 0;
  let updated = 0;

  for (const importedType of imported) {
    const key = importedType.label.toLowerCase();
    const existingType = existingMap.get(key);

    if (existingType) {
      // Only count as updated if color actually changed
      if (existingType.color !== importedType.color) {
        existingMap.set(key, {
          ...importedType,
          id: existingType.id,
        });
        updated++;
      }
    } else {
      existingMap.set(key, importedType);
      added++;
    }
  }

  return {
    types: Array.from(existingMap.values()),
    added,
    updated,
  };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
