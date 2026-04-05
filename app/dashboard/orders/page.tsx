import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  Package, 
  ChevronRight, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShoppingBag,
  MapPin
} from "lucide-react";

export default async function MyOrdersPage() {
  const session = await getServerSession(authOptions);

  // 1. Guard: If not logged in, send to login
  if (!session) {
    redirect("/login");
  }

  // 2. Fetch all orders for this user
  const orders = await prisma.order.findMany({
    where: { userId: (session.user as any).id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Helper for Status UI
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return { icon: <CheckCircle2 size={14} />, color: "text-green-600 bg-green-50 border-green-100" };
      case "SHIPPED":
        return { icon: <Truck size={14} />, color: "text-blue-600 bg-blue-50 border-blue-100" };
      case "PROCESSING":
        return { icon: <Clock size={14} />, color: "text-orange-600 bg-orange-50 border-orange-100" };
      case "CANCELLED":
        return { icon: <AlertCircle size={14} />, color: "text-red-600 bg-red-50 border-red-100" };
      default:
        return { icon: <Package size={14} />, color: "text-slate-400 bg-slate-50 border-slate-100" };
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-10">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Breadcrumbs & Header */}
        <div className="mb-12">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">
            <Link href="/dashboard" className="hover:text-black">Dashboard</Link>
            <ChevronRight size={10} />
            <span className="text-black">Order History</span>
          </nav>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Order History</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            You have placed {orders.length} orders so far
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-100">
            <ShoppingBag size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-black uppercase text-slate-400 tracking-widest">No orders found yet</p>
            <Link href="/" className="inline-block mt-6 bg-black text-white px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              const status = getStatusDetails(order.status);
              
              return (
                <div 
                  key={order.id} 
                  className="group bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 hover:border-black transition-all duration-500 shadow-sm"
                >
                  {/* Top Row: ID & Status */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black italic">
                        #
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Order ID</p>
                        <p className="font-mono font-bold text-sm tracking-tight">{order.id.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border ${status.color}`}>
                      {status.icon} {order.status}
                    </div>
                  </div>

                  {/* Middle Row: Product Preview */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    
                    <div className="lg:col-span-7">
                      <div className="flex flex-wrap gap-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-3xl border border-slate-100 pr-6">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white shadow-sm flex-shrink-0">
                              <img 
                                src={item.variant?.imageUrl || ""} 
                                className="w-full h-full object-cover" 
                                alt="item" 
                              />
                            </div>
                            <div>
                              <p className="text-[10px] font-black uppercase leading-tight line-clamp-1 max-w-[120px]">
                                {item.variant?.product?.name}
                              </p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase">
                                {item.variant?.size} • QTY: {item.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary Info */}
                    <div className="lg:col-span-5 flex flex-col md:flex-row justify-between items-end gap-6">
                       <div className="text-right md:text-left">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Date</p>
                          <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                       </div>
                       
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-4xl font-black italic tracking-tighter leading-none">{order.total} TK</p>
                       </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                    <Link 
                      href={`/orders/track?id=${order.id}`}
                      className="flex-1 bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-center hover:bg-slate-800 transition active:scale-95"
                    >
                      Track Order Live
                    </Link>
                    <button className="flex-1 border-2 border-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:text-black hover:border-black transition active:scale-95">
                      Download Invoice (PDF)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}