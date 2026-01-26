"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { EmailAccount } from "@/lib/types/account";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MoreVerticalIcon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { TypeBadge } from "../type-badge";
import { PasswordCell } from "../password-cell";
import { TotpDisplay } from "../totp-display";
import { CopyButton } from "../copy-button";

interface LoginColumnsOptions {
  onEdit: (account: EmailAccount) => void;
  onDelete: (account: EmailAccount) => void;
}

export function getLoginColumns({
  onEdit,
  onDelete,
}: LoginColumnsOptions): ColumnDef<EmailAccount>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <TypeBadge type={row.getValue("type")} />,
      size: 100,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-medium truncate">{row.getValue("email")}</span>
          <CopyButton value={row.getValue("email")} label="Email" />
        </div>
      ),
    },
    {
      accessorKey: "password",
      header: "Password",
      cell: ({ row }) => (
        <PasswordCell value={row.getValue("password")} label="Password" />
      ),
    },
    {
      accessorKey: "recoveryEmail",
      header: "Recovery",
      cell: ({ row }) => {
        const recovery = row.getValue("recoveryEmail") as string | undefined;
        return recovery ? (
          <div className="flex items-center gap-1 min-w-0 max-w-[120px]">
            <span className="truncate" title={recovery}>{recovery}</span>
            <CopyButton value={recovery} label="Recovery email" />
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      accessorKey: "totpSecret",
      header: "2FA",
      cell: ({ row }) => {
        const secret = row.getValue("totpSecret") as string | undefined;
        return secret ? (
          <TotpDisplay secret={secret} />
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-xs">
                <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(account)}>
                <HugeiconsIcon icon={PencilEdit01Icon} strokeWidth={2} />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(account)}
                className="text-destructive focus:text-destructive"
              >
                <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 50,
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
