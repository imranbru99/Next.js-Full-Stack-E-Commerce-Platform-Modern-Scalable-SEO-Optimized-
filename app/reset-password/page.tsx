"use client";

import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");
    // Handle API call to Prisma
    alert("Password updated!");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
           <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">New Password</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choose a strong new password</p>
        </div>

        <form onSubmit={handleReset} className="space-y-4">
           <input 
            type="password" 
            placeholder="NEW PASSWORD" 
            className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setPassword(e.target.value)}
           />
           <input 
            type="password" 
            placeholder="CONFIRM NEW PASSWORD" 
            className="w-full px-8 py-5 bg-slate-50 border-none rounded-3xl font-bold focus:ring-2 focus:ring-black outline-none"
            onChange={(e) => setConfirm(e.target.value)}
           />
           <button className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-slate-200">
             Update Password
           </button>
        </form>
      </div>
    </div>
  );
}