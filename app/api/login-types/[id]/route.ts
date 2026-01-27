import { NextRequest, NextResponse } from "next/server";
import { updateLoginType, deleteLoginType } from "@/lib/db/queries";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    await updateLoginType(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update login type:", error);
    return NextResponse.json({ error: "Failed to update login type" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteLoginType(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete login type:", error);
    return NextResponse.json({ error: "Failed to delete login type" }, { status: 500 });
  }
}
