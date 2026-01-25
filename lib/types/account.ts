// Preset login types
export const PRESET_LOGIN_TYPES = ["gmail", "outlook"] as const;
export type PresetLoginType = (typeof PRESET_LOGIN_TYPES)[number];

// Preset API providers
export const PRESET_API_PROVIDERS = ["ollama", "openai", "anthropic", "cerebras", "tavily"] as const;
export type PresetApiProvider = (typeof PRESET_API_PROVIDERS)[number];

// Runtime types are strings to support custom values
export type LoginType = string;
export type ApiProvider = string;

// Display labels for presets
export const LOGIN_TYPE_LABELS: Record<PresetLoginType, string> = {
  gmail: "Gmail",
  outlook: "Outlook",
};

export const API_PROVIDER_LABELS: Record<PresetApiProvider, string> = {
  ollama: "Ollama",
  openai: "OpenAI",
  anthropic: "Anthropic",
  cerebras: "Cerebras",
  tavily: "Tavily",
};

// Default colors for presets
export const LOGIN_TYPE_COLORS: Record<PresetLoginType, string> = {
  gmail: "red",
  outlook: "blue",
};

export const API_PROVIDER_COLORS: Record<PresetApiProvider, string> = {
  ollama: "slate",
  openai: "emerald",
  anthropic: "orange",
  cerebras: "purple",
  tavily: "cyan",
};

// Custom type definition
export interface CustomType {
  id: string;
  label: string;
  color: string;
  createdAt: number;
}

// Alias types for semantic clarity
export type CustomLoginType = CustomType;
export type CustomApiProvider = CustomType;

// Account type for top-level distinction
export type AccountType = LoginType | "api-key";

// Base fields shared by all accounts
interface BaseAccount {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// Email account (Gmail, Outlook, or custom)
export interface EmailAccount extends BaseAccount {
  type: LoginType;
  email: string;
  password: string;
  totpSecret?: string;
}

// API Key account
export interface ApiKeyAccount extends BaseAccount {
  type: "api-key";
  provider: ApiProvider;
  apiKey: string;
}

// Union type for all account types
export type Account = EmailAccount | ApiKeyAccount;

// Input types for creating new accounts (without auto-generated fields)
export type NewEmailAccount = Omit<EmailAccount, "id" | "createdAt" | "updatedAt">;
export type NewApiKeyAccount = Omit<ApiKeyAccount, "id" | "createdAt" | "updatedAt">;
export type NewAccount = NewEmailAccount | NewApiKeyAccount;

// Type guards
export function isPresetLoginType(type: string): type is PresetLoginType {
  return PRESET_LOGIN_TYPES.includes(type as PresetLoginType);
}

export function isPresetApiProvider(provider: string): provider is PresetApiProvider {
  return PRESET_API_PROVIDERS.includes(provider as PresetApiProvider);
}

export function isEmailAccount(account: Account): account is EmailAccount {
  return account.type !== "api-key";
}

export function isApiKeyAccount(account: Account): account is ApiKeyAccount {
  return account.type === "api-key";
}

// Storage schema - version 2 with custom types
export interface VaultStorage {
  version: 1 | 2;
  accounts: Account[];
  customLoginTypes?: CustomLoginType[];
  customApiProviders?: CustomApiProvider[];
}

export const STORAGE_KEY = "vault-key-data";

// Color palette for custom types
export const COLOR_PALETTE = [
  "red", "orange", "amber", "yellow",
  "lime", "green", "emerald", "teal",
  "cyan", "sky", "blue", "indigo",
  "violet", "purple", "fuchsia", "pink",
  "rose", "slate",
] as const;

export type ColorName = (typeof COLOR_PALETTE)[number];
