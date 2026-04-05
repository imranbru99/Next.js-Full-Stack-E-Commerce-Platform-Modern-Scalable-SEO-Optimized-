import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, Package, Layers, Eye } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function AdminProducts() {
  // 1. Fetch Products and Store Settings in parallel
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      include: { variants: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.storeSettings.findUnique({
      where: { id: "1" }
    })
  ]);

  // Fallback for currency symbol if settings are not yet configured
  const symbol = settings?.currencySymbol || "TK";

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 py-10 border-b border-slate-100">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Catalog</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            Manage {products.length} Products in your store
          </p>
        </div>
        
        <Link 
          href="/admin/products/new" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} /> Add New Product
        </Link>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {products.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <Package size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-black uppercase text-slate-400 tracking-widest">No products found</p>
            <Link href="/admin/products/new" className="text-black text-xs font-bold underline mt-2 block">Create your first product</Link>
          </div>
        ) : (
          products.map((product) => {
            const firstImage = product.variants.find(v => v.imageUrl)?.imageUrl;
            const totalStock = product.variants.reduce((acc, v) => acc + v.stock, 0);

            return (
              <div 
                key={product.id} 
                className="group bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] hover:border-black transition-all duration-500 flex flex-col md:flex-row items-center gap-8"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 flex-shrink-0">
                  {firstImage ? (
                    <img src={firstImage} className="w-full h-full object-cover" alt={product.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <Package size={24}/>
                    </div>
                  )}
                </div>

                {/* Name & Details */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-2">
                    {product.name}
                  </h3>
                  <div className="mb-3">
                    <StatusBadge productId={product.id} initialStatus={product.status} />
                  </div>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Layers size={12} /> {product.variants.length} Variants
                    </span>
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${totalStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {totalStock > 0 ? `Stock: ${totalStock}` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* DYNAMIC PRICING SECTION */}
                <div className="flex flex-col items-center md:items-end px-8 border-x-0 md:border-x border-slate-100 min-w-[180px]">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Base Price</p>
                  <p className="text-3xl font-black tracking-tighter italic">
                    <span className="text-lg mr-1 font-bold not-italic text-slate-400">
                      {symbol}
                    </span>
                    {product.basePrice.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link 
                    href={`/admin/products/${product.id}/edit`} 
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
                    title="Edit Product"
                  >
                    <Edit size={20} />
                  </Link>
                  <Link 
                    href={`/${product.slug}`} 
                    target="_blank"
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="View on Store"
                  >
                    <Eye size={20} />
                  </Link>
                  <button 
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}