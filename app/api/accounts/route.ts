import { NextRequest, NextResponse } from "next/server";
import { createAccount, deleteAccounts } from "@/lib/db/queries";
import type { Account, EmailAccount, ApiKeyAccount } from "@/lib/types/account";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const now = Date.now();
    const id = crypto.randomUUID();

    let account: Account;
    if (data.type === "api-key") {
      account = {
        id,
        type: "api-key",
        provider: data.provider,
        apiKey: data.apiKey,
        account: data.account,
        createdAt: now,
        updatedAt: now,
      } as ApiKeyAccount;
    } else {
      account = {
        id,
        type: data.type,
        email: data.email,
        password: data.password,
        totpSecret: data.totpSecret,
        recoveryEmail: data.recoveryEmail,
        createdAt: now,
        updatedAt: now,
      } as EmailAccount;
    }

    await createAccount(account);
    return NextResponse.json(account);
  } catch (error) {
    console.error("Failed to create account:", error);
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();
    await deleteAccounts(ids);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete accounts:", error);
    return NextResponse.json({ error: "Failed to delete accounts" }, { status: 500 });
  }
}
