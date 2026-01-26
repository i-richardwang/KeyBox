import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Account, NewAccount, TypeDefinition } from "@/lib/types/account";
import { DEFAULT_LOGIN_TYPES, DEFAULT_API_PROVIDERS } from "@/lib/types/account";
import {
  parseImportFile,
  mergeAccounts,
  mergeTypes,
  readFileAsText,
  type ImportResult,
  type ExportData,
} from "@/lib/import-export";

interface VaultState {
  accounts: Account[];
  loginTypes: TypeDefinition[];
  apiProviders: TypeDefinition[];
}

interface VaultActions {
  addAccount: (data: NewAccount) => void;
  updateAccount: (id: string, data: Partial<Omit<Account, "id" | "type" | "createdAt">>) => void;
  deleteAccount: (id: string) => void;
  deleteAccounts: (ids: string[]) => void;

  addLoginType: (label: string, color: string) => TypeDefinition;
  updateLoginType: (id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>) => void;
  deleteLoginType: (id: string) => void;

  addApiProvider: (label: string, color: string) => TypeDefinition;
  updateApiProvider: (id: string, data: Partial<Pick<TypeDefinition, "label" | "color">>) => void;
  deleteApiProvider: (id: string) => void;

  exportData: () => void;
  importData: (file: File) => Promise<ImportResult>;
}

type VaultStore = VaultState & VaultActions;

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      accounts: [],
      loginTypes: [...DEFAULT_LOGIN_TYPES],
      apiProviders: [...DEFAULT_API_PROVIDERS],

      addAccount: (data) => {
        const now = Date.now();
        const account = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        } as Account;

        set((state) => ({
          accounts: [...state.accounts, account],
        }));
      },

      updateAccount: (id, data) => {
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id
              ? { ...account, ...data, updatedAt: Date.now() }
              : account
          ) as Account[],
        }));
      },

      deleteAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
        }));
      },

      deleteAccounts: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          accounts: state.accounts.filter((account) => !idSet.has(account.id)),
        }));
      },

      addLoginType: (label, color) => {
        const newType: TypeDefinition = {
          id: `login-${crypto.randomUUID()}`,
          label,
          color,
          createdAt: Date.now(),
        };

        set((state) => ({
          loginTypes: [...state.loginTypes, newType],
        }));

        return newType;
      },

      updateLoginType: (id, data) => {
        set((state) => ({
          loginTypes: state.loginTypes.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteLoginType: (id) => {
        set((state) => ({
          loginTypes: state.loginTypes.filter((t) => t.id !== id),
        }));
      },

      addApiProvider: (label, color) => {
        const newProvider: TypeDefinition = {
          id: `api-${crypto.randomUUID()}`,
          label,
          color,
          createdAt: Date.now(),
        };

        set((state) => ({
          apiProviders: [...state.apiProviders, newProvider],
        }));

        return newProvider;
      },

      updateApiProvider: (id, data) => {
        set((state) => ({
          apiProviders: state.apiProviders.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deleteApiProvider: (id) => {
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
          const data = parseImportFile(content);

          if (!data) {
            return { success: false, added: 0, updated: 0, error: "Invalid file format" };
          }

          const { accounts, loginTypes, apiProviders } = get();

          const {
            accounts: mergedAccounts,
            added: accountsAdded,
            updated: accountsUpdated,
          } = mergeAccounts(accounts, data.accounts);

          let totalAdded = accountsAdded;
          let totalUpdated = accountsUpdated;

          const importedLoginTypes = data.loginTypes ?? [];
          const importedApiProviders = data.apiProviders ?? [];

          const {
            types: mergedLoginTypes,
            added: loginAdded,
            updated: loginUpdated,
          } = mergeTypes(loginTypes, importedLoginTypes);

          const {
            types: mergedApiProviders,
            added: apiAdded,
            updated: apiUpdated,
          } = mergeTypes(apiProviders, importedApiProviders);

          totalAdded += loginAdded + apiAdded;
          totalUpdated += loginUpdated + apiUpdated;

          set({
            accounts: mergedAccounts,
            loginTypes: mergedLoginTypes,
            apiProviders: mergedApiProviders,
          });

          return { success: true, added: totalAdded, updated: totalUpdated };
        } catch {
          return { success: false, added: 0, updated: 0, error: "Failed to read file" };
        }
      },
    }),
    {
      name: "keybox-data",
    }
  )
);
