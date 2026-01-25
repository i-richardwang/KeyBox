"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface VaultHeaderProps {
  onAddClick: () => void;
}

/**
 * Header component with title and add button
 */
export function VaultHeader({ onAddClick }: VaultHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vault Key</h1>
        <p className="text-muted-foreground text-sm">
          Manage your accounts and API keys
        </p>
      </div>
      <Button onClick={onAddClick}>
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
        Add Account
      </Button>
    </div>
  );
}
