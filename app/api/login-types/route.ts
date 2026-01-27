import { NextRequest, NextResponse } from "next/server";
import { createLoginType } from "@/lib/db/queries";
import type { TypeDefinition } from "@/lib/types/account";

export async function POST(request: NextRequest) {
  try {
    const { label, color } = await request.json();
    const now = Date.now();
    const type: TypeDefinition = {
      id: `login-${crypto.randomUUID()}`,
      label,
      color,
      createdAt: now,
    };

    await createLoginType(type);
    return NextResponse.json(type);
  } catch (error) {
    console.error("Failed to create login type:", error);
    return NextResponse.json({ error: "Failed to create login type" }, { status: 500 });
  }
}
