"use client";

import { useState, useCallback } from "react";
import type { Account, NewAccount, VaultStorage } from "@/lib/types/account";
import { STORAGE_KEY } from "@/lib/types/account";
import {
  exportAccounts as exportAccountsUtil,
  parseImportFile,
  mergeAccounts,
  readFileAsText,
  type ImportResult,
} from "@/lib/import-export";

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
    const data: VaultStorage = { version: 1, accounts: updated };
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

  // Export accounts to JSON file
  const exportAccounts = useCallback(() => {
    exportAccountsUtil(accounts);
  }, [accounts]);

  // Import accounts from file with smart merge
  const importAccounts = useCallback(
    async (file: File): Promise<ImportResult> => {
      try {
        const content = await readFileAsText(file);
        const data = parseImportFile(content);

        if (!data) {
          return { success: false, added: 0, updated: 0, error: "Invalid file format" };
        }

        const { accounts: merged, added, updated } = mergeAccounts(accounts, data.accounts);

        setAccounts(merged);
        persist(merged);

        return { success: true, added, updated };
      } catch {
        return { success: false, added: 0, updated: 0, error: "Failed to read file" };
      }
    },
    [accounts, persist]
  );

  return { accounts, addAccount, updateAccount, deleteAccount, exportAccounts, importAccounts };
}
