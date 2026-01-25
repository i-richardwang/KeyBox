import type { Account, VaultStorage, ApiProvider } from "@/lib/types/account";
import { isEmailAccount, API_PROVIDERS } from "@/lib/types/account";

// Export file format with metadata
export interface ExportData {
  version: 1;
  source: "vault-key";
  exportedAt: number;
  accounts: Account[];
}

// Result of import operation
export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  error?: string;
}

/**
 * Export accounts to a JSON file and trigger download
 */
export function exportAccounts(accounts: Account[]): void {
  const data: ExportData = {
    version: 1,
    source: "vault-key",
    exportedAt: Date.now(),
    accounts,
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
 * Validate imported data structure
 */
function validateImportData(data: unknown): data is ExportData | VaultStorage {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  // Check for valid version
  if (obj.version !== 1) return false;

  // Check for accounts array
  if (!Array.isArray(obj.accounts)) return false;

  // Validate each account has required fields
  for (const account of obj.accounts) {
    if (!account || typeof account !== "object") return false;
    if (!("type" in account)) return false;

    const acc = account as Record<string, unknown>;
    if (acc.type === "gmail" || acc.type === "outlook") {
      if (!("email" in acc) || !("password" in acc)) return false;
    } else if (acc.type === "api-key") {
      if (!("provider" in acc) || !("apiKey" in acc)) return false;
      // Validate provider is a known ApiProvider
      if (!API_PROVIDERS.includes(acc.provider as ApiProvider)) return false;
    } else {
      return false;
    }
  }

  return true;
}

/**
 * Parse and validate import file content
 */
export function parseImportFile(content: string): ExportData | VaultStorage | null {
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
