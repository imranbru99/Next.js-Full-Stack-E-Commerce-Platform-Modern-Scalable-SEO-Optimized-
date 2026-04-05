"use client";

import { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <Link href="/login" className="flex items-center gap-2 text-slate-400 hover:text-black font-black text-[10px] uppercase tracking-widest mb-10 transition">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Reset Password</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Enter your email to receive recovery link</p>
        </div>

        {status === "success" ? (
          <div className="bg-slate-50 p-10 rounded-[3rem] text-center animate-in fade-in zoom-in">
            <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={24} />
            </div>
            <p className="font-black text-sm uppercase tracking-tighter">Email Sent!</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Check your inbox for the reset link.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input 
              required
              type="email" 
              placeholder="YOUR EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-black outline-none transition"
            />
            <button 
              disabled={status === "loading"}
              className="w-full bg-black text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
            >
              {status === "loading" ? <Loader2 className="animate-spin mx-auto" size={20} /> : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}