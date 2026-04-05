import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Protect Admin Routes: Only allow ADMIN role
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // 2. Protect User Dashboard: Allow any logged-in user
    if (path.startsWith("/dashboard") && !token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      // This is the "Gatekeeper". 
      // It returns TRUE if the user is allowed to even enter the middleware function.
      authorized: ({ token }) => !!token,
    },
  }
);

// CRITICAL: This "matcher" tells Next.js exactly which folders to guard.
// If a page is NOT in this list, the middleware ignores it (Home, Products, etc. stay open).
export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin/:path*",
    // Do NOT include "/" or "/login" here, or you will get 404/loops!
  ],
};