"use client";

import { useState, useCallback } from "react";
import type { Account, NewAccount, VaultStorage, CustomLoginType, CustomApiProvider } from "@/lib/types/account";
import { STORAGE_KEY } from "@/lib/types/account";
import {
  exportAccounts as exportAccountsUtil,
  parseImportFile,
  mergeAccounts,
  mergeCustomTypes,
  readFileAsText,
  type ImportResult,
  type ExportData,
} from "@/lib/import-export";

interface ImportCallbacks {
  customLoginTypes: CustomLoginType[];
  customApiProviders: CustomApiProvider[];
  onImportCustomTypes: (loginTypes: CustomLoginType[], apiProviders: CustomApiProvider[]) => void;
}

/**
 * Hook for managing accounts with localStorage persistence
 */
export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: VaultStorage = JSON.parse(stored);
        return data.accounts || [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Persist to localStorage
  const persist = useCallback((updated: Account[]) => {
    // Read existing data to preserve custom types
    const stored = localStorage.getItem(STORAGE_KEY);
    let existingData: VaultStorage = { version: 2, accounts: [] };

    if (stored) {
      try {
        existingData = JSON.parse(stored);
      } catch {
        // Use defaults
      }
    }

    const data: VaultStorage = {
      ...existingData,
      version: 2,
      accounts: updated,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, []);

  // Add new account
  const addAccount = useCallback(
    (data: NewAccount) => {
      const now = Date.now();
      const account = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      } as Account;

      setAccounts((prev) => {
        const updated = [...prev, account];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  // Update existing account
  const updateAccount = useCallback(
    (id: string, data: Partial<Omit<Account, "id" | "type" | "createdAt">>) => {
      setAccounts((prev) => {
        const updated = prev.map((account) => {
          if (account.id !== id) return account;
          return { ...account, ...data, updatedAt: Date.now() } as Account;
        });
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  // Delete account
  const deleteAccount = useCallback(
    (id: string) => {
      setAccounts((prev) => {
        const updated = prev.filter((account) => account.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  // Export accounts to JSON file (needs custom types from caller)
  const exportAccounts = useCallback((
    customLoginTypes: CustomLoginType[],
    customApiProviders: CustomApiProvider[]
  ) => {
    exportAccountsUtil(accounts, customLoginTypes, customApiProviders);
  }, [accounts]);

  // Import accounts from file with smart merge
  const importAccounts = useCallback(
    async (
      file: File,
      callbacks: ImportCallbacks
    ): Promise<ImportResult> => {
      try {
        const content = await readFileAsText(file);
        const data = parseImportFile(content);

        if (!data) {
          return { success: false, added: 0, updated: 0, error: "Invalid file format" };
        }

        // Merge accounts
        const { accounts: mergedAccounts, added: accountsAdded, updated: accountsUpdated } =
          mergeAccounts(accounts, data.accounts);

        // Merge custom types if present (v2 format)
        let totalAdded = accountsAdded;
        let totalUpdated = accountsUpdated;

        const exportData = data as ExportData;
        if (exportData.customLoginTypes || exportData.customApiProviders) {
          const importedLoginTypes = exportData.customLoginTypes || [];
          const importedApiProviders = exportData.customApiProviders || [];

          const { types: mergedLoginTypes, added: loginAdded, updated: loginUpdated } =
            mergeCustomTypes(callbacks.customLoginTypes, importedLoginTypes);

          const { types: mergedApiProviders, added: apiAdded, updated: apiUpdated } =
            mergeCustomTypes(callbacks.customApiProviders, importedApiProviders);

          totalAdded += loginAdded + apiAdded;
          totalUpdated += loginUpdated + apiUpdated;

          // Update custom types via callback
          callbacks.onImportCustomTypes(mergedLoginTypes, mergedApiProviders);
        }

        setAccounts(mergedAccounts);
        persist(mergedAccounts);

        return { success: true, added: totalAdded, updated: totalUpdated };
      } catch {
        return { success: false, added: 0, updated: 0, error: "Failed to read file" };
      }
    },
    [accounts, persist]
  );

  return { accounts, addAccount, updateAccount, deleteAccount, exportAccounts, importAccounts };
}
