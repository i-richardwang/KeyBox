"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAccounts } from "@/hooks/use-accounts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VaultHeader } from "@/components/vault/vault-header";
import { AccountTable } from "@/components/vault/account-table";
import { AccountDialog } from "@/components/vault/account-dialog";
import { EmptyState } from "@/components/vault/empty-state";
import type { AccountFormData } from "@/components/vault/account-form";
import { isEmailAccount, isApiKeyAccount } from "@/lib/types/account";
import type { ImportResult } from "@/lib/import-export";

type FilterTab = "all" | "email" | "api-key";

export function VaultApp() {
  const { accounts, addAccount, updateAccount, deleteAccount, exportAccounts, importAccounts } = useAccounts();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filteredAccounts = useMemo(() => {
    if (activeTab === "email") return accounts.filter(isEmailAccount);
    if (activeTab === "api-key") return accounts.filter(isApiKeyAccount);
    return accounts;
  }, [accounts, activeTab]);

  const handleAdd = (data: AccountFormData) => {
    if (data.type === "api-key") {
      addAccount({
        type: "api-key",
        provider: data.provider!,
        apiKey: data.apiKey!,
        apiSecret: data.apiSecret,
      });
    } else {
      addAccount({
        type: data.type as "gmail" | "outlook",
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
          onExport={exportAccounts}
          onImport={importAccounts}
          onImportComplete={handleImportComplete}
        />

        <div className="mt-8">
          {accounts.length === 0 ? (
            <EmptyState onAddClick={() => setAddDialogOpen(true)} />
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="api-key">API Keys</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-4">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {activeTab === "email" ? "email accounts" : activeTab === "api-key" ? "API keys" : "accounts"}
                  </div>
                ) : (
                  <AccountTable
                    accounts={filteredAccounts}
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
