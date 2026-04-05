"use client";

import { useCart } from "@/lib/store/useCart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { items } = useCart();
  const [mounted, setMounted] = useState(false);

  // This ensures the 0 doesn't flash before the real number loads
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="text-gray-600 hover:text-black transition relative flex items-center gap-1 group">
      <ShoppingBag size={22} className="group-hover:scale-110 transition-transform" />
      
      {mounted && totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-in fade-in zoom-in duration-300 shadow-sm border-2 border-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}