"use client";

import { Badge } from "@/components/ui/badge";
import type { LoginType, ApiProvider } from "@/lib/types/account";
import { LOGIN_TYPE_LABELS, API_PROVIDER_LABELS } from "@/lib/types/account";

type BadgeType = LoginType | ApiProvider;

interface TypeBadgeProps {
  type: BadgeType;
}

// Badge variants by type
const badgeVariants: Record<BadgeType, "default" | "secondary" | "outline"> = {
  gmail: "default",
  outlook: "secondary",
  ollama: "outline",
  openai: "outline",
  anthropic: "outline",
  cerebras: "outline",
  tavily: "outline",
};

/**
 * Displays a badge indicating the login type or API provider
 */
export function TypeBadge({ type }: TypeBadgeProps) {
  const label = type in API_PROVIDER_LABELS
    ? API_PROVIDER_LABELS[type as ApiProvider]
    : LOGIN_TYPE_LABELS[type as LoginType];

  return <Badge variant={badgeVariants[type]}>{label}</Badge>;
}
