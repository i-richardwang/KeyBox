import { create } from "zustand";
import type { Account, NewAccount, TypeDefinition, EmailAccount, ApiKeyAccount } from "@/lib/types/account";
import {
  readFileAsText,
  type ImportResult,
  type ExportData,
} from "@/lib/import-export";

interface VaultState {
  accounts: Account[];
  loginTypes: TypeDefinition[];
  apiProviders: TypeDefinition[];
  isLoading: boolean;
  isInitialized: boolean;
}

interface VaultActions {
  fetchData: () => Promise<void>;
  addAccount: (data: NewAccount) => Promise<void>;
  updateEmailAccount: (id: string, data: Partial<Pick<EmailAccount, "type" | "email" | "password" | "totpSecret" | "recoveryEmail">>) => Promise<void>;
  updateApiKeyAccount: (id: string, data: Partial<Pick<ApiKeyAccount, "provider" | "apiKey" | "account">>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  deleteAccounts: (ids: string[]) => Promise<void>;
  updateAccounts: (ids: string[], data: { type?: string; provider?: string }) => Promise<void>;

  addLoginType: (label: string, color: string) => Promise<TypeDefinition>;
  updateLoginType: (id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>) => Promise<void>;
  deleteLoginType: (id: string) => Promise<void>;

  addApiProvider: (label: string, color: string) => Promise<TypeDefinition>;
  updateApiProvider: (id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>) => Promise<void>;
  deleteApiProvider: (id: string) => Promise<void>;

  exportData: () => void;
  importData: (file: File) => Promise<ImportResult>;
}

type VaultStore = VaultState & VaultActions;

export const useVaultStore = create<VaultStore>()((set, get) => ({
  accounts: [],
  loginTypes: [],
  apiProviders: [],
  isLoading: false,
  isInitialized: false,

  fetchData: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      set({
        accounts: data.accounts,
        loginTypes: data.loginTypes,
        apiProviders: data.apiProviders,
        isInitialized: true,
      });
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAccount: async (data) => {
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create account");
    const account = await res.json();

    set((state) => ({
      accounts: [...state.accounts, account],
    }));
  },

  updateEmailAccount: async (id, data) => {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update account");

    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === id && account.type !== "api-key"
          ? { ...account, ...data, updatedAt: Date.now() }
          : account
      ) as Account[],
    }));
  },

  updateApiKeyAccount: async (id, data) => {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update account");

    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === id && account.type === "api-key"
          ? { ...account, ...data, updatedAt: Date.now() }
          : account
      ) as Account[],
    }));
  },

  deleteAccount: async (id) => {
    const res = await fetch(`/api/accounts/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete account");

    set((state) => ({
      accounts: state.accounts.filter((account) => account.id !== id),
    }));
  },

  deleteAccounts: async (ids) => {
    const res = await fetch("/api/accounts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) throw new Error("Failed to delete accounts");

    const idSet = new Set(ids);
    set((state) => ({
      accounts: state.accounts.filter((account) => !idSet.has(account.id)),
    }));
  },

  updateAccounts: async (ids, data) => {
    const res = await fetch("/api/accounts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, data }),
    });

    if (!res.ok) throw new Error("Failed to update accounts");

    const idSet = new Set(ids);
    const now = Date.now();
    set((state) => ({
      accounts: state.accounts.map((account) => {
        if (!idSet.has(account.id)) return account;
        return { ...account, ...data, updatedAt: now };
      }) as Account[],
    }));
  },

  addLoginType: async (label, color) => {
    const res = await fetch("/api/login-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, color }),
    });

    if (!res.ok) throw new Error("Failed to create login type");
    const newType = await res.json();

    set((state) => ({
      loginTypes: [...state.loginTypes, newType],
    }));

    return newType;
  },

  updateLoginType: async (id, data) => {
    const res = await fetch(`/api/login-types/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update login type");

    set((state) => ({
      loginTypes: state.loginTypes.map((t) =>
        t.id === id ? { ...t, ...data } : t
      ),
    }));
  },

  deleteLoginType: async (id) => {
    const res = await fetch(`/api/login-types/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete login type");

    set((state) => ({
      loginTypes: state.loginTypes.filter((t) => t.id !== id),
    }));
  },

  addApiProvider: async (label, color) => {
    const res = await fetch("/api/api-providers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, color }),
    });

    if (!res.ok) throw new Error("Failed to create API provider");
    const newProvider = await res.json();

    set((state) => ({
      apiProviders: [...state.apiProviders, newProvider],
    }));

    return newProvider;
  },

  updateApiProvider: async (id, data) => {
    const res = await fetch(`/api/api-providers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update API provider");

    set((state) => ({
      apiProviders: state.apiProviders.map((p) =>
        p.id === id ? { ...p, ...data } : p
      ),
    }));
  },

  deleteApiProvider: async (id) => {
    const res = await fetch(`/api/api-providers/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete API provider");

    set((state) => ({
      apiProviders: state.apiProviders.filter((p) => p.id !== id),
    }));
  },

  exportData: () => {
    const { accounts, loginTypes, apiProviders } = get();

    const data: ExportData = {
      version: 1,
      source: "keybox",
      exportedAt: Date.now(),
      accounts,
      loginTypes,
      apiProviders,
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split("T")[0];
    const filename = `keybox-${date}.json`;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  },

  importData: async (file) => {
    try {
      const content = await readFileAsText(file);

      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const result = await res.json();

      if (!result.success) {
        return { success: false, added: 0, updated: 0, error: result.error };
      }

      await get().fetchData();

      return { success: true, added: result.added, updated: result.updated };
    } catch {
      return { success: false, added: 0, updated: 0, error: "Failed to read file" };
    }
  },
}));
