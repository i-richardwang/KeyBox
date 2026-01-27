import { NextRequest, NextResponse } from "next/server";
import { getAllData, initializeDefaults, importData } from "@/lib/db/queries";
import { parseImportFile } from "@/lib/import-export";

export async function GET() {
  try {
    await initializeDefaults();
    const data = await getAllData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    const data = parseImportFile(content);

    if (!data) {
      return NextResponse.json({ success: false, error: "Invalid file format" }, { status: 400 });
    }

    const result = await importData(
      data.accounts,
      data.loginTypes ?? [],
      data.apiProviders ?? []
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Failed to import data:", error);
    return NextResponse.json({ success: false, error: "Failed to import data" }, { status: 500 });
  }
}
