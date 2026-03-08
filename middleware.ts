import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sogbede-fallback-secret",
);

const COOKIE_NAME = "sogbede-admin-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes (except /admin/login)
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Allow the login page
  if (pathname === "/admin/login") {
    // If already logged in, redirect to dashboard
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Token invalid, let them see login page
      }
    }
    return NextResponse.next();
  }

  // Check for auth token on all other /admin routes
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    // Token invalid or expired
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url),
    );
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
