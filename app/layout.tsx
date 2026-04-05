import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import SessionWrapper from "@/components/SessionWrapper";
import { SettingsProvider } from "@/components/SettingsContext";

const inter = Inter({ subsets: ["latin"] });

// DYNAMIC SEO (Shared by all pages)
export async function generateMetadata(): Promise<Metadata> {
  const s = await prisma.storeSettings.findUnique({ where: { id: "1" } });
  return {
    title: s?.storeName || "Nextecommerce",
    description: s?.metaDescription || "Premium Store",
    icons: { icon: s?.faviconUrl || "/favicon.ico" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <SettingsProvider>
            {/* CRITICAL: No UI elements here. 
               This ensures the Admin panel stays clean 
               and the Storefront doesn't double up.
            */}
            {children}
          </SettingsProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}