"use client";

import { useCart } from "@/lib/store/useCart";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartCounter() {
  const items = useCart((state) => state.items);
  const [mounted, setMounted] = useState(false);

  // This prevents "Hydration Mismatch" errors in Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  if (!mounted) return (
    <div className="relative p-2">
      <ShoppingBag size={20} className="text-gray-600" />
    </div>
  );

  return (
    <Link href="/cart" className="text-gray-600 hover:text-black transition relative p-2">
      <ShoppingBag size={20} />
      {totalItems > 0 && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
          {totalItems}
        </span>
      )}
    </Link>
  );
}