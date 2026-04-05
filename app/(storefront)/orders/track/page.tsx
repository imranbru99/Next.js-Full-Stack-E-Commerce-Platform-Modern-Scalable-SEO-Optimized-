"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, MapPin, Clock, AlertCircle, ShoppingBag } from "lucide-react";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`/api/orders/track?id=${orderId}`);
      if (!res.ok) throw new Error("Order not found. Please check the ID.");
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIndex = (status: string) => {
    const statuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];
    return statuses.indexOf(status);
  };

  return (
    <div className="bg-white min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-16 md:py-24">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">Track Order</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Enter your Order ID to see live updates</p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleTrack} className="relative mb-16">
          <input 
            type="text" 
            placeholder="Paste your Order ID here (e.g. cmnj...)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full pl-6 pr-32 py-6 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-xl font-bold focus:border-black focus:ring-0 outline-none transition-all placeholder:text-slate-300"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white px-8 py-4 rounded-[2rem] font-black text-sm uppercase tracking-tighter hover:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 p-6 bg-red-50 text-red-600 rounded-3xl mb-10 border border-red-100 animate-in fade-in zoom-in">
            <AlertCircle size={20} />
            <p className="font-bold text-sm">{error}</p>
          </div>
        )}

        {/* Tracking Results */}
        {order && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Status Visualizer */}
            <div className="bg-slate-50 p-10 rounded-[3rem] mb-8 relative overflow-hidden border border-slate-100">
               <div className="flex justify-between items-center mb-12 relative z-10">
                  {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-1000 ${
                        getStatusIndex(order.status) >= i ? "bg-black text-white shadow-xl shadow-slate-300" : "bg-white text-slate-200 border border-slate-100"
                      }`}>
                        {i === 0 && <Clock size={16} />}
                        {i === 1 && <Package size={16} />}
                        {i === 2 && <Truck size={16} />}
                        {i === 3 && <CheckCircle2 size={16} />}
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-widest ${getStatusIndex(order.status) >= i ? "text-black" : "text-slate-300"}`}>
                        {s}
                      </span>
                    </div>
                  ))}
                  {/* Progress Line */}
                  <div className="absolute top-5 left-10 right-10 h-[2px] bg-slate-200 -z-10">
                    <div 
                      className="h-full bg-black transition-all duration-1000" 
                      style={{ width: `${(getStatusIndex(order.status) / 3) * 100}%` }}
                    />
                  </div>
               </div>

               <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">{order.status}</h2>
               </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 border-2 border-slate-50 rounded-[2.5rem]">
                 <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <MapPin size={16} className="text-slate-300" /> Delivery Address
                 </h3>
                 <p className="font-bold text-slate-600 leading-relaxed uppercase text-xs">{order.address}</p>
                 <p className="mt-4 font-black text-sm">{order.phone}</p>
              </div>

              <div className="p-8 border-2 border-slate-50 rounded-[2.5rem]">
                 <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <ShoppingBag size={16} className="text-slate-300" /> Order Summary
                 </h3>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                       <span>Items Total</span>
                       <span>{order.total - order.shippingCharge} TK</span>
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400">
                       <span>Shipping Fee</span>
                       <span>{order.shippingCharge} TK</span>
                    </div>
                    <div className="flex justify-between text-xl font-black border-t pt-2 mt-2">
                       <span className="italic">Grand Total</span>
                       <span>{order.total} TK</span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="mt-12 text-center">
               <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                 Placed on {new Date(order.createdAt).toLocaleString('en-GB')}
               </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}