import { prisma } from "@/lib/prisma";
import { 
  Package, ShoppingCart, Users, Banknote, 
  Truck, TrendingUp, AlertTriangle, PackageX, ArrowRight 
} from "lucide-react";
import RevenueChart from "@/components/admin/RevenueChart";
import Link from "next/link";

export default async function AdminDashboard() {
  // 1. BASIC STATS
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.user.count();

  // 2. REVENUE LOGIC (Delivered Only)
  const deliveredOrders = await prisma.order.findMany({
    where: { status: "DELIVERED" }
  });

  // Net Revenue = Total - Shipping Charge
  const totalNetRevenue = deliveredOrders.reduce((sum, o) => sum + (o.total - o.shippingCharge), 0);
  const totalShippingCollected = deliveredOrders.reduce((sum, o) => sum + o.shippingCharge, 0);

  // 3. INVENTORY ALERTS (Stock Out)
  const outOfStockItems = await prisma.variant.findMany({
    where: { stock: { lte: 0 } },
    include: { product: true },
    take: 6 // Show top 6 critical items
  });
  const outOfStockCount = await prisma.variant.count({ where: { stock: { lte: 0 } } });

  // 4. CHART DATA (Last 7 Days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const dailyData = await Promise.all(last7Days.map(async (date) => {
    const dayOrders = await prisma.order.findMany({
      where: {
        status: "DELIVERED",
        createdAt: {
          gte: new Date(date),
          lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });
    const rev = dayOrders.reduce((sum, o) => sum + (o.total - o.shippingCharge), 0);
    return { 
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }), 
      revenue: rev 
    };
  }));

  const stats = [
    { title: "Net Revenue", value: `৳${totalNetRevenue.toLocaleString()}`, icon: Banknote, color: "text-green-600 bg-green-50" },
    { title: "Shipping Fee", value: `৳${totalShippingCollected.toLocaleString()}`, icon: Truck, color: "text-blue-600 bg-blue-50" },
    { title: "Total Orders", value: totalOrders, icon: ShoppingCart, color: "text-orange-600 bg-orange-50" },
    { title: "Stock Alerts", value: outOfStockCount, icon: AlertTriangle, color: outOfStockCount > 0 ? "text-red-600 bg-red-50 animate-pulse" : "text-slate-400 bg-slate-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">Overview</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3 ml-1">
          Business Intelligence & Store Performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 flex flex-col gap-4 hover:border-black transition-all group">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black italic tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CRITICAL STOCK NOTIFICATION (Only shows if stock < 0) */}
      {outOfStockCount > 0 && (
        <div className="mb-12 bg-red-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-red-100 relative overflow-hidden">
          <PackageX size={220} className="absolute -right-10 -bottom-10 opacity-10 rotate-12" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <AlertTriangle size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Inventory Critical</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {outOfStockItems.map((variant: any) => (
                <div key={variant.id} className="bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex items-center justify-between group/item">
                  <div className="overflow-hidden">
                    <p className="text-[9px] font-black uppercase tracking-widest text-white/50 mb-1">Restock Required</p>
                    <h4 className="font-black text-sm uppercase truncate">{variant.product.name}</h4>
                    <p className="text-[10px] font-bold text-white/70 uppercase">{variant.color} • {variant.size}</p>
                  </div>
                  <Link 
                    href={`/admin/products/${variant.productId}/edit`}
                    className="p-3 bg-white text-red-600 rounded-xl hover:bg-black hover:text-white transition-all shadow-xl active:scale-90"
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
               <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Showing {outOfStockItems.length} of {outOfStockCount} missing items</p>
               <Link href="/admin/products" className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition">Manage All Inventory</Link>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Sales Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border-2 border-slate-50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Revenue Flow</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Sales (excluding shipping)</p>
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 text-green-600 font-black text-[10px] uppercase">
              <TrendingUp size={14}/> Live Sync
            </div>
          </div>
          <RevenueChart data={dailyData} type="daily" />
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          {/* Quick Stats Sidebar */}
          <div className="bg-black text-white p-10 rounded-[3rem] shadow-xl h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Metrics</h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-10">Global Store Health</p>
              
              <div className="space-y-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/40 mb-1 tracking-widest">Total Users</span>
                    <span className="text-xs font-black uppercase">Active Accounts</span>
                  </div>
                  <span className="text-4xl font-black italic tracking-tighter">{totalUsers}</span>
                </div>

                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black uppercase text-white/40 mb-1 tracking-widest">Total Products</span>
                    <span className="text-xs font-black uppercase">Live in Catalog</span>
                  </div>
                  <span className="text-4xl font-black italic tracking-tighter">{totalProducts}</span>
                </div>
              </div>
            </div>

            <Link href="/admin/products" className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-200 transition text-center mt-10">
              Manage Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}