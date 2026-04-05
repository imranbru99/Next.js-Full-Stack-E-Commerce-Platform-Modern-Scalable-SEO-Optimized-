import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // ONLY allow access if the user is logged in AND has the ADMIN role
      return token?.role === "ADMIN";
    },
  },
});

// This tells Next.js to ONLY run this protection on /admin and its sub-pages
export const config = { matcher: ["/admin/:path*"] };