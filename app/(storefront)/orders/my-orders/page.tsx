"use client";

import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle2, Clock, ChevronRight, ShoppingBag, MapPin } from "lucide-react";
import Link from "next/link";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders/my-orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setIsLoading(false);
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "text-green-600 bg-green-50";
      case "SHIPPED": return "text-blue-600 bg-blue-50";
      case "PROCESSING": return "text-orange-600 bg-orange-50";
      case "CANCELLED": return "text-red-600 bg-red-50";
      default: return "text-slate-400 bg-slate-50";
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse font-black text-xl tracking-tighter italic">LOADING YOUR ORDERS...</div>
    </div>
  );

  if (orders.length === 0) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <ShoppingBag size={64} className="text-slate-100 mb-6" />
      <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">No Orders Found</h1>
      <p className="text-slate-400 max-w-xs mb-8 font-medium">You haven't placed any orders yet. Start shopping to see them here!</p>
      <Link href="/" className="bg-black text-white px-10 py-4 rounded-full font-black uppercase text-sm hover:scale-105 transition-transform">
        Explore Products
      </Link>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-2">My Orders</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Track your deliveries & history</p>
        </div>

        <div className="space-y-10">
          {orders.map((order: any) => (
            <div key={order.id} className="group border-2 border-slate-50 rounded-[2.5rem] p-8 hover:border-black transition-all duration-500 shadow-sm">
              
              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Order Number</p>
                  <p className="font-mono font-bold text-lg">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex-shrink-0 w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <img src={item.variant?.imageUrl} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="product" />
                  </div>
                ))}
              </div>

              {/* Progress Tracker Bar */}
              <div className="relative h-1 bg-slate-50 rounded-full mb-10 mt-4 overflow-hidden">
                <div 
                  className={`absolute top-0 left-0 h-full bg-black transition-all duration-1000`}
                  style={{ width: order.status === 'DELIVERED' ? '100%' : order.status === 'SHIPPED' ? '66%' : order.status === 'PROCESSING' ? '33%' : '5%' }}
                />
              </div>

              {/* Footer Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-50">
                <div className="flex items-start gap-3">
                   <MapPin className="text-slate-300" size={18} />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivery To</p>
                      <p className="text-xs font-bold text-slate-600 leading-tight">{order.address}</p>
                   </div>
                </div>
                
                <div className="flex items-start gap-3">
                   <Clock className="text-slate-300" size={18} />
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p>
                      <p className="text-xs font-bold text-slate-600">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                   </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount Paid</p>
                  <p className="text-3xl font-black tracking-tighter italic">{order.total} TK</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8">
                <button className="w-full py-4 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white hover:border-black transition-all">
                  View Full Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}