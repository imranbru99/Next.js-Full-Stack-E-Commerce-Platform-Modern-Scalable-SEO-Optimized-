"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Navbar({ categories }: { categories: any[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <nav className="hidden md:flex gap-10 h-full items-center">
      {categories.map((cat) => (
        <div 
          key={cat.id} 
          className="relative h-full flex items-center group"
          onMouseEnter={() => setActive(cat.id)}
          onMouseLeave={() => setActive(null)}
        >
          <Link href={`/category/${cat.slug}`} className="text-[11px] font-black uppercase tracking-widest text-slate-600 hover:text-black flex items-center gap-1 transition-colors">
            {cat.name}
            {cat.subcategories.length > 0 && <ChevronDown size={10} />}
          </Link>

          {cat.subcategories.length > 0 && active === cat.id && (
            <div className="absolute top-full left-0 bg-white border shadow-2xl p-6 min-w-[220px] animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col gap-4">
                {cat.subcategories.map((sub: any) => (
                  <Link key={sub.id} href={`/category/${cat.slug}/${sub.slug}`} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition">
                    {sub.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}