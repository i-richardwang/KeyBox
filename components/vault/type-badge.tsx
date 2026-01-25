"use client";

import { cn } from "@/lib/utils";
import { getBadgeClass } from "@/lib/colors";
import { useVaultStore } from "@/lib/store";
import type { PresetLoginType, PresetApiProvider } from "@/lib/types/account";
import {
  LOGIN_TYPE_LABELS,
  API_PROVIDER_LABELS,
  LOGIN_TYPE_COLORS,
  API_PROVIDER_COLORS,
  isPresetLoginType,
  isPresetApiProvider,
} from "@/lib/types/account";

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { customLoginTypes, customApiProviders } = useVaultStore();

  let label: string;
  let color: string;

  if (isPresetLoginType(type)) {
    label = LOGIN_TYPE_LABELS[type as PresetLoginType];
    color = LOGIN_TYPE_COLORS[type as PresetLoginType];
  } else if (isPresetApiProvider(type)) {
    label = API_PROVIDER_LABELS[type as PresetApiProvider];
    color = API_PROVIDER_COLORS[type as PresetApiProvider];
  } else {
    const customLogin = customLoginTypes.find((ct) => ct.id === type);
    if (customLogin) {
      label = customLogin.label;
      color = customLogin.color;
    } else {
      const customApi = customApiProviders.find((cp) => cp.id === type);
      if (customApi) {
        label = customApi.label;
        color = customApi.color;
      } else {
        label = type;
        color = "slate";
      }
    }
  }

  return (
    <span className={cn("px-2.5 py-0.5 rounded-md text-xs font-medium", getBadgeClass(color))}>
      {label}
    </span>
  );
}
