"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Lock, Loader2, Save, ChevronLeft, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, update, status: sessionStatus } = useSession();
  
  const [infoLoading, setInfoLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", msg: "" });

  // 1. Initialize with empty string
  const [name, setName] = useState("");

  // 2. CRITICAL FIX: Sync name when session loads
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoLoading(true);
    setStatus({ type: "", msg: "" });

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setStatus({ type: "success", msg: "Name updated successfully!" });
      // Update the client-side session immediately
      await update({ name });
    } else {
      setStatus({ type: "error", msg: "Failed to update name." });
    }
    setInfoLoading(false);
  };

  // ... (handleUpdatePassword remains the same)
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    
    setPassLoading(true);
    setStatus({ type: "", msg: "" });

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setStatus({ type: "success", msg: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
    } else {
      const err = await res.text();
      setStatus({ type: "error", msg: err || "Password update failed." });
    }
    setPassLoading(false);
  };

  // 3. Show a loading skeleton if the session is still fetching
  if (sessionStatus === "loading") {
    return <div className="min-h-screen flex items-center justify-center font-black animate-pulse uppercase tracking-widest">Loading Session...</div>;
  }

  return (
    <div className="bg-white min-h-screen pb-20 pt-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        
        <Link href="/dashboard" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6 hover:text-black transition group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
        </Link>

        <div className="mb-12">
          <h1 className="text-6xl font-black tracking-tighter uppercase italic">Settings</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Personalize your identity & security</p>
        </div>

        {status.msg && (
          <div className={`p-6 rounded-[2rem] mb-10 font-black text-[10px] uppercase tracking-widest border-2 animate-in fade-in zoom-in ${
            status.type === "error" ? "bg-red-50 border-red-100 text-red-600" : "bg-green-50 border-green-100 text-green-600"
          }`}>
            {status.msg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          <div className="bg-white border-2 border-slate-50 rounded-[3.5rem] p-10 flex flex-col justify-between shadow-sm">
            <form onSubmit={handleUpdateInfo} className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <User size={24} className="text-black" />
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Personal Info</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Full Name</label>
                  <input 
                    type="text" 
                    value={name} // This is now controlled by state + useEffect
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-bold focus:ring-2 focus:ring-black transition text-sm"
                    placeholder="Your Name"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Phone Number</label>
                    <div className="w-full px-8 py-5 bg-slate-100 border-none rounded-[2rem] font-bold text-slate-400 flex items-center gap-3 cursor-not-allowed">
                      <Phone size={14} /> {(session?.user as any)?.phone || "Not Set"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Email Address</label>
                    <div className="w-full px-8 py-5 bg-slate-100 border-none rounded-[2rem] font-bold text-slate-400 flex items-center gap-3 cursor-not-allowed">
                      <Mail size={14} /> {session?.user?.email || "Not Set"}
                    </div>
                  </div>
                </div>
                <p className="text-[9px] font-bold text-slate-300 ml-4 italic">Email and Phone cannot be changed for security.</p>
              </div>

              <button 
                type="submit"
                disabled={infoLoading}
                className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-100 hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {infoLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Update Info</>}
              </button>
            </form>
          </div>

          <div className="bg-white border-2 border-slate-50 rounded-[3.5rem] p-10 flex flex-col justify-between shadow-sm">
             {/* ... Security form remains same ... */}
             <form onSubmit={handleUpdatePassword} className="space-y-8">
              <div className="flex items-center gap-3 mb-4">
                <Lock size={24} className="text-black" />
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Security</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Current Password</label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-bold focus:ring-2 focus:ring-black transition text-sm"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-8 py-5 bg-slate-50 border-none rounded-[2rem] font-bold focus:ring-2 focus:ring-black transition text-sm"
                    placeholder="Enter new password"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={passLoading}
                className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-100 hover:bg-slate-800 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {passLoading ? <Loader2 className="animate-spin" size={18} /> : <><Lock size={18} /> Update Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}