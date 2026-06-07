import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET || AUTH_SECRET.length < 16) {
  throw new Error("AUTH_SECRET is missing or too short.");
}
const secret = new TextEncoder().encode(AUTH_SECRET);

function homeFor(role: string): string {
  if (role === "confirmateur") return "/confirmation";
  if (role === "plombier") return "/technicien";
  return "/admin";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // login page is always allowed
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get("fm_admin_session")?.value;
  let role: string | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      role = (payload.role as string) ?? "admin";
    } catch {
      /* invalid/expired */
    }
  }

  // not logged in -> login
  if (!role) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // role-based area gating (admin can access everything)
  const denied =
    (pathname.startsWith("/admin") && role !== "admin") ||
    (pathname.startsWith("/confirmation") && role !== "confirmateur" && role !== "admin") ||
    (pathname.startsWith("/technicien") && role !== "plombier" && role !== "admin");

  if (denied) {
    const url = req.nextUrl.clone();
    url.pathname = homeFor(role);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/confirmation/:path*", "/technicien/:path*"],
};
