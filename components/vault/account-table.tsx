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
import type { Account } from "@/lib/types/account";
import { isEmailAccount } from "@/lib/types/account";
import { AccountTypeBadge } from "./account-type-badge";
import { PasswordCell } from "./password-cell";
import { TotpDisplay } from "./totp-display";
import { CopyButton } from "./copy-button";
import { AccountDialog } from "./account-dialog";
import { DeleteDialog } from "./delete-dialog";
import type { AccountFormData } from "./account-form";

interface AccountTableProps {
  accounts: Account[];
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

/**
 * Table displaying all accounts with actions
 */
export function AccountTable({ accounts, onUpdate, onDelete }: AccountTableProps) {
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const handleEditSubmit = (data: AccountFormData) => {
    if (!editingAccount) return;

    if (data.type === "api-key") {
      onUpdate(editingAccount.id, {
        provider: data.provider,
        apiKey: data.apiKey,
        apiSecret: data.apiSecret,
      });
    } else {
      onUpdate(editingAccount.id, {
        email: data.email,
        password: data.password,
        totpSecret: data.totpSecret,
      });
    }
    setEditingAccount(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAccount) {
      onDelete(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  const getAccountName = (account: Account): string => {
    return isEmailAccount(account) ? account.email : account.provider;
  };

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Type</TableHead>
              <TableHead>Email / Provider</TableHead>
              <TableHead>Password / Key</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <AccountTypeBadge type={account.type} />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {isEmailAccount(account) ? account.email : account.provider}
                    </span>
                    <CopyButton
                      value={isEmailAccount(account) ? account.email : account.provider}
                      label={isEmailAccount(account) ? "Email" : "Provider"}
                    />
                  </div>
                </TableCell>

                <TableCell>
                  <PasswordCell
                    value={isEmailAccount(account) ? account.password : account.apiKey}
                    label={isEmailAccount(account) ? "Password" : "API Key"}
                  />
                  {!isEmailAccount(account) && account.apiSecret && (
                    <div className="mt-1">
                      <PasswordCell value={account.apiSecret} label="API Secret" />
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {isEmailAccount(account) && account.totpSecret ? (
                    <TotpDisplay secret={account.totpSecret} />
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
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
