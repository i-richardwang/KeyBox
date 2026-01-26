// Type definition for login types and API providers
export interface TypeDefinition {
  id: string;
  label: string;
  color: string;
  createdAt: number;
}

// Base fields shared by all accounts
interface BaseAccount {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// Login account (Gmail, Outlook, etc.)
export interface EmailAccount extends BaseAccount {
  type: string;
  email: string;
  password: string;
  totpSecret?: string;
}

// API Key account
export interface ApiKeyAccount extends BaseAccount {
  type: "api-key";
  provider: string;
  apiKey: string;
}

// Union type for all account types
export type Account = EmailAccount | ApiKeyAccount;

// Input types for creating new accounts
export type NewEmailAccount = Omit<EmailAccount, "id" | "createdAt" | "updatedAt">;
export type NewApiKeyAccount = Omit<ApiKeyAccount, "id" | "createdAt" | "updatedAt">;
export type NewAccount = NewEmailAccount | NewApiKeyAccount;

// Type guards
export function isEmailAccount(account: Account): account is EmailAccount {
  return account.type !== "api-key";
}

export function isApiKeyAccount(account: Account): account is ApiKeyAccount {
  return account.type === "api-key";
}

// Default login types (used for initial store setup)
export const DEFAULT_LOGIN_TYPES: TypeDefinition[] = [
  { id: "gmail", label: "Gmail", color: "red", createdAt: 0 },
  { id: "outlook", label: "Outlook", color: "blue", createdAt: 0 },
];

// Default API providers (used for initial store setup)
export const DEFAULT_API_PROVIDERS: TypeDefinition[] = [
  { id: "ollama", label: "Ollama", color: "slate", createdAt: 0 },
  { id: "openai", label: "OpenAI", color: "emerald", createdAt: 0 },
  { id: "anthropic", label: "Anthropic", color: "orange", createdAt: 0 },
  { id: "cerebras", label: "Cerebras", color: "purple", createdAt: 0 },
  { id: "tavily", label: "Tavily", color: "cyan", createdAt: 0 },
];
