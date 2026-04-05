import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image"; // Highly recommended for Next.js optimization

export default async function SearchContent({ query }: { query: string }) {
  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 uppercase tracking-widest text-sm font-bold">
          Please enter a search term.
        </p>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { description: { contains: query } },
      ],
      // status: "PUBLISHED", // Ensure this matches your admin panel logic
    },
    include: {
      variants: true,
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-12 border-b pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">
          Search: <span className="text-slate-400">"{query}"</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-widest uppercase">
          {products.length} Products Found
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">
            No products match your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => {
            // Get the first variant's image or a fallback
            const displayImage = product.variants[0]?.imageUrl || "/placeholder.jpg";
            
            return (
              <Link 
                key={product.id} 
                href={`/${product.slug}`}
                className="group flex flex-col"
              >
                {/* Image Container */}
                <div className="aspect-[3/4] overflow-hidden bg-slate-100 relative mb-4 border border-slate-100">
                  <img
                    src={displayImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Quick Look Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info Area */}
                <div className="space-y-1">
                  <h3 className="font-black uppercase text-xs tracking-tighter leading-none group-hover:text-slate-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {product.variants.length} Options Available
                  </p>
                  <div className="pt-2 flex items-baseline gap-1">
                    <span className="text-[10px] font-bold">TK</span>
                    <span className="text-lg font-black italic tracking-tighter">
                      {product.basePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}