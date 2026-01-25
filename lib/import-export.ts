import type { Account, VaultStorage, CustomLoginType, CustomApiProvider } from "@/lib/types/account";
import { isEmailAccount } from "@/lib/types/account";

// Export file format with metadata
export interface ExportData {
  version: 2;
  source: "vault-key";
  exportedAt: number;
  accounts: Account[];
  customLoginTypes: CustomLoginType[];
  customApiProviders: CustomApiProvider[];
}

// Result of import operation
export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  error?: string;
}

/**
 * Export accounts and custom types to a JSON file and trigger download
 */
export function exportAccounts(
  accounts: Account[],
  customLoginTypes: CustomLoginType[],
  customApiProviders: CustomApiProvider[]
): void {
  const data: ExportData = {
    version: 2,
    source: "vault-key",
    exportedAt: Date.now(),
    accounts,
    customLoginTypes,
    customApiProviders,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const date = new Date().toISOString().split("T")[0];
  const filename = `vault-key-${date}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Get unique identifier for an account (for merge comparison)
 */
function getAccountKey(account: Account): string {
  if (isEmailAccount(account)) {
    return `email:${account.email.toLowerCase()}`;
  }
  return `api:${account.provider.toLowerCase()}`;
}

/**
 * Validate imported data structure (supports v1 and v2)
 */
function validateImportData(data: unknown): data is ExportData | VaultStorage {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  // Check for valid version (1 or 2)
  if (obj.version !== 1 && obj.version !== 2) return false;

  // Check for accounts array
  if (!Array.isArray(obj.accounts)) return false;

  // Validate each account has required fields
  for (const account of obj.accounts) {
    if (!account || typeof account !== "object") return false;
    if (!("type" in account)) return false;

    const acc = account as Record<string, unknown>;

    // Check if it's an email account (not api-key type)
    if (acc.type !== "api-key") {
      if (!("email" in acc) || !("password" in acc)) return false;
      // For v2, allow custom login types
      if (typeof acc.type !== "string") return false;
    } else {
      // API key account
      if (!("provider" in acc) || !("apiKey" in acc)) return false;
      if (typeof acc.provider !== "string") return false;
    }
  }

  // Validate custom types if present (v2)
  if (obj.customLoginTypes && !Array.isArray(obj.customLoginTypes)) return false;
  if (obj.customApiProviders && !Array.isArray(obj.customApiProviders)) return false;

  return true;
}

/**
 * Parse and validate import file content
 */
export function parseImportFile(content: string): (ExportData | VaultStorage) | null {
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

/**
 * Merge imported accounts with existing accounts
 * - Same identifier: update existing account
 * - New identifier: add new account
 * - Existing but not in import: keep unchanged
 */
export function mergeAccounts(
  existing: Account[],
  imported: Account[]
): { accounts: Account[]; added: number; updated: number } {
  const now = Date.now();
  const existingMap = new Map<string, Account>();

  // Build map of existing accounts
  for (const account of existing) {
    existingMap.set(getAccountKey(account), account);
  }

  let added = 0;
  let updated = 0;

  // Process imported accounts
  for (const importedAccount of imported) {
    const key = getAccountKey(importedAccount);
    const existingAccount = existingMap.get(key);

    if (existingAccount) {
      // Update existing account, preserve id and createdAt
      existingMap.set(key, {
        ...importedAccount,
        id: existingAccount.id,
        createdAt: existingAccount.createdAt,
        updatedAt: now,
      } as Account);
      updated++;
    } else {
      // Add new account with new id
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

/**
 * Merge imported custom types with existing ones
 */
export function mergeCustomTypes<T extends { id: string; label: string }>(
  existing: T[],
  imported: T[]
): { types: T[]; added: number; updated: number } {
  const existingMap = new Map<string, T>();

  // Build map of existing types by label (case-insensitive)
  for (const type of existing) {
    existingMap.set(type.label.toLowerCase(), type);
  }

  let added = 0;
  let updated = 0;

  // Process imported types
  for (const importedType of imported) {
    const key = importedType.label.toLowerCase();
    const existingType = existingMap.get(key);

    if (existingType) {
      // Update existing type, preserve id
      existingMap.set(key, {
        ...importedType,
        id: existingType.id,
      });
      updated++;
    } else {
      // Add new type
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

/**
 * Read file content as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
