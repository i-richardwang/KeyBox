"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Download04Icon,
  Upload04Icon,
  MoreHorizontalIcon,
} from "@hugeicons/core-free-icons";
import type { ImportResult } from "@/lib/import-export";

interface VaultHeaderProps {
  onAddClick: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<ImportResult>;
  onImportComplete: (result: ImportResult) => void;
}

/**
 * Header component with title, add button, and import/export menu
 */
export function VaultHeader({
  onAddClick,
  onExport,
  onImport,
  onImportComplete,
}: VaultHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await onImport(file);
      onImportComplete(result);
    }
    // Reset input to allow re-importing the same file
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vault Key</h1>
        <p className="text-muted-foreground text-sm">
          Manage your accounts and API keys
        </p>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <HugeiconsIcon icon={MoreHorizontalIcon} strokeWidth={2} />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleImportClick}>
              <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} />
              Import
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExport}>
              <HugeiconsIcon icon={Download04Icon} strokeWidth={2} />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAddClick}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
          Add Account
        </Button>
      </div>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
