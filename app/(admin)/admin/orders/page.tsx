"use client";

import { useEffect, useState } from "react";
import { 
  Search, Package, Truck, CheckCircle2, Clock, 
  Download, Filter, Phone, MapPin, XCircle, ChevronRight 
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/orders");
    const data = await res.json();
    setOrders(data);
    applyFilters(data, search, activeFilter);
    setLoading(false);
  };

  // Logic to handle both Search and Status Filtering together
  const applyFilters = (allOrders: any[], query: string, status: string) => {
    let filtered = allOrders;

    if (status !== "ALL") {
      filtered = filtered.filter(o => o.status === status);
    }

    if (query) {
      filtered = filtered.filter(o => 
        o.phone.includes(query) || 
        o.user.name.toLowerCase().includes(query.toLowerCase()) ||
        o.id.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleFilterChange = (status: string) => {
    setActiveFilter(status);
    applyFilters(orders, search, status);
  };

  const handleSearchChange = (query: string) => {
    setSearch(query);
    applyFilters(orders, query, activeFilter);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchOrders();
  };

  // --- CSV EXPORT LOGIC ---
  const exportToCSV = () => {
    const headers = ["Order ID", "Customer", "Phone", "Address", "Total (TK)", "Status", "Date"];
    const rows = filteredOrders.map(o => [
      o.id.slice(-8).toUpperCase(),
      o.user.name,
      o.phone,
      `"${o.address.replace(/"/g, '""')}"`, // Wrap address in quotes for CSV safety
      o.total,
      o.status,
      new Date(o.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `orders_${activeFilter.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-20 font-black animate-pulse">SYNCING DATABASE...</div>;

  return (
    <div className="bg-white min-h-screen pb-20 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8 py-10 border-b">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Orders</h1>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {filteredOrders.length} {activeFilter !== 'ALL' ? activeFilter : ''} Orders Found
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              placeholder="Search Customer..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-5 py-4 bg-slate-50 border-none rounded-2xl font-bold focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>
          <button 
            onClick={exportToCSV}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-xl shadow-slate-200"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeFilter === status 
              ? 'bg-black text-white shadow-lg' 
              : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order: any) => (
          <div key={order.id} className="group border-2 border-slate-50 rounded-[3rem] p-10 hover:border-black transition-all duration-500 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Customer */}
              <div className="lg:col-span-3">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Recipient</span>
                <h3 className="font-black text-xl uppercase tracking-tighter mb-1">{order.user.name}</h3>
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-400 flex items-center gap-2 tracking-tight">
                    <Phone size={14} className="text-slate-200" /> {order.phone}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed flex items-start gap-2">
                    <MapPin size={14} className="text-slate-200 flex-shrink-0" /> {order.address}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="lg:col-span-4 border-l border-slate-50 pl-10">
                 <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-4">Cart Contents</span>
                 <div className="space-y-4">
                   {order.items.map((item: any, i: number) => (
                     <div key={i} className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                          <img src={item.variant?.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase leading-tight line-clamp-1">{item.variant?.product?.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{item.variant?.size} • {item.variant?.color} • QTY: {item.quantity}</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Summary */}
{/* Summary Section */}
<div className="lg:col-span-2 border-l border-slate-50 pl-10">
  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-2">Bill Breakdown</span>
  
  <div className="space-y-1 mb-4">
    <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
      <span>Items:</span>
      <span>{order.total - order.shippingCharge} TK</span>
    </div>
    <div className="flex justify-between text-[10px] font-black text-blue-500 uppercase tracking-tight">
      <span>Shipping:</span>
      <span>+{order.shippingCharge} TK</span>
    </div>
  </div>

  <p className="text-3xl font-black italic tracking-tighter text-black leading-none">
    {order.total} <span className="text-xs not-italic font-bold">TK</span>
  </p>

  <div className="mt-6">
    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Current Status</span>
    <div className={`inline-block px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest border ${
      order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border-green-100' : 
      order.status === 'PENDING' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-orange-50 text-orange-600 border-orange-100'
    }`}>
      {order.status}
    </div>
  </div>
</div>

              {/* Actions */}
              <div className="lg:col-span-3 flex flex-col gap-2">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-2">Change Order State</span>
                <div className="grid grid-cols-2 gap-2">
                  <ActionButton label="Process" active={order.status === 'PROCESSING'} onClick={() => updateStatus(order.id, 'PROCESSING')} color="hover:bg-orange-500" />
                  <ActionButton label="Ship" active={order.status === 'SHIPPED'} onClick={() => updateStatus(order.id, 'SHIPPED')} color="hover:bg-blue-500" />
                  <ActionButton label="Deliver" active={order.status === 'DELIVERED'} onClick={() => updateStatus(order.id, 'DELIVERED')} color="hover:bg-green-500" />
                  <ActionButton label="Cancel" active={order.status === 'CANCELLED'} onClick={() => updateStatus(order.id, 'CANCELLED')} color="hover:bg-red-500" />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButton({ label, active, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`py-3 rounded-2xl font-black text-[8px] uppercase tracking-widest transition-all border-2 ${
        active 
        ? 'bg-black text-white border-black' 
        : `bg-white text-slate-400 border-slate-50 ${color} hover:text-white hover:border-transparent`
      }`}
    >
      {label}
    </button>
  );
}