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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return the user object
        // This is where we first grab the phone and role from the DB
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: (user as any).phone || "Not Set", 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. On initial login, move DB data into the JWT token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.phone = (user as any).phone;
        token.name = user.name;
      }

      // 2. Handle Client-side update() calls
      // When you call update({ name: "New Name" }) in your Profile component,
      // this block catches it and updates the token.
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        // You can add phone here too if you ever allow phone updates
        if (session.phone) token.phone = session.phone;
      }

      return token;
    },

    async session({ session, token }) {
      // 3. Move the data from the JWT token into the Session object
      // This is what useSession() actually sees on the frontend
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).phone = token.phone;
        session.user.name = token.name; // Ensures the updated name shows up
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };