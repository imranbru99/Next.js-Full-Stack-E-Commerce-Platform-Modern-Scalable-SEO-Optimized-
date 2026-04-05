"use client";

import { useSettings } from "@/components/SettingsContext";
import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from "lucide-react";

export default function PrivacyContent() {
  const { storeName } = useSettings();
  const name = storeName || "NEXTECOMMERCE";

  const sections = [
    { id: "collection", title: "Information Collection" },
    { id: "usage", title: "How We Use Data" },
    { id: "sharing", title: "Third Party Sharing" },
    { id: "security", title: "Data Security" },
  ];

  return (
    <div className="pb-32">
      {/* 1. MINIMALIST HEADER */}
      <section className="bg-slate-50 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Legal Department</p>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8">
            Privacy <br /> Policy.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Last Updated: April 2026 — Version 2.0
          </p>
        </div>
      </section>

      {/* 2. POLICY CONTENT GRID */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left: Quick Navigation (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-32 h-fit">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mb-8 border-b pb-4">On This Page</h3>
            <nav className="flex flex-col gap-6">
              {sections.map((s) => (
                <a 
                  key={s.id} 
                  href={`#${s.id}`} 
                  className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-black flex items-center gap-2 transition-all group"
                >
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-all" />
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          {/* Right: Detailed Policy Text */}
          <div className="lg:col-span-9 space-y-24">
            
            {/* Intro Summary Card */}
            <div className="bg-slate-900 p-10 md:p-16 text-white rounded-[3rem] space-y-8 shadow-2xl shadow-slate-200">
              <ShieldCheck size={40} className="text-blue-500" />
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your Data, Your Trust.</h2>
              <p className="text-xs md:text-sm font-bold uppercase tracking-widest leading-loose text-slate-400">
                At <span className="text-white">{name}</span>, we treat your personal data with the same respect we treat our craftsmanship. 
                We only collect what is strictly necessary to deliver a premium shopping experience.
              </p>
            </div>

            {/* Section: Collection */}
            <div id="collection" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <Eye size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">01. Information Collection</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, and time zone. 
                </p>
                <p>
                  Additionally, as you make a purchase or attempt to make a purchase through the Site, we collect certain information from you, including your name, billing address, shipping address, and payment information.
                </p>
              </div>
            </div>

            {/* Section: Usage */}
            <div id="usage" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <FileText size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">02. How We Use Data</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  We use the Order Information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping, and providing you with invoices and/or order confirmations). 
                </p>
                <ul className="list-disc pl-5 space-y-4">
                  <li>COMMUNICATE WITH YOU REGARDING ORDERS</li>
                  <li>SCREEN OUR ORDERS FOR POTENTIAL RISK OR FRAUD</li>
                  <li>PROVIDE YOU WITH INFORMATION OR ADVERTISING RELATING TO OUR PRODUCTS</li>
                </ul>
              </div>
            </div>

            {/* Section: Security */}
            <div id="security" className="space-y-8 border-t border-slate-100 pt-16">
              <div className="flex items-center gap-4">
                <Lock size={20} className="text-slate-300" />
                <h3 className="text-xl font-black uppercase italic tracking-tighter">03. Data Security</h3>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-widest leading-loose text-slate-500 space-y-6 max-w-3xl">
                <p>
                  Your security is paramount. All payment transactions are processed through encrypted gateways (SSL) and are not stored on our local servers. 
                </p>
                <div className="bg-slate-50 p-8 border-l-4 border-black italic">
                   <p className="text-black">"We maintain rigid administrative and technical safeguards to protect against unauthorized access."</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="border-2 border-black p-12 text-center space-y-6">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Questions Regarding Privacy?</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Our legal team is ready to assist you.</p>
          <div className="pt-4">
             <a href="/contact" className="inline-block bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">Contact Legal</a>
          </div>
        </div>
      </section>
    </div>
  );
}