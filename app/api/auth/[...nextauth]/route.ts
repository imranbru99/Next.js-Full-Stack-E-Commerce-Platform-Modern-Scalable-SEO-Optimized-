import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // 1. Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // 2. Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // 3. Return the user object for the JWT callback
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role, // Ensure your Prisma schema has a 'role' field
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Step A: Initial Sign In
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }

      // Step B: Handle Manual Session Updates (client-side update() calls)
      if (trigger === "update" && session) {
        // This allows updating name/email/role dynamically from the UI
        return { ...token, ...session.user };
      }

      // Step C: Database Verification (The "Ghost Session" Fix)
      // We check if the user still exists in the DB on every request.
      if (token?.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, role: true, name: true, email: true },
          });

          // If user was deleted from DB, return null to invalidate the JWT
          if (!dbUser) {
            return null as any;
          }

          // Keep token in sync with DB (updates role/name if changed by admin)
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.email = dbUser.email;
        } catch (error) {
          console.error("NextAuth JWT Callback Error:", error);
          return token;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // If the JWT was invalidated in the step above, token will be null
      if (!token && session) {
        return null as any; 
      }

      // Pass ID and Role to the frontend session object
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };