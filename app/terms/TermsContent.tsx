"use client";

import { useSettings } from "@/components/SettingsContext";
import { Scale, BookOpen, AlertCircle, Handshake, ChevronRight } from "lucide-react";

export default function TermsContent() {
  const { storeName } = useSettings();
  const name = storeName || "NEXTECOMMERCE";

  const legalSections = [
    { id: "general", title: "General Conditions" },
    { id: "service", title: "Service & Pricing" },
    { id: "accuracy", title: "Billing Accuracy" },
    { id: "governance", title: "Governing Law" },
  ];

  return (
    <div className="pb-32">
      {/* 1. HERO HEADER */}
      <section className="bg-slate-50 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Legal Governance</p>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Terms of <br /> Service.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Agreement of Use — {name} Studio 2026
          </p>
        </div>
      </section>

      {/* 2. LEGAL GRID */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Quick Nav */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 border-b pb-4">Index</h3>
            <nav className="flex flex-col gap-6">
              {legalSections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-black flex items-center gap-2 transition-all group"
                >
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right: Terms Content */}
          <div className="lg:col-span-9 space-y-24">
            
            {/* The "Agreement" Summary Card */}
            <div className="bg-black p-10 md:p-16 text-white rounded-[3rem] space-y-8 shadow-2xl">
              <Handshake size={40} className="text-blue-500" />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight">By engaging with {name}, <br/> you agree to these terms.</h2>
              <p className="text-xs font-bold uppercase tracking-widest leading-loose text-slate-400">
                Please read these Terms of Service carefully before accessing our website. By visiting our site or purchasing from us, you engage in our "Service" and agree to be bound by the following conditions.
              </p>
            </div>

            {/* Section 01: General */}
            <div id="general" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <Scale size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">01. General Conditions</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted.
                </p>
                <div className="bg-slate-50 p-8 border-l-4 border-black italic">
                   <p className="text-black">"You agree not to reproduce, duplicate, copy, sell, or exploit any portion of the Service without express written permission by {name}."</p>
                </div>
              </div>
            </div>

            {/* Section 02: Modifications */}
            <div id="service" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <BookOpen size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">02. Modifications to Service</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
                </p>
                <p>
                  We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.
                </p>
              </div>
            </div>

            {/* Section 03: Accuracy */}
            <div id="accuracy" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <AlertCircle size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">03. Billing & Account Accuracy</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  We reserve the right to refuse any order you place with us. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.
                </p>
                <p>
                  You agree to provide current, complete and accurate purchase and account information for all purchases made at our store.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FINAL CONTACT BOX */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="bg-slate-50 p-12 md:p-20 text-center rounded-[3rem]">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-4">Need Legal Clarification?</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">Our administration is available for all inquiries.</p>
          <a 
            href="/contact" 
            className="inline-block bg-black text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Contact Administration
          </a>
        </div>
      </section>
    </div>
  );
}