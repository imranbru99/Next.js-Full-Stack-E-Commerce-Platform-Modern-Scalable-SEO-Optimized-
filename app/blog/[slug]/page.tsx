import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ChevronLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import Header from "@/components/storefront/Header";
import Footer from "@/components/storefront/Footer";

// 1. DYNAMIC METADATA GENERATOR
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { title: true, description: true, imageUrl: true }
  });

  if (!blog) return { title: "Post Not Found" };

  const cleanDescription = blog.description.replace(/<[^>]*>?/gm, '').slice(0, 160);

  return {
    title: `${blog.title} | Blog`,
    description: cleanDescription,
    openGraph: {
      title: blog.title,
      description: cleanDescription,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    }
  };
}

// 2. PAGE COMPONENT
export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug: slug },
    include: { 
      category: true,
      subcategory: true
    }
  });

  if (!blog) return notFound();

  // Format date nicely
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  }).format(new Date(blog.createdAt));

  return (
    <>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition mb-8">
          <ChevronLeft size={16} /> Back to Journal
        </Link>

        <article className="space-y-10">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <span className="flex items-center gap-1.5"><Tag size={12}/> {blog.category?.name}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="flex items-center gap-1.5"><Calendar size={12}/> {formattedDate}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85]">
              {blog.title}
            </h1>
          </div>

          {/* Feature Image */}
          {blog.imageUrl && (
            <div className="w-full aspect-[21/9] bg-slate-50 rounded-[2.5rem] overflow-hidden">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-a:text-black prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </article>
      </main>

      <Footer />
    </>
  );
}