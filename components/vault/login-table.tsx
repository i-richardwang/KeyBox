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
import type { EmailAccount } from "@/lib/types/account";
import { TypeBadge } from "./type-badge";
import { PasswordCell } from "./password-cell";
import { TotpDisplay } from "./totp-display";
import { CopyButton } from "./copy-button";
import { AccountDialog } from "./account-dialog";
import { DeleteDialog } from "./delete-dialog";
import type { AccountFormData } from "./account-form";

interface LoginTableProps {
  accounts: EmailAccount[];
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

export function LoginTable({ accounts, onUpdate, onDelete }: LoginTableProps) {
  const [editingAccount, setEditingAccount] = useState<EmailAccount | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<EmailAccount | null>(null);

  const handleEditSubmit = (data: AccountFormData) => {
    if (!editingAccount) return;
    onUpdate(editingAccount.id, {
      email: data.email,
      password: data.password,
      totpSecret: data.totpSecret,
    });
    setEditingAccount(null);
  };

  const handleDeleteConfirm = () => {
    if (deletingAccount) {
      onDelete(deletingAccount.id);
      setDeletingAccount(null);
    }
  };

  return (
    <>
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Type</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>2FA</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  <TypeBadge type={account.type} />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{account.email}</span>
                    <CopyButton value={account.email} label="Email" />
                  </div>
                </TableCell>

                <TableCell>
                  <PasswordCell value={account.password} label="Password" />
                </TableCell>

                <TableCell>
                  {account.totpSecret ? (
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
        accountName={deletingAccount?.email || ""}
      />
    </>
  );
}
