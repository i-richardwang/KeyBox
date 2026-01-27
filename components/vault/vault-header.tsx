"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, MoreVerticalIcon, FileExportIcon, FileImportIcon, SquareLock01Icon } from "@hugeicons/core-free-icons";
import { SettingsSheet } from "./settings-sheet";
import type { ImportResult } from "@/lib/import-export";

interface VaultHeaderProps {
  onAddClick: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<ImportResult>;
  onImportComplete: (result: ImportResult) => void;
}

export function VaultHeader({
  onAddClick,
  onExport,
  onImport,
  onImportComplete,
}: VaultHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authEnabled, setAuthEnabled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((data) => setAuthEnabled(data.requiresAuth))
      .catch(() => setAuthEnabled(false));
  }, []);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleLock = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await onImport(file);
      onImportComplete(result);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">KeyBox</h1>

      <div className="flex items-center gap-2">
        <SettingsSheet />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <HugeiconsIcon icon={MoreVerticalIcon} strokeWidth={2} />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport}>
              <HugeiconsIcon icon={FileExportIcon} strokeWidth={2} />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleImportClick}>
              <HugeiconsIcon icon={FileImportIcon} strokeWidth={2} />
              Import
            </DropdownMenuItem>
            {authEnabled && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLock}>
                  <HugeiconsIcon icon={SquareLock01Icon} strokeWidth={2} />
                  Lock
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button onClick={onAddClick}>
          <HugeiconsIcon icon={Add01Icon} strokeWidth={2} />
          Add Account
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
