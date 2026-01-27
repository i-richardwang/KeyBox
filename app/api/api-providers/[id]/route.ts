import { NextRequest, NextResponse } from "next/server";
import { updateApiProvider, deleteApiProvider } from "@/lib/db/queries";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const data = await request.json();
    await updateApiProvider(id, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update API provider:", error);
    return NextResponse.json({ error: "Failed to update API provider" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteApiProvider(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete API provider:", error);
    return NextResponse.json({ error: "Failed to delete API provider" }, { status: 500 });
  }
}
