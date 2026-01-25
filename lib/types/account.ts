// Account type discriminator
export type AccountType = "gmail" | "outlook" | "api-key";

// Base fields shared by all accounts
interface BaseAccount {
  id: string;
  createdAt: number;
  updatedAt: number;
}

// Email account (Gmail or Outlook)
export interface EmailAccount extends BaseAccount {
  type: "gmail" | "outlook";
  email: string;
  password: string;
  totpSecret?: string;
}

// API Key account
export interface ApiKeyAccount extends BaseAccount {
  type: "api-key";
  provider: string;
  apiKey: string;
  apiSecret?: string;
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
