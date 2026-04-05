"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Attempt Sign In
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false, // Prevent default redirect to handle role-based logic
      });

      if (response?.error) {
        setError("Invalid email or password");
        setIsLoading(false);
      } else if (response?.ok) {
        // 2. Success! Now fetch the session to check the role
          const session = await getSession();

          if (session?.user?.role === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            // REDIRECT USER TO THEIR DASHBOARD
            router.push("/dashboard");
          }
          router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">
            Login
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            Access your account dashboard
          </p>
        </div>

        {/* Error Box */}
        {error && (
          <div className="bg-red-50 border-2 border-red-100 text-red-600 text-xs font-black uppercase tracking-widest p-4 rounded-2xl mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="user@store.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2 ml-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <Link
                href="#"
                className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-black transition"
              >
                Forgot?
              </Link>
            </div>
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
            className="w-full bg-black text-white font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200 active:scale-95 disabled:opacity-70"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            New here?{" "}
            <Link
              href="/register"
              className="text-black underline underline-offset-4"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}