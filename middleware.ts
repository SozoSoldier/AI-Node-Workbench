import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Snatch the cookie from the incoming network request headers
  const isAuthenticatedCookie = request.cookies.get("auth_session")?.value;
  const { pathname } = request.nextUrl;

  // 2. Route Guard Validation Check
  // If the cookie is missing and the user is attempting to deep-link to /settings or /registry...
  if (
    !isAuthenticatedCookie &&
    (pathname.startsWith("/settings") || pathname.startsWith("/registry"))
  ) {
    console.log(
      `🔒 ROUTE GUARD INTERCEPT: Blocking deep-link request to ${pathname}`,
    );

    // Force a redirect back to the home layout where the login panel handles them
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Allow execution to continue naturally if authenticated or viewing public files
  return NextResponse.next();
}

// 3. Configuration matcher to prevent middleware from running on static image assets or icons
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
