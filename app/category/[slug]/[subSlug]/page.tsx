import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export default async function SubcategoryPage({ 
  params 
}: { 
  params: Promise<{ slug: string, subSlug: string }> 
}) {
  const { slug, subSlug } = await params;

  // 1. Fetch the Subcategory and its products
  const subcategory = await prisma.subcategory.findUnique({
    where: { slug: subSlug },
    include: {
      category: { include: { subcategories: true } },
      products: {
        include: { variants: { take: 1 } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!subcategory) return notFound();

  // 2. Fetch Currency Symbol
  const settings = await prisma.storeSettings.findUnique({ where: { id: "1" } });
  const symbol = settings?.currencySymbol || "TK";

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-24">
          <header className="mb-20 text-center">
            {/* Breadcrumb style path */}
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6">
              {subcategory.category.name} <span className="mx-2">/</span> {subcategory.name}
            </p>
            
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-12 leading-none">
              {subcategory.name}
            </h1>

            {/* Subcategory Filter Bar (Highlighting the active subcategory) */}
            <div className="flex flex-wrap justify-center gap-3">
              {subcategory.category.subcategories.map((sub) => (
                <Link 
                  key={sub.id}
                  href={`/category/${subcategory.category.slug}/${sub.slug}`}
                  className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                    sub.slug === subSlug 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-slate-100 hover:border-black"
                  }`}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </header>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
            {subcategory.products.map((product) => (
              <Link href={`/${product.slug}`} key={product.id} className="group flex flex-col">
                 <div className="aspect-[3/4] bg-slate-50 overflow-hidden mb-6 relative border border-transparent group-hover:border-slate-100 transition-all">
                  {product.variants[0]?.imageUrl && (
                    <img 
                      src={product.variants[0].imageUrl} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                      alt={product.name} 
                    />
                  )}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-xs font-black uppercase tracking-tight text-black leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-[11px] font-black italic tracking-tighter text-slate-400">
                    <span className="not-italic mr-1 opacity-50">{symbol}</span> 
                    {product.basePrice.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {subcategory.products.length === 0 && (
            <div className="py-40 text-center border-t border-slate-50">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
                — Collection coming soon —
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}