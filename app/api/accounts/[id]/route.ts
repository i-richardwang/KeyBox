import { NextRequest, NextResponse } from "next/server";
import { updateAccount, deleteAccount } from "@/lib/db/queries";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    await updateAccount(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update account:", error);
    return NextResponse.json({ error: "Failed to update account" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteAccount(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete account:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
