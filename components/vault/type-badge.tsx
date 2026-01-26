"use client";

import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/lib/store";
import type { ColorName } from "@/lib/colors";

interface TypeInfo {
  label: string;
  color: ColorName;
}

function useTypeInfo(type: string): TypeInfo {
  const { loginTypes, apiProviders } = useVaultStore();

  // Check login types
  const loginType = loginTypes.find((t) => t.id === type);
  if (loginType) {
    return {
      label: loginType.label,
      color: loginType.color as ColorName,
    };
  }

  // Check API providers
  const apiProvider = apiProviders.find((p) => p.id === type);
  if (apiProvider) {
    return {
      label: apiProvider.label,
      color: apiProvider.color as ColorName,
    };
  }

  // Fallback for unknown types
  return { label: type, color: "slate" };
}

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { label, color } = useTypeInfo(type);
  return <Badge color={color}>{label}</Badge>;
}

export { useTypeInfo };
