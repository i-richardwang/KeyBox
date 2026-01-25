"use client";

import { useState } from "react";
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
import { useCustomTypes } from "@/context/custom-types-context";
import type { Account, PresetLoginType, PresetApiProvider } from "@/lib/types/account";
import {
  PRESET_LOGIN_TYPES,
  PRESET_API_PROVIDERS,
  LOGIN_TYPE_LABELS,
  API_PROVIDER_LABELS,
  LOGIN_TYPE_COLORS,
  API_PROVIDER_COLORS,
  isEmailAccount,
} from "@/lib/types/account";
import { TypeSelector } from "./type-selector";

type AccountCategory = "login" | "api-key";

export interface AccountFormData {
  category: AccountCategory;
  loginType?: string;
  provider?: string;
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

// Build preset options for TypeSelector
const loginTypePresets = PRESET_LOGIN_TYPES.map((type) => ({
  value: type,
  label: LOGIN_TYPE_LABELS[type as PresetLoginType],
  color: LOGIN_TYPE_COLORS[type as PresetLoginType],
  isPreset: true,
}));

const apiProviderPresets = PRESET_API_PROVIDERS.map((provider) => ({
  value: provider,
  label: API_PROVIDER_LABELS[provider as PresetApiProvider],
  color: API_PROVIDER_COLORS[provider as PresetApiProvider],
  isPreset: true,
}));

function getInitialValues(initialData?: Account) {
  if (!initialData) {
    return {
      category: "login" as AccountCategory,
      loginType: "gmail",
      provider: "openai",
      email: "",
      password: "",
      totpSecret: "",
      apiKey: "",
    };
  }

  if (isEmailAccount(initialData)) {
    return {
      category: "login" as AccountCategory,
      loginType: initialData.type,
      provider: "openai",
      email: initialData.email,
      password: initialData.password,
      totpSecret: initialData.totpSecret || "",
      apiKey: "",
    };
  }

  return {
    category: "api-key" as AccountCategory,
    loginType: "gmail",
    provider: initialData.provider,
    email: "",
    password: "",
    totpSecret: "",
    apiKey: initialData.apiKey,
  };
}

export function AccountForm({ initialData, onSubmit, onCancel }: AccountFormProps) {
  const { loginTypes, apiProviders, addLoginType, addApiProvider } = useCustomTypes();

  const initial = getInitialValues(initialData);

  const [category, setCategory] = useState<AccountCategory>(initial.category);
  const [loginType, setLoginType] = useState<string>(initial.loginType);
  const [provider, setProvider] = useState<string>(initial.provider);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);
  const [totpSecret, setTotpSecret] = useState(initial.totpSecret);
  const [apiKey, setApiKey] = useState(initial.apiKey);

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
          <div className="space-y-2">
            <Label>Type</Label>
            <TypeSelector
              value={loginType}
              onChange={setLoginType}
              presets={loginTypePresets}
              customTypes={loginTypes}
              onAddCustomType={addLoginType}
              placeholder="Select type..."
              disabled={!!initialData}
              addDialogTitle="Add Login Type"
              addDialogPlaceholder="e.g., iCloud, GitHub"
            />
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
          <div className="space-y-2">
            <Label>Provider</Label>
            <TypeSelector
              value={provider}
              onChange={setProvider}
              presets={apiProviderPresets}
              customTypes={apiProviders}
              onAddCustomType={addApiProvider}
              placeholder="Select provider..."
              disabled={!!initialData}
              addDialogTitle="Add API Provider"
              addDialogPlaceholder="e.g., GitHub, Stripe"
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
