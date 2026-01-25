"use client";

import { Badge } from "@/components/ui/badge";
import { useVaultStore } from "@/lib/store";
import type { PresetLoginType, PresetApiProvider, ColorName } from "@/lib/types/account";
import {
  LOGIN_TYPE_LABELS,
  API_PROVIDER_LABELS,
  LOGIN_TYPE_COLORS,
  API_PROVIDER_COLORS,
  isPresetLoginType,
  isPresetApiProvider,
} from "@/lib/types/account";

interface TypeInfo {
  label: string;
  color: ColorName;
}

function useTypeInfo(type: string): TypeInfo {
  const { customLoginTypes, customApiProviders } = useVaultStore();

  if (isPresetLoginType(type)) {
    return {
      label: LOGIN_TYPE_LABELS[type as PresetLoginType],
      color: LOGIN_TYPE_COLORS[type as PresetLoginType],
    };
  }

  if (isPresetApiProvider(type)) {
    return {
      label: API_PROVIDER_LABELS[type as PresetApiProvider],
      color: API_PROVIDER_COLORS[type as PresetApiProvider],
    };
  }

  const customLogin = customLoginTypes.find((ct) => ct.id === type);
  if (customLogin) {
    return {
      label: customLogin.label,
      color: customLogin.color as ColorName,
    };
  }

  const customApi = customApiProviders.find((cp) => cp.id === type);
  if (customApi) {
    return {
      label: customApi.label,
      color: customApi.color as ColorName,
    };
  }

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
