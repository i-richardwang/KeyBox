"use client";

import { useState, useEffect, useCallback } from "react";
import type { Account, NewAccount, VaultStorage } from "@/lib/types/account";
import { STORAGE_KEY } from "@/lib/types/account";

// Read accounts from localStorage
function loadAccounts(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data: VaultStorage = JSON.parse(stored);
      return data.accounts || [];
    }
  } catch (error) {
    console.error("Failed to load accounts:", error);
  }
  return [];
}

/**
 * Hook for managing accounts with localStorage persistence
 */
export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(loadAccounts);

  // Sync with localStorage on mount (for SSR hydration)
  useEffect(() => {
    setAccounts(loadAccounts());
  }, []);

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

  return { accounts, addAccount, updateAccount, deleteAccount };
}
