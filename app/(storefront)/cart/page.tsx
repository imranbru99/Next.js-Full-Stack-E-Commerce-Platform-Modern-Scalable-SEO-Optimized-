"use client";

import { useCart } from "@/lib/store/useCart";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsContext"; // Import Global Settings

export default function CartPage() {
  const { items, addItem, removeItem, clearCart } = useCart();
  const { currencySymbol } = useSettings(); // Use dynamic symbol (৳, $, etc.)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Free shipping over 1500 logic (matching your announcement bar)
  const shipping = subtotal > 1500 ? 0 : 100; 
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-slate-50 p-10 rounded-full mb-8">
          <ShoppingBag size={64} className="text-slate-200" />
        </div>
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Your Bag is Empty</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-10 text-center max-w-xs leading-loose">
          Looks like you haven't added any premium pieces to your collection yet.
        </p>
        <Link href="/" className="bg-black text-white px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
          Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b pb-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
            Your Bag
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-4">
            Review your selection ({items.length} Items)
          </p>
        </div>
        <button 
          onClick={clearCart} 
          className="text-[9px] font-black uppercase tracking-widest text-slate-300 hover:text-red-500 transition-colors underline underline-offset-8 decoration-2"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left: Item List */}
        <div className="lg:col-span-8 space-y-10">
          {items.map((item) => (
            <div key={item.variantId} className="flex flex-col sm:flex-row gap-8 group">
              {/* Product Image */}
              <div className="w-full sm:w-40 aspect-[3/4] bg-slate-50 overflow-hidden flex-shrink-0 relative border border-slate-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              
              {/* Product Details */}
              <div className="flex flex-col flex-1 justify-between py-2">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-black text-xl uppercase italic tracking-tight">{item.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {item.color} {item.size && ` / Size: ${item.size}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 text-slate-300 hover:text-black transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-8">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-slate-100 bg-white">
                    <button 
                       onClick={() => removeItem(item.variantId)} // Note: You should implement a "decrement" function in useCart
                       className="p-3 hover:bg-slate-50 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-6 text-xs font-black">{item.quantity}</span>
                    <button 
                       onClick={() => addItem({...item, quantity: 1})}
                       className="p-3 hover:bg-slate-50 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  
                  {/* Price */}
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Total</p>
                    <p className="font-black text-2xl italic tracking-tighter">
                      <span className="text-sm not-italic mr-1">{currencySymbol}</span>
                      {(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-slate-50 p-10 sticky top-32 border border-slate-100">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-10 text-slate-400">Order Summary</h2>
            
            <div className="space-y-6 mb-10 border-b border-slate-200 pb-10">
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Subtotal</span>
                <span className="font-black text-lg italic tracking-tight">
                    {currencySymbol} {subtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Shipping</span>
                <span className="font-black text-lg italic tracking-tight">
                  {shipping === 0 ? "FREE" : `${currencySymbol} ${shipping.toLocaleString()}`}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-12">
              <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
              <span className="text-4xl font-black italic tracking-tighter">
                <span className="text-lg not-italic mr-2 text-slate-400">{currencySymbol}</span>
                {total.toLocaleString()}
              </span>
            </div>

            <Link 
              href="/checkout" 
              className="w-full bg-black text-white py-6 text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200"
            >
              Begin Checkout <ArrowRight size={18} />
            </Link>

            <div className="mt-8 text-center">
               <p className="text-[9px] text-slate-300 font-bold uppercase tracking-[0.4em] leading-loose">
                 Safe & Secure Transactions <br/> Verified by Nextecommerce
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}