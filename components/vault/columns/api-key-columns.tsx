"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ApiKeyAccount } from "@/lib/types/account";
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
import { SecretCell } from "../secret-cell";
import { CopyButton } from "../copy-button";

interface ApiKeyColumnsOptions {
  onEdit: (account: ApiKeyAccount) => void;
  onDelete: (account: ApiKeyAccount) => void;
}

export function getApiKeyColumns({
  onEdit,
  onDelete,
}: ApiKeyColumnsOptions): ColumnDef<ApiKeyAccount>[] {
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
      accessorKey: "provider",
      header: "Provider",
      cell: ({ row }) => <TypeBadge type={row.getValue("provider")} />,
      size: 100,
    },
    {
      accessorKey: "apiKey",
      header: "API Key",
      cell: ({ row }) => (
        <SecretCell value={row.getValue("apiKey")} label="API Key" />
      ),
    },
    {
      accessorKey: "account",
      header: "Account",
      cell: ({ row }) => {
        const account = row.getValue("account") as string | undefined;
        return account ? (
          <div className="flex items-center gap-1 min-w-0 max-w-[120px]">
            <span className="truncate" title={account}>{account}</span>
            <CopyButton value={account} label="Account" />
          </div>
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
