"use client";

import { useSettings } from "@/components/SettingsContext";
import { RotateCcw, DollarSign, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RefundContent() {
  const { storeName } = useSettings();
  const name = storeName || "NEXTECOMMERCE";

  return (
    <div className="pb-32">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-50 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Customer Service</p>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Returns & <br /> Refunds.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Transparent. Simple. Fair. — {name} Support
          </p>
        </div>
      </section>

      {/* 2. CORE POLICY CARDS */}
      <section className="max-w-7xl mx-auto px-4 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black text-white p-10 rounded-[2rem] space-y-6 shadow-2xl">
            <RotateCcw className="text-blue-500" size={32} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">7-Day Window</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              Return any unused item within 7 days of delivery for a full refund or exchange.
            </p>
          </div>
          <div className="bg-slate-900 text-white p-10 rounded-[2rem] space-y-6 shadow-2xl">
            <ShieldCheck className="text-blue-500" size={32} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Pure Integrity</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              Items must be in original condition with tags attached to maintain quality standards.
            </p>
          </div>
          <div className="bg-white border border-slate-100 p-10 rounded-[2rem] space-y-6 shadow-xl shadow-slate-100">
            <DollarSign className="text-black" size={32} />
            <h3 className="text-xl font-black italic uppercase tracking-tighter">Fast Payouts</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose text-slate-400">
              Once inspected, your refund is processed immediately back to your original payment method.
            </p>
          </div>
        </div>
      </section>

      {/* 3. DETAILED POLICY SECTIONS */}
      <section className="max-w-4xl mx-auto px-4 py-32">
        <div className="space-y-24">
          
          {/* Section 01 */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black italic text-slate-100">01</span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Return Eligibility</h2>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 pl-12 border-l border-slate-100">
              <p>At <span className="text-black">{name}</span>, your satisfaction is our priority. To be eligible for a return, your item must be:</p>
              <ul className="list-disc pl-5 space-y-3">
                <li>UNWORN AND UNWASHED</li>
                <li>IN THE ORIGINAL PACKAGING</li>
                <li>WITH ALL TAGS AND LABELS INTACT</li>
                <li>FREE FROM PERFUME OR COSMETIC MARKS</li>
              </ul>
            </div>
          </div>

          {/* Section 02 */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black italic text-slate-100">02</span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">The Inspection Process</h2>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 pl-12 border-l border-slate-100">
              <p>
                Once we receive your item at our Dhaka studio, our quality control team will inspect it within 48 hours. 
                We will notify you via email regarding the approval or rejection of your refund.
              </p>
              <div className="bg-slate-50 p-6 italic border-l-4 border-black">
                <p className="text-black">Note: Sale items or items purchased during clearance events are final sale.</p>
              </div>
            </div>
          </div>

          {/* Section 03 */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-black italic text-slate-100">03</span>
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">Shipping Returns</h2>
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 pl-12 border-l border-slate-100">
              <div className="flex items-center gap-3 text-black">
                <Truck size={16} />
                <p>CUSTOMER RESPONSIBILITY</p>
              </div>
              <p>
                You will be responsible for paying for your own shipping costs for returning your item. 
                Shipping costs are non-refundable. If you receive a refund, the cost of return shipping 
                will be deducted from your refund if we arranged the pickup.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-50 p-12 md:p-20 text-center space-y-8">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Need Help With <br /> An Order?</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Our support team is available 10AM — 08PM (SAT-THU)</p>
          <div className="pt-6">
            <Link 
              href="/contact" 
              className="inline-flex items-center gap-4 bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
            >
              Contact Support <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}