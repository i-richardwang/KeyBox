import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const correctPassword = process.env.AUTH_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json({ success: true });
  }

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("keybox-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}

export async function GET() {
  const requiresAuth = !!process.env.AUTH_PASSWORD;
  return NextResponse.json({ requiresAuth });
}
