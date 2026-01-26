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
  recoveryEmail?: string;
  apiKey?: string;
  apiAccount?: string;
}

interface AccountFormProps {
  initialData?: Account;
  onSubmit: (data: AccountFormData) => void;
  onCancel: () => void;
}

interface DefaultTypes {
  loginType: string;
  provider: string;
}

function getInitialValues(initialData: Account | undefined, defaults: DefaultTypes) {
  if (!initialData) {
    return {
      category: "login" as AccountCategory,
      loginType: defaults.loginType,
      provider: defaults.provider,
      email: "",
      password: "",
      totpSecret: "",
      recoveryEmail: "",
      apiKey: "",
      apiAccount: "",
    };
  }

  if (isEmailAccount(initialData)) {
    return {
      category: "login" as AccountCategory,
      loginType: initialData.type,
      provider: defaults.provider,
      email: initialData.email,
      password: initialData.password,
      totpSecret: initialData.totpSecret || "",
      recoveryEmail: initialData.recoveryEmail || "",
      apiKey: "",
      apiAccount: "",
    };
  }

  return {
    category: "api-key" as AccountCategory,
    loginType: defaults.loginType,
    provider: initialData.provider,
    email: "",
    password: "",
    totpSecret: "",
    recoveryEmail: "",
    apiKey: initialData.apiKey,
    apiAccount: initialData.account || "",
  };
}

export function AccountForm({ initialData, onSubmit, onCancel }: AccountFormProps) {
  const { loginTypes, apiProviders, addLoginType, addApiProvider } = useVaultStore();

  // Get first available type as default, fallback to empty string if none exist
  const defaults: DefaultTypes = {
    loginType: loginTypes[0]?.id ?? "",
    provider: apiProviders[0]?.id ?? "",
  };

  const initial = getInitialValues(initialData, defaults);

  const [category, setCategory] = useState<AccountCategory>(initial.category);
  const [loginType, setLoginType] = useState<string>(initial.loginType);
  const [provider, setProvider] = useState<string>(initial.provider);
  const [email, setEmail] = useState(initial.email);
  const [password, setPassword] = useState(initial.password);
  const [totpSecret, setTotpSecret] = useState(initial.totpSecret);
  const [recoveryEmail, setRecoveryEmail] = useState(initial.recoveryEmail);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [apiAccount, setApiAccount] = useState(initial.apiAccount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category === "api-key") {
      onSubmit({
        category,
        provider,
        apiKey,
        apiAccount: apiAccount || undefined,
      });
    } else {
      onSubmit({
        category,
        loginType,
        email,
        password,
        totpSecret: totpSecret || undefined,
        recoveryEmail: recoveryEmail || undefined,
      });
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
            <FieldLabel htmlFor="recoveryEmail">
              Recovery Email <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="recoveryEmail"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="recovery@example.com"
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

          <Field>
            <FieldLabel htmlFor="apiAccount">
              Account <span className="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input
              id="apiAccount"
              type="email"
              value={apiAccount}
              onChange={(e) => setApiAccount(e.target.value)}
              placeholder="account@example.com"
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
