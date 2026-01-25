"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Account, LoginType, ApiProvider } from "@/lib/types/account";
import { API_PROVIDERS, API_PROVIDER_LABELS, isEmailAccount } from "@/lib/types/account";

// Top-level category
type AccountCategory = "login" | "api-key";

// Form data for creating/editing an account
export interface AccountFormData {
  category: AccountCategory;
  loginType?: LoginType;
  provider?: ApiProvider;
  email?: string;
  password?: string;
  totpSecret?: string;
  apiKey?: string;
}

interface AccountFormProps {
  initialData?: Account;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
}

/**
 * Form for creating or editing an account
 */
export function AccountForm({ initialData, onSubmit, onCancel }: AccountFormProps) {
  // Determine initial category based on existing data
  const getInitialCategory = (): AccountCategory => {
    if (!initialData) return "login";
    return initialData.type === "api-key" ? "api-key" : "login";
  };

  const [category, setCategory] = useState<AccountCategory>(getInitialCategory());
  const [loginType, setLoginType] = useState<LoginType>("gmail");
  const [provider, setProvider] = useState<ApiProvider>("openai");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      if (isEmailAccount(initialData)) {
        setCategory("login");
        setLoginType(initialData.type);
        setEmail(initialData.email);
        setPassword(initialData.password);
        setTotpSecret(initialData.totpSecret || "");
      } else {
        setCategory("api-key");
        setProvider(initialData.provider);
        setApiKey(initialData.apiKey);
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === "api-key") {
      onSubmit({ category, provider, apiKey });
    } else {
      onSubmit({ category, loginType, email, password, totpSecret: totpSecret || undefined });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Category Selection */}
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as AccountCategory)}
          disabled={!!initialData}
        >
          <SelectTrigger id="category" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="api-key">API Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {category === "login" ? (
        <>
          {/* Login Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="loginType">Type</Label>
            <Select
              value={loginType}
              onValueChange={(value) => setLoginType(value as LoginType)}
              disabled={!!initialData}
            >
              <SelectTrigger id="loginType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmail">Gmail</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totpSecret">
              2FA Secret <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="totpSecret"
              type="text"
              value={totpSecret}
              onChange={(e) => setTotpSecret(e.target.value)}
              placeholder="Base32 encoded secret"
            />
          </div>
        </>
      ) : (
        <>
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={provider}
              onValueChange={(value) => setProvider(value as ApiProvider)}
              disabled={!!initialData}
            >
              <SelectTrigger id="provider" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {API_PROVIDERS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {API_PROVIDER_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              required
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? "Save Changes" : "Add Account"}
        </Button>
      </div>
    </form>
  );
}
