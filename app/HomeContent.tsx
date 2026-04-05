import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  // 1. Fetch Store Settings for Currency
  const s = await prisma.storeSettings.findUnique({ where: { id: "1" } });
  const symbol = s?.currencySymbol || "TK";

  // 2. Fetch all sections in parallel for maximum speed
  const [latestProducts, trendingProducts, featuredCategories] = await Promise.all([
    prisma.product.findMany({ 
      take: 4, 
      orderBy: { createdAt: 'desc' }, 
      include: { variants: { take: 1 } } 
    }),
    prisma.product.findMany({ 
      take: 4, 
      orderBy: { createdAt: 'asc' }, 
      include: { variants: { take: 1 } } 
    }),
    prisma.category.findMany({ take: 3 })
  ]);

  return (
    <div className="pb-20 space-y-32">
      
      {/* 01. HERO SECTION - Massive Typography */}
      <section className="h-[85vh] bg-slate-100 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070" 
            className="w-full h-full object-cover opacity-60" 
            alt="Premium Collection Banner" 
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-8xl md:text-[12rem] font-black italic uppercase tracking-tighter leading-[0.8] mb-8">
            Pure <br/> Quality.
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-12 text-slate-600">
            The 2026 Bangladesh Collection — Locally Crafted
          </p>
          <Link 
            href="#latest" 
            className="inline-block bg-black text-white text-[11px] font-black uppercase tracking-[0.2em] px-14 py-6 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-200"
          >
            Shop Latest Drop
          </Link>
        </div>
      </section>

      {/* 02. CATEGORY SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredCategories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} className="group relative h-[550px] bg-slate-200 overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/60 transition-all duration-700 z-10" />
            <div className="absolute inset-0 flex flex-col justify-end p-12 z-20 text-white">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{cat.name}</h3>
              <p className="text-[10px] font-black uppercase tracking-widest mt-4 border-b-2 border-white w-fit pb-1 group-hover:pr-4 transition-all">
                Explore Collection
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* 03. LATEST DROP SECTION */}
      <section id="latest" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-slate-100 pb-10 gap-6">
          <div>
            <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Latest Drop</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Fresh arrivals for your daily rotation</p>
          </div>
          <Link href="/all" className="text-[11px] font-black uppercase tracking-widest underline decoration-2 underline-offset-8 hover:text-blue-600 transition-colors">
            View All Items
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
          {latestProducts.map((p) => (
            <ProductCard key={p.id} p={p} symbol={symbol} />
          ))}
        </div>
      </section>

      {/* 04. TRENDING (HIGH CONTRAST DARK MODE) */}
      <section className="bg-slate-950 py-32 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-16 border-b border-slate-800 pb-10">
            <div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">Trending Now</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">Curated by our creative studio</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {trendingProducts.map((p) => (
              <ProductCard key={p.id} p={p} symbol={symbol} dark />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

/**
 * Internal Reusable Product Card
 * Styled for the "Premium" Storefront
 */
function ProductCard({ p, symbol, dark = false }: any) {
  const imageUrl = p.variants[0]?.imageUrl || "https://placehold.co/600x800?text=No+Image";
  
  return (
    <Link href={`/${p.slug}`} className="group flex flex-col">
      <div className="aspect-[3/4] bg-slate-100 overflow-hidden mb-8 relative border border-transparent group-hover:border-slate-200 transition-all">
        <img 
          src={imageUrl} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
          alt={p.name} 
        />
        {/* Dynamic Badge Example */}
        {p.basePrice > 2000 && (
          <div className="absolute top-4 left-4 bg-white text-black px-3 py-1 text-[8px] font-black uppercase tracking-tighter">
            Exclusive
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className={`text-xs font-black uppercase tracking-tight leading-tight ${dark ? 'text-white' : 'text-black'}`}>
          {p.name}
        </h3>
        <p className="text-[11px] font-black italic tracking-tighter text-slate-400">
          <span className="not-italic mr-1 text-[10px] font-bold opacity-50">{symbol}</span>
          {p.basePrice.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}