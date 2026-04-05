"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/lib/store/useCart";
import { useRouter } from "next/navigation";
import { MapPin, Phone, User, Home, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  
  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Phone, Step 2: Full Details

  // Form Data
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [shippingArea, setShippingArea] = useState<"inside" | "outside">("inside");

  const shippingCharge = shippingArea === "inside" ? 80 : 150;
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = subtotal + shippingCharge;

  // Auto-check phone number
  useEffect(() => {
    if (phone.length === 11) {
      checkCustomer(phone);
    } else if (phone.length < 11) {
      setStep(1);
    }
  }, [phone]);

  const checkCustomer = async (num: string) => {
    setIsCheckingUser(true);
    try {
      const res = await fetch(`/api/customers/check?phone=${num}`);
      const data = await res.json();
      if (data.exists) {
        setName(data.name);
        setAddress(data.address);
      }
      setStep(2); // Reveal the rest of the form
    } catch (err) {
      setStep(2);
    } finally {
      setIsCheckingUser(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, phone, address, name, total, shippingCharge }),
      });
      if (response.ok) {
        const order = await response.json();
        clearCart();
        router.push(`/orders/success?id=${order.id}`);
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-12">
          <h1 className="text-4xl font-black tracking-tight mb-2 uppercase">Checkout</h1>
          <p className="text-slate-500 flex items-center gap-2 text-sm">
            <ShieldCheck size={16} className="text-green-500" /> Secure SSL Encrypted Checkout
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: INFORMATION FORM */}
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* STEP 1: CONTACT */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs">1</span>
                    Contact Information
                  </h2>
                  {step === 2 && <CheckCircle2 className="text-green-500" size={24} />}
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Mobile Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      required 
                      type="tel"
                      maxLength={11}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-12 pr-4 py-5 bg-slate-50 border-none rounded-2xl text-xl font-bold focus:ring-2 focus:ring-black transition-all"
                    />
                    {isCheckingUser && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-slate-400" />}
                  </div>
                </div>
              </div>

              {/* STEP 2: SHIPPING DETAILS (REVEALED) */}
              {step === 2 && (
                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                  
                  {/* Shipping Area Cards */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs">2</span>
                      Shipping Method
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        type="button"
                        onClick={() => setShippingArea("inside")}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                          shippingArea === 'inside' ? 'border-black bg-slate-50' : 'border-slate-100 opacity-60'
                        }`}
                      >
                        <p className="font-bold text-slate-900">Inside Dhaka</p>
                        <p className="text-2xl font-black mt-1">80 TK</p>
                        {shippingArea === 'inside' && <CheckCircle2 className="absolute top-4 right-4 text-black" size={20} />}
                      </button>

                      <button 
                        type="button"
                        onClick={() => setShippingArea("outside")}
                        className={`relative p-6 rounded-2xl border-2 text-left transition-all ${
                          shippingArea === 'outside' ? 'border-black bg-slate-50' : 'border-slate-100 opacity-60'
                        }`}
                      >
                        <p className="font-bold text-slate-900">Outside Dhaka</p>
                        <p className="text-2xl font-black mt-1">150 TK</p>
                        {shippingArea === 'outside' && <CheckCircle2 className="absolute top-4 right-4 text-black" size={20} />}
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                      <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center text-xs">3</span>
                      Delivery Address
                    </h2>
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Full Location</label>
                        <div className="relative">
                          <Home className="absolute left-4 top-5 text-slate-400" size={18} />
                          <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, Road, Area details..." className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-black outline-none transition" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-dashed border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 text-green-600 p-3 rounded-2xl"><MapPin size={24} /></div>
                      <div>
                        <p className="font-bold">Cash on Delivery</p>
                        <p className="text-xs text-slate-500 font-medium">পণ্য হাতে পেয়ে টাকা দিন</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded">DEFAULT</span>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:col-span-5">
            <div className="bg-black text-white p-8 rounded-[2rem] shadow-xl sticky top-10">
              <h2 className="text-2xl font-bold mb-8 italic tracking-tighter uppercase">Your Summary</h2>
              
              <div className="space-y-5 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                  <div key={item.variantId} className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex-shrink-0 overflow-hidden">
                      <img src={item.image || ""} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-white/50 uppercase">{item.size} • Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold">{item.price * item.quantity} TK</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Subtotal</span>
                  <span>{subtotal} TK</span>
                </div>
                <div className="flex justify-between text-white/60 text-sm">
                  <span>Delivery Charge</span>
                  <span>{shippingCharge} TK</span>
                </div>
                <div className="flex justify-between text-3xl font-black pt-4 text-white">
                  <span>Total</span>
                  <span className="text-yellow-400">{total} TK</span>
                </div>
              </div>
              
              <button 
                type="submit" 
                form="checkout-form"
                disabled={step < 2 || isProcessing}
                className="w-full bg-white text-black py-5 rounded-2xl font-black text-xl mt-10 hover:bg-yellow-400 transition-all active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-tighter"
              >
                {isProcessing ? "Processing..." : "Place Order Now"}
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
                <ShieldCheck size={14} />
                <span className="text-[10px] uppercase font-bold tracking-widest">100% Authentic Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}