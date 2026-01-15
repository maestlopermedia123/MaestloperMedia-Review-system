import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// file extensions to allow
const PUBLIC_FILE = /\.(.*)$/;

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ✅ Allow public files (images, fonts, etc.)
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
}

function redirectToLogin(request) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
