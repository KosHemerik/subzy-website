import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    const url = request.nextUrl.clone();

    // Strip the Dutch locale prefix and reuse existing non-prefixed routes.
    url.pathname = pathname === "/nl" ? "/" : pathname.replace(/^\/nl(?=\/)/, "");

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
