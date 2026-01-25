import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Account,
  NewAccount,
  CustomLoginType,
  CustomApiProvider,
} from "@/lib/types/account";
import {
  parseImportFile,
  mergeAccounts,
  mergeCustomTypes,
  readFileAsText,
  type ImportResult,
  type ExportData,
} from "@/lib/import-export";

interface VaultState {
  accounts: Account[];
  customLoginTypes: CustomLoginType[];
  customApiProviders: CustomApiProvider[];
}

interface VaultActions {
  // Account actions
  addAccount: (data: NewAccount) => void;
  updateAccount: (id: string, data: Partial<Omit<Account, "id" | "type" | "createdAt">>) => void;
  deleteAccount: (id: string) => void;

  // Custom login type actions
  addLoginType: (label: string, color: string) => CustomLoginType;
  updateLoginType: (id: string, data: Partial<Pick<CustomLoginType, "label" | "color">>) => void;
  deleteLoginType: (id: string) => void;

  // Custom API provider actions
  addApiProvider: (label: string, color: string) => CustomApiProvider;
  updateApiProvider: (id: string, data: Partial<Pick<CustomApiProvider, "label" | "color">>) => void;
  deleteApiProvider: (id: string) => void;

  // Import/Export
  exportData: () => void;
  importData: (file: File) => Promise<ImportResult>;
}

type VaultStore = VaultState & VaultActions;

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      // Initial state
      accounts: [],
      customLoginTypes: [],
      customApiProviders: [],

      // Account actions
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

      // Custom login type actions
      addLoginType: (label, color) => {
        const newType: CustomLoginType = {
          id: `custom-login-${crypto.randomUUID()}`,
          label,
          color,
          createdAt: Date.now(),
        };

        set((state) => ({
          customLoginTypes: [...state.customLoginTypes, newType],
        }));

        return newType;
      },

      updateLoginType: (id, data) => {
        set((state) => ({
          customLoginTypes: state.customLoginTypes.map((t) =>
            t.id === id ? { ...t, ...data } : t
          ),
        }));
      },

      deleteLoginType: (id) => {
        set((state) => ({
          customLoginTypes: state.customLoginTypes.filter((t) => t.id !== id),
        }));
      },

      // Custom API provider actions
      addApiProvider: (label, color) => {
        const newProvider: CustomApiProvider = {
          id: `custom-api-${crypto.randomUUID()}`,
          label,
          color,
          createdAt: Date.now(),
        };

        set((state) => ({
          customApiProviders: [...state.customApiProviders, newProvider],
        }));

        return newProvider;
      },

      updateApiProvider: (id, data) => {
        set((state) => ({
          customApiProviders: state.customApiProviders.map((p) =>
            p.id === id ? { ...p, ...data } : p
          ),
        }));
      },

      deleteApiProvider: (id) => {
        set((state) => ({
          customApiProviders: state.customApiProviders.filter((p) => p.id !== id),
        }));
      },

      // Export
      exportData: () => {
        const { accounts, customLoginTypes, customApiProviders } = get();

        const data: ExportData = {
          version: 1,
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
      },

      // Import
      importData: async (file) => {
        try {
          const content = await readFileAsText(file);
          const data = parseImportFile(content);

          if (!data) {
            return { success: false, added: 0, updated: 0, error: "Invalid file format" };
          }

          const { accounts, customLoginTypes, customApiProviders } = get();

          // Merge accounts
          const {
            accounts: mergedAccounts,
            added: accountsAdded,
            updated: accountsUpdated,
          } = mergeAccounts(accounts, data.accounts);

          // Merge custom types
          let totalAdded = accountsAdded;
          let totalUpdated = accountsUpdated;

          const exportData = data as ExportData;
          const importedLoginTypes = exportData.customLoginTypes || [];
          const importedApiProviders = exportData.customApiProviders || [];

          const {
            types: mergedLoginTypes,
            added: loginAdded,
            updated: loginUpdated,
          } = mergeCustomTypes(customLoginTypes, importedLoginTypes);

          const {
            types: mergedApiProviders,
            added: apiAdded,
            updated: apiUpdated,
          } = mergeCustomTypes(customApiProviders, importedApiProviders);

          totalAdded += loginAdded + apiAdded;
          totalUpdated += loginUpdated + apiUpdated;

          // Update state
          set({
            accounts: mergedAccounts,
            customLoginTypes: mergedLoginTypes,
            customApiProviders: mergedApiProviders,
          });

          return { success: true, added: totalAdded, updated: totalUpdated };
        } catch {
          return { success: false, added: 0, updated: 0, error: "Failed to read file" };
        }
      },
    }),
    {
      name: "vault-key-data",
      version: 1,
    }
  )
);
