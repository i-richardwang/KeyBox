"use client";

import { useState, useMemo } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import type { ApiKeyAccount } from "@/lib/types/account";
import { DataTable } from "./data-table";
import { getApiKeyColumns } from "./columns/api-key-columns";
import { AccountDialog } from "./account-dialog";
import { DeleteDialog } from "./delete-dialog";
import { BulkDeleteDialog } from "./bulk-delete-dialog";
import { BulkEditDialog } from "./bulk-edit-dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon, Copy01Icon, Tick02Icon, PencilEdit01Icon } from "@hugeicons/core-free-icons";
import { useTypeInfo } from "./type-badge";
import type { AccountFormData } from "./account-form";
import { toast } from "sonner";

type ApiKeyAccountUpdateData = Partial<Pick<ApiKeyAccount, "provider" | "apiKey" | "account">>;

interface ApiKeyTableProps {
  accounts: ApiKeyAccount[];
  onUpdate: (id: string, data: ApiKeyAccountUpdateData) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onBulkDelete: (ids: string[]) => void | Promise<void>;
  onBulkUpdate: (ids: string[], data: { type?: string; provider?: string }) => void | Promise<void>;
  emptyMessage?: string;
}

export function ApiKeyTable({
  accounts,
  onUpdate,
  onDelete,
  onBulkDelete,
  onBulkUpdate,
  emptyMessage = "No API keys",
}: ApiKeyTableProps) {
  const [editingAccount, setEditingAccount] = useState<ApiKeyAccount | null>(
    null
  );
  const [deletingAccount, setDeletingAccount] = useState<ApiKeyAccount | null>(
    null
  );
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [bulkEditOpen, setBulkEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const deletingProviderInfo = useTypeInfo(deletingAccount?.provider ?? "");
  const selectedIds = Object.keys(rowSelection);
  const selectedCount = selectedIds.length;

  const handleBulkCopy = async () => {
    const selectedKeys = accounts
      .filter((account) => selectedIds.includes(account.id))
      .map((account) => account.apiKey);
    
    try {
      await navigator.clipboard.writeText(selectedKeys.join("\n"));
      setCopied(true);
      toast.success(`${selectedKeys.length} API key(s) copied`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const columns = useMemo(
    () =>
      getApiKeyColumns({
        onEdit: setEditingAccount,
        onDelete: setDeletingAccount,
      }),
    []
  );

  const handleEditSubmit = async (data: AccountFormData) => {
    if (!editingAccount) return;
    await onUpdate(editingAccount.id, {
      provider: data.provider,
      apiKey: data.apiKey,
      account: data.apiAccount,
    });
    setEditingAccount(null);
  };

  const handleDeleteConfirm = async () => {
    if (deletingAccount) {
      await onDelete(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  const handleBulkDeleteConfirm = async () => {
    await onBulkDelete(selectedIds);
    setRowSelection({});
  };

  const handleBulkEditConfirm = async (data: { type?: string; provider?: string }) => {
    await onBulkUpdate(selectedIds, data);
    setRowSelection({});
  };

  return (
    <>
      <DataTable
        columns={columns}
        data={accounts}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        emptyMessage={emptyMessage}
      />

      {selectedCount > 0 && (
        <div className="flex items-center justify-end gap-2 -mt-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkCopy}
          >
            <HugeiconsIcon icon={copied ? Tick02Icon : Copy01Icon} strokeWidth={2} />
            Copy Keys
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBulkEditOpen(true)}
          >
            <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
            Edit Selected
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setBulkDeleteOpen(true)}
          >
            <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
            Delete Selected
          </Button>
        </div>
      )}

      <AccountDialog
        open={!!editingAccount}
        onOpenChange={(open) => !open && setEditingAccount(null)}
        account={editingAccount || undefined}
        onSubmit={handleEditSubmit}
      />

      <DeleteDialog
        open={!!deletingAccount}
        onOpenChange={(open) => !open && setDeletingAccount(null)}
        onConfirm={handleDeleteConfirm}
        accountName={deletingAccount ? deletingProviderInfo.label : ""}
      />

      <BulkDeleteDialog
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleBulkDeleteConfirm}
        count={selectedCount}
        itemType="API key"
      />

      <BulkEditDialog
        open={bulkEditOpen}
        onOpenChange={setBulkEditOpen}
        onConfirm={handleBulkEditConfirm}
        count={selectedCount}
        mode="api-key"
      />
    </>
  );
}
