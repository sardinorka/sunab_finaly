import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get("luxbath_admin");
  const isAuthenticated = authCookie?.value === "authenticated";

  // Public SEO settings read (used by SeoHead on the storefront)
  const isPublicSettingsRead =
    pathname === "/api/admin/settings" && request.method === "GET";

  // 1. Protect API routes
  if (
    pathname.startsWith("/api/admin/") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/me" &&
    !isPublicSettingsRead
  ) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "دسترسی غیرمجاز. لطفاً ابتدا وارد شوید." },
        { status: 403 }
      );
    }
  }

  // 2. Protect Admin UI pages (Server-side redirect)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged-in users from seeing the login page again
  if (pathname.startsWith("/admin/login") && isAuthenticated) {
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
