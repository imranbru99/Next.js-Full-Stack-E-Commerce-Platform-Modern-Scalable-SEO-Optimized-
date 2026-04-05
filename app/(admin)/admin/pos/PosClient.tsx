"use client";

import { useState, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, CheckCircle, X, Printer } from "lucide-react";

export default function PosClient({ products = [] }: { products: any[] }) {
  const [cart, setCart] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: "", phone: "", location: "" });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const addToCart = (product: any, variant: any) => {
    const cartId = `${product.id}-${variant.id}`;
    const existingItem = cart.find((item) => item.cartId === cartId);
    if (existingItem) {
      setCart(cart.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, {
        cartId, id: product.id, variantId: variant.id, name: product.name,
        color: variant.color, size: variant.size, price: variant.price || product.basePrice,
        quantity: 1, image: variant.imageUrl || "/placeholder.jpg"
      }]);
    }
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleConfirmOrder = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pos/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price
          })),
          name: customer.name,
          phone: customer.phone,
          address: customer.location,
          total: total,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderResult(data);
      }
    } catch (error) {
      console.error("Order Failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSale = () => {
    setOrderResult(null);
    setIsModalOpen(false);
    setCart([]);
    setCustomer({ name: "", phone: "", location: "" });
    setSearchQuery("");
  };

  return (
    <>
      {/* BULLETPROOF PRINT CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          #pos-invoice-area, #pos-invoice-area * { visibility: visible; }
          #pos-invoice-area { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100mm; 
            padding: 0;
            margin: 0;
          }
          @page { size: auto; margin: 0mm; }
        }
      `}} />

      <div className="flex h-[calc(100vh-140px)] gap-6 p-4 bg-slate-50">
        {/* LEFT: Product Selection */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" placeholder="SEARCH PRODUCTS..." 
              className="w-full p-5 pl-12 bg-white rounded-2xl shadow-sm font-black uppercase tracking-tighter text-xl outline-none focus:ring-2 focus:ring-black transition-all"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-2">
            {filteredProducts.map(p => (
              <div key={p.id} className="border bg-white p-3 rounded-xl hover:shadow-xl transition-all group flex flex-col">
                <div className="aspect-square overflow-hidden bg-slate-50 mb-2 rounded-lg">
                   <img src={p.variants[0]?.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <p className="text-[10px] font-black uppercase truncate mb-1">{p.name}</p>
                <p className="text-[10px] font-bold text-slate-400 italic mb-3">TK {p.basePrice.toLocaleString()}</p>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {p.variants.map((v:any) => (
                    <button key={v.id} onClick={() => addToCart(p, v)} className="text-[8px] border px-2 py-1 font-black hover:bg-black hover:text-white uppercase transition-colors rounded-md">
                      {v.size} {v.color}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Cart Sidebar */}
        <div className="w-[400px] bg-slate-900 text-white flex flex-col p-6 rounded-[2rem] shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-black uppercase italic text-2xl tracking-tighter">Current Sale</h2>
            <div className="bg-slate-800 p-2 rounded-full"><ShoppingCart size={20} className="text-white" /></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <ShoppingCart size={48} className="mb-2" />
                <p className="font-black uppercase text-xs">Cart Empty</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.cartId} className="flex justify-between items-center text-[11px] border-b border-white/5 pb-4">
                  <div className="max-w-[180px]">
                    <p className="font-black uppercase truncate">{item.name}</p>
                    <p className="text-slate-500 font-bold">{item.size} / {item.color}</p>
                    <p className="font-black italic text-sm mt-1">TK {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                    <button onClick={() => updateQuantity(item.cartId, -1)} className="hover:text-red-400 transition-colors"><Minus size={14}/></button>
                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)} className="hover:text-green-400 transition-colors"><Plus size={14}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pt-6 border-t border-white/10 mt-4">
            <div className="flex justify-between font-black text-2xl italic mb-6">
              <span className="text-slate-500 text-xs not-italic uppercase tracking-widest mt-2">Total Payable</span>
              <span>TK {total.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={cart.length === 0}
              className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-green-400 disabled:bg-slate-800 disabled:text-slate-600 transition-all rounded-2xl"
            >
              Complete Sale
            </button>
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            {!orderResult ? (
              <div className="p-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="font-black uppercase italic tracking-tighter text-4xl">Checkout</h3>
                  <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 p-2 rounded-full hover:rotate-90 transition-transform"><X/></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Customer Name</label>
                    <input type="text" className="w-full bg-slate-50 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-black transition-all font-bold uppercase" 
                           value={customer.name} onChange={(e) => setCustomer({...customer, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Phone Number *</label>
                    <input type="text" className="w-full bg-slate-50 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-black transition-all font-bold" 
                           value={customer.phone} onChange={(e) => setCustomer({...customer, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2 block">Address</label>
                    <input type="text" className="w-full bg-slate-50 rounded-xl px-4 py-4 outline-none focus:ring-2 focus:ring-black transition-all font-bold" 
                           value={customer.location} onChange={(e) => setCustomer({...customer, location: e.target.value})} />
                  </div>
                </div>
                <button 
                  onClick={handleConfirmOrder}
                  disabled={loading || !customer.phone}
                  className="w-full mt-10 py-5 bg-black text-white font-black uppercase tracking-[0.2em] hover:bg-slate-800 disabled:bg-slate-200 transition-all rounded-2xl"
                >
                  {loading ? "Generating Order..." : "Confirm & Pay"}
                </button>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle size={48} />
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter italic mb-4">Success!</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-12">Invoice: #{orderResult.id.slice(-8).toUpperCase()}</p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => window.print()} 
                    className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-200"
                  >
                    <Printer size={20}/> Print Receipt
                  </button>
                  <button 
                    onClick={handleNewSale}
                    className="w-full py-5 bg-slate-100 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-colors"
                  >
                    Start New Sale
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. HIDDEN PRINT INVOICE AREA */}
      <InvoiceReceipt order={orderResult} customer={customer} />
    </>
  );
}

// --- Invoice Receipt Component ---
const InvoiceReceipt = ({ order, customer }: { order: any; customer: any }) => {
  if (!order) return null;

  return (
    <div id="pos-invoice-area" className="hidden print:block p-6 text-black bg-white font-sans">
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter">NEXTECOMMERCE</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest">Official Store Receipt</p>
      </div>

      <div className="text-[11px] mb-6 space-y-1">
        <div className="flex justify-between"><span>ORDER:</span> <span className="font-bold">#{order.id.toUpperCase()}</span></div>
        <div className="flex justify-between"><span>DATE:</span> <span>{new Date().toLocaleString()}</span></div>
        <div className="flex justify-between pt-2 border-t border-dashed mt-2"><span>CUSTOMER:</span> <span className="font-bold">{customer.name || "N/A"}</span></div>
        <div className="flex justify-between"><span>PHONE:</span> <span>{customer.phone}</span></div>
      </div>

      <table className="w-full text-[11px] mb-6">
        <thead className="border-b-2 border-black">
          <tr className="text-left font-black uppercase italic">
            <th className="py-2">Item</th>
            <th className="py-2 text-center">Qty</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dashed divide-slate-300">
          {order.items?.map((item: any, idx: number) => (
            <tr key={idx}>
              <td className="py-3 pr-2">
                <p className="font-black uppercase leading-none">{item.variant?.product?.name || "Product Item"}</p>
                <p className="text-[9px] text-slate-500 mt-1">{item.variant?.size} / {item.variant?.color}</p>
              </td>
              <td className="py-3 text-center font-bold">x{item.quantity}</td>
              <td className="py-3 text-right font-black">{(item.price * item.quantity).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="border-t-2 border-black pt-4">
        <div className="flex justify-between text-lg font-black italic">
          <span>GRAND TOTAL</span>
          <span>TK {order.total.toLocaleString()}</span>
        </div>
      </div>

      <div className="text-center mt-12 border-t border-dashed border-black pt-4">
        <p className="text-[9px] font-black uppercase tracking-widest">Thank you for choosing us</p>
        <p className="text-[10px] font-black uppercase mt-2 italic">*** VISIT AGAIN ***</p>
      </div>
    </div>
  );
};