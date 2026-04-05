"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // UI State
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        router.push("/login?message=Account created successfully!");
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Register
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Create your store account
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 text-xs font-black uppercase tracking-widest p-4 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-black outline-none transition-all font-bold text-sm"
              placeholder="Full Name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-black outline-none transition-all font-bold text-sm"
              placeholder="email@example.com"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-black outline-none transition-all font-bold text-sm"
              placeholder="017XXXXXXXX"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl border-2 border-slate-50 bg-slate-50 focus:bg-white focus:border-black outline-none transition-all font-bold text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-70 mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Create Account <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-black underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}