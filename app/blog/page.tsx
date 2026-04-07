import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronLeft, ChevronRight, Calendar, Tag, ArrowUpRight } from "lucide-react";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

export const metadata: Metadata = {
  title: "Journal | Latest Updates & News",
  description: "Read our latest articles, updates, and insights.",
};

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  
  // Pagination setup
  const currentPage = Number(page) || 1;
  const POSTS_PER_PAGE = 6; // Adjust this number to show more/less posts per page
  const skip = (currentPage - 1) * POSTS_PER_PAGE;

  // 1. Fetch total count for pagination math
  const totalPosts = await prisma.blog.count({
    where: { status: "PUBLISHED" },
  });
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  // 2. Fetch the paginated posts
  const blogs = await prisma.blog.findMany({
    where: { status: "PUBLISHED" },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip: skip,
    take: POSTS_PER_PAGE,
  });

  return (
    <>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-none mb-4">
            The Journal
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Insights, Stories, and Updates
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem]">
            <p className="text-sm font-black uppercase text-slate-400 tracking-widest">No posts available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {blogs.map((blog) => {
              // Format date
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              }).format(new Date(blog.createdAt));

              // Clean description for excerpt (removes HTML tags if any)
              const plainTextDesc = blog.description.replace(/<[^>]*>?/gm, '');
              const excerpt = plainTextDesc.length > 120 
                ? `${plainTextDesc.substring(0, 120)}...` 
                : plainTextDesc;

              return (
                <Link 
                  href={`/blog/${blog.slug}`} 
                  key={blog.id}
                  className="group flex flex-col bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-black transition-all duration-500"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
                    {blog.imageUrl ? (
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-300 font-black uppercase tracking-widest text-[10px]">No Image</span>
                      </div>
                    )}
                    {/* Category Badge Floating */}
                    {blog.category && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                        <Tag size={12} /> {blog.category.name}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <Calendar size={12} /> {formattedDate}
                    </div>
                    
                    <h2 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                      {excerpt}
                    </p>

                    <div className="flex items-center justify-between text-black font-black text-[10px] uppercase tracking-widest border-t border-slate-100 pt-6">
                      Read Article 
                      <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            {/* Previous Button */}
            {currentPage > 1 ? (
              <Link 
                href={`/blog?page=${currentPage - 1}`}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 hover:bg-black hover:text-white transition-all active:scale-95"
              >
                <ChevronLeft size={20} />
              </Link>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-300 cursor-not-allowed">
                <ChevronLeft size={20} />
              </div>
            )}

            {/* Page Indicator */}
            <div className="px-6 py-3 bg-slate-50 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400">
              Page <span className="text-black">{currentPage}</span> of {totalPages}
            </div>

            {/* Next Button */}
            {currentPage < totalPages ? (
              <Link 
                href={`/blog?page=${currentPage + 1}`}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-900 hover:bg-black hover:text-white transition-all active:scale-95"
              >
                <ChevronRight size={20} />
              </Link>
            ) : (
              <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-300 cursor-not-allowed">
                <ChevronRight size={20} />
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}