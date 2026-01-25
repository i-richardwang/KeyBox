"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface EmptyStateProps {
  onAddClick: () => void;
}

/**
 * Empty state displayed when there are no accounts
 */
export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <svg
          className="size-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium mb-1">No accounts yet</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Add your first account to get started
      </p>
      <Button onClick={onAddClick}>
        <HugeiconsIcon icon={Add01Icon} strokeWidth={2} data-icon="inline-start" />
        Add Account
      </Button>
    </div>
  );
}
