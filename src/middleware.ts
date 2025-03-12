import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoggedIn = !!token; // Check if the user has a valid token
  const { pathname } = req.nextUrl;

  // Protect all routes under "/dashboard"
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to homepage if not authenticated
  }

  return NextResponse.next(); // Proceed if authenticated or route is not protected
}

// Apply the middleware only to routes under "/dashboard"
export const config = {
  matcher: ["/dashboard/:path*"], // Protects "/dashboard" and all its subpaths
};
