"use client";

import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <>
      <Search 
        size={20} 
        className="cursor-pointer hover:text-slate-500 transition-colors" 
        onClick={() => setIsOpen(true)} 
      />

      {/* Full Screen Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-white/98 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-7xl mx-auto w-full px-4 py-8">
            
            {/* Top Bar with Close Button */}
            <div className="flex justify-between items-center mb-20">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                Quick Search
              </span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-3 hover:bg-black hover:text-white rounded-full transition-all duration-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search Area with Background Effect */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="group relative">
                {/* The Background Box Effect */}
                <div className="absolute -inset-6 bg-slate-50 rounded-2xl scale-95 opacity-0 group-focus-within:scale-100 group-focus-within:opacity-100 transition-all duration-500 -z-10" />
                
                <div className="relative flex items-center border-b-2 border-black pb-4">
                  <input
                    autoFocus
                    type="text"
                    placeholder="WHAT ARE YOU LOOKING FOR?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full text-3xl md:text-6xl font-black bg-transparent outline-none uppercase tracking-tighter placeholder:text-slate-200"
                  />
                  <button type="submit" className="ml-4 p-2">
                    <Search size={40} className="text-black group-focus-within:scale-110 transition-transform duration-300" />
                  </button>
                </div>
              </form>

              {/* Suggestions / Info */}
              <div className="mt-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                   Press Enter to execute search
                </p>
                <div className="flex gap-6">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Trending: T-Shirts</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Premium Denim</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}