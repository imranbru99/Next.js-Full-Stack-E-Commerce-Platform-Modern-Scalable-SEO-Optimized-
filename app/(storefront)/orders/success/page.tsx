"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="bg-green-100 p-4 rounded-full animate-bounce">
            <CheckCircle2 size={64} className="text-green-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Order Placed!</h1>
          <p className="text-slate-500 font-medium italic">
            Thank you for shopping with us. Your order is being processed.
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-6 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            Order Reference
          </p>
          <p className="text-xl font-black font-mono">
            #{orderId?.slice(-8).toUpperCase() || "N/A"}
          </p>
        </div>

        <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl text-sm font-bold border border-blue-100">
           📞 Our team will call you at your provided number to confirm the delivery soon.
        </div>

        <div className="flex flex-col gap-3 pt-6">
          <Link 
            href="/" 
            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition"
          >
            <ShoppingBag size={18} /> Continue Shopping
          </Link>
          
          <Link 
            href="/orders/my-orders" 
            className="w-full py-4 text-slate-400 font-bold text-sm hover:text-black flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}