"use client";

import { useSettings } from "@/components/SettingsContext";
// 1. REPLACED BRAND ICONS WITH FUNCTIONAL ICONS
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Camera,   // Use for Instagram
  Share2,   // Use for Facebook/Socials
  Send 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactClient() {
  const { storeName } = useSettings();
  const name = storeName || "NEXTECOMMERCE";

  return (
    <div className="pb-32">
      {/* 1. HERO SECTION */}
      <section className="bg-slate-50 py-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-6">Support Center</p>
          <h1 className="text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-12">
            Get In <br /> Touch.
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 max-w-md leading-loose">
            Whether you have a question about sizing or a specific piece, our {name} team is here to assist.
          </p>
        </div>
      </section>

      {/* 2. CONTACT GRID */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          
          {/* Left: Info */}
          <div className="space-y-20">
            <div className="space-y-12">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-b pb-4">Direct Channels</h3>
              <div className="space-y-10">
                <div className="flex items-start gap-8 group">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email Us</p>
                    <p className="text-sm font-black uppercase tracking-tight italic border-b border-black w-fit">
                        support@{(storeName || "store").toLowerCase()}.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-8 group">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Call Support</p>
                    <p className="text-sm font-black uppercase tracking-tight italic">+880 1XXX-XXXXXX</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 border-b pb-4">Our Studio</h3>
              <div className="space-y-10">
                <div className="flex items-start gap-8">
                  <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Location</p>
                    <p className="text-sm font-black uppercase tracking-tight italic max-w-[200px]">
                        Plot 12, Road 04, Sector 03, Uttara, Dhaka, Bangladesh.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-slate-50 p-10 md:p-16 rounded-[3rem]">
             <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-10">Send a Message</h3>
             <form className="space-y-10">
                <input type="text" className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-all" placeholder="YOUR NAME" />
                <input type="email" className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-all" placeholder="EMAIL ADDRESS" />
                <textarea rows={4} className="w-full bg-transparent border-b-2 border-slate-200 py-3 text-xs font-bold uppercase tracking-widest outline-none focus:border-black transition-all resize-none" placeholder="HOW CAN WE HELP?" />
                <button className="w-full bg-black text-white py-6 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200">
                    Submit Inquiry <Send size={16} />
                </button>
             </form>
          </div>
        </div>
      </section>

      {/* 3. SOCIALS SECTION (FIXED ICONS) */}
      <section className="max-w-7xl mx-auto px-4 py-24 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-10">
        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Follow Our Journey</h2>
        <div className="flex gap-10">
            <Link href="#" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all">
                <Camera size={18} /> Instagram
            </Link>
            <Link href="#" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-all">
                <Share2 size={18} /> Facebook
            </Link>
        </div>
      </section>
    </div>
  );
}