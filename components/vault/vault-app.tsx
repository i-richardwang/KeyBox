"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useVaultStore } from "@/lib/store";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

export function VaultApp() {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    exportData,
    importData,
  } = useVaultStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const loginAccounts = useMemo(
    () => accounts.filter(isEmailAccount) as EmailAccount[],
    [accounts]
  );

  const apiKeyAccounts = useMemo(
    () => accounts.filter(isApiKeyAccount) as ApiKeyAccount[],
    [accounts]
  );

  const defaultTab: FilterTab = loginAccounts.length > 0 ? "logins" : "api-keys";
  const [activeTab, setActiveTab] = useState<FilterTab>(defaultTab);

  const handleAdd = (data: AccountFormData) => {
    if (data.category === "api-key") {
      addAccount({
        type: "api-key",
        provider: data.provider!,
        apiKey: data.apiKey!,
      });
    } else {
      addAccount({
        type: data.loginType!,
        email: data.email!,
        password: data.password!,
        totpSecret: data.totpSecret,
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
              <TabsList>
                <TabsTrigger value="logins">Logins</TabsTrigger>
                <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              </TabsList>

              <TabsContent value="logins" className="mt-4">
                {loginAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No login accounts
                  </div>
                ) : (
                  <LoginTable
                    accounts={loginAccounts}
                    onUpdate={updateAccount}
                    onDelete={deleteAccount}
                  />
                )}
              </TabsContent>

              <TabsContent value="api-keys" className="mt-4">
                {apiKeyAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No API keys
                  </div>
                ) : (
                  <ApiKeyTable
                    accounts={apiKeyAccounts}
                    onUpdate={updateAccount}
                    onDelete={deleteAccount}
                  />
                )}
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
