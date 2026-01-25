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
import type { Account, AccountType } from "@/lib/types/account";
import { isEmailAccount } from "@/lib/types/account";

// Form data for creating/editing an account
export interface AccountFormData {
  type: AccountType;
  email?: string;
  password?: string;
  totpSecret?: string;
  provider?: string;
  apiKey?: string;
  apiSecret?: string;
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
  const [type, setType] = useState<AccountType>(initialData?.type || "gmail");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpSecret, setTotpSecret] = useState("");
  const [provider, setProvider] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      if (isEmailAccount(initialData)) {
        setEmail(initialData.email);
        setPassword(initialData.password);
        setTotpSecret(initialData.totpSecret || "");
      } else {
        setProvider(initialData.provider);
        setApiKey(initialData.apiKey);
        setApiSecret(initialData.apiSecret || "");
      }
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "api-key") {
      onSubmit({ type, provider, apiKey, apiSecret: apiSecret || undefined });
    } else {
      onSubmit({ type, email, password, totpSecret: totpSecret || undefined });
    }
  };

  const isEmailType = type === "gmail" || type === "outlook";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Account Type</Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as AccountType)}
          disabled={!!initialData}
        >
          <SelectTrigger id="type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gmail">Gmail</SelectItem>
            <SelectItem value="outlook">Outlook</SelectItem>
            <SelectItem value="api-key">API Key</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isEmailType ? (
        <>
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
          <div className="space-y-2">
            <Label htmlFor="provider">Provider</Label>
            <Input
              id="provider"
              type="text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              placeholder="e.g., OpenAI, Stripe, AWS"
              required
            />
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
          <div className="space-y-2">
            <Label htmlFor="apiSecret">
              API Secret <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="apiSecret"
              type="text"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              placeholder="Enter API secret"
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
