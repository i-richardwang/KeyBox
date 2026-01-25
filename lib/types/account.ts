// Login type discriminator
export type LoginType = "gmail" | "outlook";

// API provider discriminator
export type ApiProvider = "ollama" | "openai" | "anthropic" | "cerebras" | "tavily";

// All API providers for iteration
export const API_PROVIDERS: ApiProvider[] = ["ollama", "openai", "anthropic", "cerebras", "tavily"];

// Display labels
export const LOGIN_TYPE_LABELS: Record<LoginType, string> = {
  gmail: "Gmail",
  outlook: "Outlook",
};

export const API_PROVIDER_LABELS: Record<ApiProvider, string> = {
  ollama: "Ollama",
  openai: "OpenAI",
  anthropic: "Anthropic",
  cerebras: "Cerebras",
  tavily: "Tavily",
};

// Account type for top-level distinction
export type AccountType = LoginType | "api-key";

// Base fields shared by all accounts
interface BaseAccount {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// Email account (Gmail or Outlook)
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
export function isEmailAccount(account: Account): account is EmailAccount {
  return account.type === "gmail" || account.type === "outlook";
}

export function isApiKeyAccount(account: Account): account is ApiKeyAccount {
  return account.type === "api-key";
}

// Storage schema
export interface VaultStorage {
  version: 1;
  accounts: Account[];
}

export const STORAGE_KEY = "vault-key-data";
