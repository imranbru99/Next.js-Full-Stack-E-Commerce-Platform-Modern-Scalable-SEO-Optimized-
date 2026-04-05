"use client";

import { useSettings } from "@/components/SettingsContext";
import { Truck, Package, Clock, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ShippingContent() {
  const { storeName, currencySymbol } = useSettings();
  const name = storeName || "NEXTECOMMERCE";
  const symbol = currencySymbol || "TK";

  return (
    <div className="pb-32">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-50 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Logistics & Fulfilment</p>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Shipping <br /> Info.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Speed. Security. Transparency. — {name} Worldwide
          </p>
        </div>
      </section>

      {/* 2. FREE SHIPPING HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="bg-black text-white p-12 md:p-16 rounded-[3rem] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-blue-500">
               Complimentary <br /> Delivery.
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-loose max-w-sm">
              We offer premium complimentary shipping across Bangladesh on all orders exceeding {symbol} 1500.
            </p>
          </div>
          <div className="flex-shrink-0 bg-white/10 p-8 rounded-full border border-white/10">
             <Truck size={48} className="text-white" />
          </div>
        </div>
      </section>

      {/* 3. DELIVERY ESTIMATES TABLE */}
      <section className="max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left side: Times */}
            <div className="lg:col-span-8 space-y-16">
                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-b pb-4">Estimated Timeframes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 bg-slate-50 space-y-4">
                            <MapPin size={24} className="text-black" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter">Inside Dhaka</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">2 — 3 Business Days</p>
                        </div>
                        <div className="p-10 bg-slate-50 space-y-4">
                            <MapPin size={24} className="text-slate-300" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter">Outside Dhaka</h4>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">3 — 5 Business Days</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-b pb-4">Processing Details</h3>
                    <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6">
                        <div className="flex gap-6 items-start">
                            <Clock size={18} className="text-black flex-shrink-0" />
                            <p>All <span className="text-black">{name}</span> orders are processed within 1-2 business days. Please note that orders are not shipped or delivered on weekends or public holidays.</p>
                        </div>
                        <div className="flex gap-6 items-start">
                            <Package size={18} className="text-black flex-shrink-0" />
                            <p>Once your order has been dispatched, you will receive a secondary notification with tracking details to follow your shipment.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Checklist */}
            <div className="lg:col-span-4 bg-slate-50 p-10 rounded-[2rem] h-fit">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-10">Our Commitment</h3>
                <ul className="space-y-8">
                    {[
                        "SECURE PACKAGING",
                        "REAL-TIME TRACKING",
                        "HAND-DELIVERED SERVICE",
                        "SMS UPDATES"
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-4 group">
                            <CheckCircle2 size={16} className="text-blue-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-black transition-colors">{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </section>

      {/* 4. TRACKING CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="border-t border-slate-100 pt-24 text-center space-y-10">
          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Where is <br /> My Order?</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 max-w-xs mx-auto leading-loose">
            Input your order ID on our tracking page to see the real-time status of your {name} delivery.
          </p>
          <div className="pt-6">
            <Link 
              href="/track-order" 
              className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
            >
              Track Order <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}