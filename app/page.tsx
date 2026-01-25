"use client";

import { useState, useMemo } from "react";
import { useAccounts } from "@/hooks/use-accounts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VaultHeader } from "@/components/vault/vault-header";
import { AccountTable } from "@/components/vault/account-table";
import { AccountDialog } from "@/components/vault/account-dialog";
import { EmptyState } from "@/components/vault/empty-state";
import type { AccountFormData } from "@/components/vault/account-form";
import { isEmailAccount, isApiKeyAccount } from "@/lib/types/account";

type FilterTab = "all" | "email" | "api-key";

export default function Page() {
  const { accounts, isLoading, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  // Filter accounts based on active tab
  const filteredAccounts = useMemo(() => {
    if (activeTab === "email") return accounts.filter(isEmailAccount);
    if (activeTab === "api-key") return accounts.filter(isApiKeyAccount);
    return accounts;
  }, [accounts, activeTab]);

  // Handle adding a new account
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

  // Count for tab labels
  const emailCount = accounts.filter(isEmailAccount).length;
  const apiKeyCount = accounts.filter(isApiKeyAccount).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <VaultHeader onAddClick={() => setAddDialogOpen(true)} />

        <div className="mt-8">
          {accounts.length === 0 ? (
            <EmptyState onAddClick={() => setAddDialogOpen(true)} />
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterTab)}>
              <TabsList>
                <TabsTrigger value="all">All ({accounts.length})</TabsTrigger>
                <TabsTrigger value="email">Email ({emailCount})</TabsTrigger>
                <TabsTrigger value="api-key">API Keys ({apiKeyCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <AccountTable
                  accounts={filteredAccounts}
                  onUpdate={updateAccount}
                  onDelete={deleteAccount}
                />
              </TabsContent>

              <TabsContent value="email" className="mt-4">
                {emailCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No email accounts
                  </div>
                ) : (
                  <AccountTable
                    accounts={filteredAccounts}
                    onUpdate={updateAccount}
                    onDelete={deleteAccount}
                  />
                )}
              </TabsContent>

              <TabsContent value="api-key" className="mt-4">
                {apiKeyCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No API keys
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
