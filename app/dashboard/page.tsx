import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  ChevronRight, 
  Package, 
  CreditCard, 
  Search, 
  ArrowRight,
  LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  const userOrders = await prisma.order.findMany({
    where: { userId: (session?.user as any).id },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="bg-white min-h-screen pb-20 pt-10 font-sans">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-50 pb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">
              Welcome, {session?.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
              Personal Account Dashboard
            </p>
          </div>
          
          {/* Shop Now Primary Button */}
          <Link 
            href="/" 
            className="bg-black text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition shadow-2xl shadow-slate-200 flex items-center gap-3 active:scale-95"
          >
            Shop Now <ShoppingBag size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-10 border-2 border-slate-50 rounded-[3rem] bg-slate-50/30 group hover:border-black transition-all duration-500">
                  <Package className="text-slate-300 group-hover:text-black mb-6 transition-colors" size={32} />
                  <p className="text-5xl font-black italic tracking-tighter">{userOrders.length}</p>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">Total Orders</p>
               </div>
               <div className="p-10 border-2 border-slate-50 rounded-[3rem] bg-slate-50/30 group hover:border-black transition-all duration-500">
                  <CreditCard className="text-slate-300 group-hover:text-black mb-6 transition-colors" size={32} />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Default Payment</p>
                  <p className="text-xl font-black mt-1 italic uppercase">Cash on Delivery</p>
               </div>
            </div>

            {/* Recent Orders List */}
            <div className="bg-white border-2 border-slate-50 rounded-[3.5rem] p-10">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Recent Activity</h2>
                <Link href="/dashboard/orders" className="text-[10px] font-black uppercase tracking-widest underline underline-offset-8 decoration-slate-200 hover:decoration-black transition-all">
                  View All Orders
                </Link>
              </div>
              
              <div className="space-y-4">
                {userOrders.length > 0 ? userOrders.map((order) => (
                  <Link 
                    href={`/orders/track?id=${order.id}`} 
                    key={order.id} 
                    className="flex items-center justify-between p-8 border-2 border-slate-50 rounded-[2.5rem] hover:border-black transition-all duration-500 group bg-white"
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-black group-hover:text-white transition-all">
                        <ShoppingBag size={24}/>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase tracking-tighter">Order #{order.id.slice(-6)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-xl font-black italic tracking-tighter">{order.total} TK</p>
                       <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-lg border border-green-100">
                         {order.status}
                       </span>
                    </div>
                  </Link>
                )) : (
                  <div className="text-center py-10">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No orders found yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <div className="space-y-8">
            <div className="bg-white border-2 border-slate-50 rounded-[3.5rem] p-10 sticky top-24 shadow-sm">
               <div className="flex items-center gap-5 mb-10">
                 <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center font-black text-xl italic shadow-xl shadow-slate-200">
                   {session?.user?.name?.charAt(0)}
                 </div>
                 <div>
                   <h3 className="font-black text-lg uppercase tracking-tighter leading-none">{session?.user?.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 mt-1 truncate max-w-[150px]">{session?.user?.email}</p>
                 </div>
               </div>
               
               <div className="space-y-3">
                  <DashboardLink href="/dashboard/orders" icon={<Package size={18} />} label="My Orders" />
                  
                  {/* Track Order Button */}
                  <DashboardLink 
                    href="/orders/track" 
                    icon={<Search size={18} />} 
                    label="Track Order" 
                    highlight 
                  />
                  
                  <DashboardLink href="/dashboard/profile" icon={<User size={18} />} label="Settings" />
                  
                  <div className="pt-6 mt-6 border-t border-slate-50">
                    <button className="flex items-center justify-between w-full p-5 hover:bg-red-50 text-red-600 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
                      Sign Out <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Navigation Link Component
function DashboardLink({ href, icon, label, highlight = false }: { href: string, icon: any, label: string, highlight?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all font-black text-[10px] uppercase tracking-[0.2em] group border-2 ${
        highlight 
        ? "bg-slate-900 text-white border-black shadow-lg shadow-slate-200" 
        : "hover:bg-slate-50 text-slate-400 hover:text-black border-transparent"
      }`}
    >
      <span className="flex items-center gap-4">
        {icon}
        {label}
      </span>
      <ArrowRight size={16} className={`group-hover:translate-x-1 transition-transform ${highlight ? 'text-white' : 'text-slate-200 group-hover:text-black'}`} />
    </Link>
  );
}