import type { Account, TypeDefinition } from "@/lib/types/account";

export interface ExportData {
  version: 1;
  source: "keybox";
  exportedAt: number;
  accounts: Account[];
  loginTypes?: TypeDefinition[];
  apiProviders?: TypeDefinition[];
}

export interface ImportResult {
  success: boolean;
  added: number;
  updated: number;
  error?: string;
}

function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== "object") return false;

  const obj = data as Record<string, unknown>;

  if (obj.version !== 1) return false;
  if (!Array.isArray(obj.accounts)) return false;

  for (const account of obj.accounts) {
    if (!account || typeof account !== "object") return false;
    if (!("type" in account)) return false;

    const acc = account as Record<string, unknown>;

    if (acc.type !== "api-key") {
      if (!("email" in acc) || !("password" in acc)) return false;
      if (typeof acc.type !== "string") return false;
    } else {
      if (!("provider" in acc) || !("apiKey" in acc)) return false;
      if (typeof acc.provider !== "string") return false;
    }
  }

  if (obj.loginTypes !== undefined && !Array.isArray(obj.loginTypes)) return false;
  if (obj.apiProviders !== undefined && !Array.isArray(obj.apiProviders)) return false;

  return true;
}

export function parseImportFile(content: string): ExportData | null {
  try {
    const data = JSON.parse(content);
    if (validateImportData(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
