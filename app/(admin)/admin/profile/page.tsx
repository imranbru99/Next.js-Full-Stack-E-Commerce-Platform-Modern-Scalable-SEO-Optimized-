"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, Save, Loader2, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react"; // Assuming you use NextAuth

export default function AdminProfile() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load session data into form
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).phone || "",
      }));
    }
  }, [session]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: (session?.user as any).id,
          ...formData
        }),
      });

      if (res.ok) {
        alert("Profile updated successfully!");
        // Optional: Trigger session update if using NextAuth
        update(); 
      }
    } catch (error) {
      alert("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <header className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Account</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
          Manage your administrative identity and security
        </p>
      </header>

      <form onSubmit={handleUpdate} className="space-y-8">
        
        {/* Section 1: Personal Identity */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-widest">Personal Identity</h2>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Public and contact information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Phone Number</label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
              <input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Section 2: Security */}
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-6">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-widest">Security & Password</h2>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Update your login credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">New Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Confirm New Password</label>
              <input 
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none" 
              />
            </div>
          </div>
        </div>

        <button 
          disabled={isLoading}
          className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Update Profile</>}
        </button>
      </form>
    </div>
  );
}