"use client";

import { useSettings } from "@/components/SettingsContext";
import { Award, Globe, Zap, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const { storeName } = useSettings();
  const name = storeName || "NEXTECOMMERCE";

  return (
    <div className="pb-32">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-50 py-24 md:py-32 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Est. 2026</p>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] mb-12 max-w-4xl">
            Redefining <br /> {name} Aesthetics.
          </h1>
          <div className="max-w-2xl">
            <p className="text-sm md:text-base font-bold uppercase tracking-widest leading-loose text-slate-500">
              Founded in Dhaka, <span className="text-black">{name}</span> was born out of a desire to merge 
              traditional Bangladeshi craftsmanship with the world's most modern minimalist aesthetics. 
              We don't just make clothes; we curate a lifestyle of "Pure Quality."
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE THREE PILLARS (Brand Values) */}
      <section className="max-w-7xl mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl">
              <Zap size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Minimalist Design</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              We strip away the noise. Every stitch, every button, and every fabric choice is intentional, 
              ensuring a timeless look that outlasts trends.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl">
              <Globe size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Locally Crafted</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              100% of our production happens in Bangladesh. By working with local masters, we ensure 
              ethical production while celebrating our heritage.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-2xl">
              <Award size={20} />
            </div>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">Premium Quality</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              We source only the finest sustainable materials. Our "Pure Quality" promise means every 
              piece is built to endure the modern lifestyle.
            </p>
          </div>
        </div>
      </section>

      {/* 3. CRAFTSMANSHIP SECTION (Visual) */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-24">
        <div className="aspect-[4/5] bg-slate-100 overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1974" 
            alt="Craftsmanship" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
        </div>
        <div className="space-y-10 md:pl-12">
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
            Our Process <br /> In 2026.
          </h2>
          <div className="space-y-6">
             <div className="flex gap-4">
                <CheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-[11px] font-black uppercase tracking-widest">Ethically sourced raw cotton & fabrics</p>
             </div>
             <div className="flex gap-4">
                <CheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-[11px] font-black uppercase tracking-widest">Master-level tailoring in local workshops</p>
             </div>
             <div className="flex gap-4">
                <CheckCircle className="text-blue-600 flex-shrink-0" size={20} />
                <p className="text-[11px] font-black uppercase tracking-widest">Rigid 3-step quality inspection</p>
             </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest leading-loose text-slate-500 max-w-md">
            The 2026 Bangladesh Collection is a testament to our evolution. We have refined our patterns 
            to provide the perfect fit for the contemporary silhouette.
          </p>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="bg-black p-12 md:p-24 text-center space-y-10">
          <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter text-white leading-none">
            Wear the <br /> Future.
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Discover the latest arrivals from the {name} studio.
          </p>
          <div className="pt-6">
            <Link 
              href="/all" 
              className="inline-flex items-center gap-3 bg-white text-black px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
            >
              Shop Collection <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}