"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { MoreVerticalIcon, PencilEdit01Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import type { ApiKeyAccount } from "@/lib/types/account";
import { API_PROVIDER_LABELS } from "@/lib/types/account";
import { TypeBadge } from "./type-badge";
import { SecretCell } from "./secret-cell";
import { AccountDialog } from "./account-dialog";
import { DeleteDialog } from "./delete-dialog";
import type { AccountFormData } from "./account-form";

interface ApiKeyTableProps {
  accounts: ApiKeyAccount[];
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

export function ApiKeyTable({ accounts, onUpdate, onDelete }: ApiKeyTableProps) {
  const [editingAccount, setEditingAccount] = useState<ApiKeyAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<ApiKeyAccount | null>(null);

  const handleEditSubmit = (data: AccountFormData) => {
    if (!editingAccount) return;
    onUpdate(editingAccount.id, {
      apiKey: data.apiKey,
    });
    setEditingAccount(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAccount) {
      onDelete(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  // Get display name for account (for delete dialog)
  const getAccountName = (account: ApiKeyAccount): string => {
    return API_PROVIDER_LABELS[account.provider as keyof typeof API_PROVIDER_LABELS] || account.provider;
  };

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Provider</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <TypeBadge type={account.provider} />
                </TableCell>

                <TableCell>
                  <SecretCell value={account.apiKey} label="API Key" />
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-xs">
                        <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingAccount(account)}>
                        <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingAccount(account)}
                        className="text-destructive focus:text-destructive"
                      >
                        <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
        accountName={deletingAccount ? getAccountName(deletingAccount) : ""}
      />
    </>
  );
}
