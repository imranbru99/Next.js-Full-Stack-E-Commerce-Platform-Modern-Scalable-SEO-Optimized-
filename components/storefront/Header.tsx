import Link from "next/link";
import { Search, User } from "lucide-react";
import CartIcon from "@/components/CartIcon";
import Navbar from "@/components/Navbar";
import { getCachedCategories, getCachedSettings } from "@/lib/store-data";
import SearchButton from "@/components/SearchButton";
export default async function Header() {
  const [categories, s] = await Promise.all([
    getCachedCategories(),
    getCachedSettings()
  ]);

  const name = s?.storeName || "NEXTECOMMERCE";
  const symbol = s?.currencySymbol || "TK";

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-black text-white text-[10px] uppercase tracking-[0.2em] text-center py-2.5 font-bold">
        Free delivery on all orders over {symbol} 1500! 🚚
      </div>

      {/* Main Navigation */}
      <header className="border-b sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="font-black text-2xl tracking-tighter italic uppercase">
            {name}
          </Link>
          
          <Navbar categories={categories} />

          <div className="flex items-center gap-6">
            <SearchButton />
            <Link href="/login">
              <User size={20} className="cursor-pointer hover:text-slate-500 transition-colors" />
            </Link>
            <CartIcon />
          </div>
        </div>
      </header>
    </>
  );
}