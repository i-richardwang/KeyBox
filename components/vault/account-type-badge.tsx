"use client";

import { Badge } from "@/components/ui/badge";
import type { AccountType } from "@/lib/types/account";

interface AccountTypeBadgeProps {
  type: AccountType;
}

const typeConfig: Record<AccountType, { label: string; variant: "default" | "secondary" | "outline" }> = {
  gmail: { label: "Gmail", variant: "default" },
  outlook: { label: "Outlook", variant: "secondary" },
  "api-key": { label: "API Key", variant: "outline" },
};

/**
 * Displays a badge indicating the account type
 */
export function AccountTypeBadge({ type }: AccountTypeBadgeProps) {
  const config = typeConfig[type];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
