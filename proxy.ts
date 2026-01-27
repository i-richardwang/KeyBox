import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/"];
const publicRoutes = ["/login"];

export default async function proxy(req: NextRequest) {
  const requiresAuth = !!process.env.AUTH_PASSWORD;

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = (await cookies()).get("keybox-auth")?.value;
  const isAuthenticated = cookie === "authenticated";

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|favicon\\.ico).*)"],
};
