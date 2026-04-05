import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// 1. Cache Categories for 24 Hours
export const getCachedCategories = unstable_cache(
  async () => {
    console.log("DB HIT: Fetching Categories..."); // You'll only see this once a day
    return await prisma.category.findMany({
      take: 5,
      orderBy: { createdAt: 'asc' },
      include: { subcategories: true }
    });
  },
  ["header-categories"], // Cache Key
  { revalidate: 86400, tags: ["categories"] } // 86400 seconds = 24 Hours
);

// 2. Cache Store Settings for 24 Hours
export const getCachedSettings = unstable_cache(
  async () => {
    console.log("DB HIT: Fetching Settings...");
    return await prisma.storeSettings.findUnique({ where: { id: "1" } });
  },
  ["store-settings"],
  { revalidate: 86400, tags: ["settings"] }
);