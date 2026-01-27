import { NextRequest, NextResponse } from "next/server";
import { createApiProvider } from "@/lib/db/queries";
import type { TypeDefinition } from "@/lib/types/account";

export async function POST(request: NextRequest) {
  try {
    const { label, color } = await request.json();
    const now = Date.now();
    const provider: TypeDefinition = {
      id: `api-${crypto.randomUUID()}`,
      label,
      color,
      createdAt: now,
    };

    await createApiProvider(provider);
    return NextResponse.json(provider);
  } catch (error) {
    console.error("Failed to create API provider:", error);
    return NextResponse.json({ error: "Failed to create API provider" }, { status: 500 });
  }
}
