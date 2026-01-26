"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useVaultStore } from "@/lib/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VaultHeader } from "@/components/vault/vault-header";
import { LoginTable } from "@/components/vault/login-table";
import { ApiKeyTable } from "@/components/vault/api-key-table";
import { AccountDialog } from "@/components/vault/account-dialog";
import { EmptyState } from "@/components/vault/empty-state";
import type { AccountFormData } from "@/components/vault/account-form";
import type { EmailAccount, ApiKeyAccount } from "@/lib/types/account";
import { isApiKeyAccount, isEmailAccount } from "@/lib/types/account";
import type { ImportResult } from "@/lib/import-export";

type FilterTab = "logins" | "api-keys";
const ALL_FILTER = "all";

export function VaultApp() {
  const {
    accounts,
    loginTypes,
    apiProviders,
    addAccount,
    updateAccount,
    deleteAccount,
    deleteAccounts,
    exportData,
    importData,
  } = useVaultStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [loginTypeFilter, setLoginTypeFilter] = useState<string>(ALL_FILTER);
  const [apiProviderFilter, setApiProviderFilter] = useState<string>(ALL_FILTER);

  const allLoginAccounts = useMemo(
    () => accounts.filter(isEmailAccount) as EmailAccount[],
    [accounts]
  );

  const allApiKeyAccounts = useMemo(
    () => accounts.filter(isApiKeyAccount) as ApiKeyAccount[],
    [accounts]
  );

  // Filtered accounts based on selected filter
  const loginAccounts = useMemo(
    () =>
      loginTypeFilter === ALL_FILTER
        ? allLoginAccounts
        : allLoginAccounts.filter((a) => a.type === loginTypeFilter),
    [allLoginAccounts, loginTypeFilter]
  );

  const apiKeyAccounts = useMemo(
    () =>
      apiProviderFilter === ALL_FILTER
        ? allApiKeyAccounts
        : allApiKeyAccounts.filter((a) => a.provider === apiProviderFilter),
    [allApiKeyAccounts, apiProviderFilter]
  );

  // Get types that are actually in use for filter options
  const usedLoginTypes = useMemo(() => {
    const usedIds = new Set(allLoginAccounts.map((a) => a.type));
    return loginTypes.filter((t) => usedIds.has(t.id));
  }, [allLoginAccounts, loginTypes]);

  const usedApiProviders = useMemo(() => {
    const usedIds = new Set(allApiKeyAccounts.map((a) => a.provider));
    return apiProviders.filter((p) => usedIds.has(p.id));
  }, [allApiKeyAccounts, apiProviders]);

  // Reset filter when the selected type/provider no longer exists
  useEffect(() => {
    if (loginTypeFilter !== ALL_FILTER) {
      const stillExists = usedLoginTypes.some((t) => t.id === loginTypeFilter);
      if (!stillExists) {
        setLoginTypeFilter(ALL_FILTER);
      }
    }
  }, [usedLoginTypes, loginTypeFilter]);

  useEffect(() => {
    if (apiProviderFilter !== ALL_FILTER) {
      const stillExists = usedApiProviders.some((p) => p.id === apiProviderFilter);
      if (!stillExists) {
        setApiProviderFilter(ALL_FILTER);
      }
    }
  }, [usedApiProviders, apiProviderFilter]);

  const defaultTab: FilterTab = allLoginAccounts.length > 0 ? "logins" : "api-keys";
  const [activeTab, setActiveTab] = useState<FilterTab>(defaultTab);

  const handleAdd = (data: AccountFormData) => {
    if (data.category === "api-key") {
      addAccount({
        type: "api-key",
        provider: data.provider!,
        apiKey: data.apiKey!,
        account: data.apiAccount,
      });
    } else {
      addAccount({
        type: data.loginType!,
        email: data.email!,
        password: data.password!,
        totpSecret: data.totpSecret,
        recoveryEmail: data.recoveryEmail,
      });
    }
  };

  const handleImportComplete = (result: ImportResult) => {
    if (result.success) {
      if (result.added === 0 && result.updated === 0) {
        toast.info("No changes", { description: "All accounts already exist" });
      } else {
        const parts: string[] = [];
        if (result.added > 0) parts.push(`${result.added} added`);
        if (result.updated > 0) parts.push(`${result.updated} updated`);
        toast.success("Import successful", { description: parts.join(", ") });
      }
    } else {
      toast.error("Import failed", { description: result.error });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <VaultHeader
          onAddClick={() => setAddDialogOpen(true)}
          onExport={exportData}
          onImport={importData}
          onImportComplete={handleImportComplete}
        />

        <div className="mt-8">
          {accounts.length === 0 ? (
            <EmptyState onAddClick={() => setAddDialogOpen(true)} />
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="logins">Logins</TabsTrigger>
                  <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                </TabsList>

                {activeTab === "logins" && usedLoginTypes.length > 0 && (
                  <Select value={loginTypeFilter} onValueChange={setLoginTypeFilter}>
                    <SelectTrigger size="sm" className="w-auto">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value={ALL_FILTER}>All Types</SelectItem>
                      {usedLoginTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {activeTab === "api-keys" && usedApiProviders.length > 0 && (
                  <Select value={apiProviderFilter} onValueChange={setApiProviderFilter}>
                    <SelectTrigger size="sm" className="w-auto">
                      <SelectValue placeholder="Filter by provider" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value={ALL_FILTER}>All Providers</SelectItem>
                      {usedApiProviders.map((provider) => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <TabsContent value="logins" className="mt-4">
                <LoginTable
                  key={loginTypeFilter}
                  accounts={loginAccounts}
                  onUpdate={updateAccount}
                  onDelete={deleteAccount}
                  onBulkDelete={deleteAccounts}
                  emptyMessage={
                    allLoginAccounts.length === 0
                      ? "No login accounts"
                      : "No matching accounts"
                  }
                />
              </TabsContent>

              <TabsContent value="api-keys" className="mt-4">
                <ApiKeyTable
                  key={apiProviderFilter}
                  accounts={apiKeyAccounts}
                  onUpdate={updateAccount}
                  onDelete={deleteAccount}
                  onBulkDelete={deleteAccounts}
                  emptyMessage={
                    allApiKeyAccounts.length === 0
                      ? "No API keys"
                      : "No matching API keys"
                  }
                />
              </TabsContent>
            </Tabs>
          )}
        </div>

        <AccountDialog
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={handleAdd}
        />
      </div>
    </div>
  );
}
