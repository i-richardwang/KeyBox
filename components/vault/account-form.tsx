"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useVaultStore } from "@/lib/store";
import type { Account } from "@/lib/types/account";
import { isEmailAccount } from "@/lib/types/account";
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
  const { loginTypes, apiProviders, addLoginType, addApiProvider } = useVaultStore();

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
      <Field>
        <FieldLabel htmlFor="category">Category</FieldLabel>
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
      </Field>

      {category === "login" ? (
        <>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <TypeSelector
              value={loginType}
              onChange={setLoginType}
              types={loginTypes}
              onAddType={addLoginType}
              placeholder="Select type..."
              disabled={!!initialData}
              addDialogTitle="Add Login Type"
              addDialogPlaceholder="e.g., iCloud, GitHub"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="totpSecret">
              2FA Secret <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="totpSecret"
              type="text"
              value={totpSecret}
              onChange={(e) => setTotpSecret(e.target.value)}
              placeholder="Base32 encoded secret"
            />
          </Field>
        </>
      ) : (
        <>
          <Field>
            <FieldLabel>Provider</FieldLabel>
            <TypeSelector
              value={provider}
              onChange={setProvider}
              types={apiProviders}
              onAddType={addApiProvider}
              placeholder="Select provider..."
              disabled={!!initialData}
              addDialogTitle="Add API Provider"
              addDialogPlaceholder="e.g., GitHub, Stripe"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="apiKey">API Key</FieldLabel>
            <Input
              id="apiKey"
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              required
            />
          </Field>
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
