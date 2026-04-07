import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2, FileText, Eye, Calendar, Tag } from "lucide-react";

export default async function AdminBlogs() {
  const blogs = await prisma.blog.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 py-10 border-b border-slate-100">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Journal</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
            Manage {blogs.length} published & drafted posts
          </p>
        </div>
        
        <Link 
          href="/admin/blogs/new" 
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={18} /> Write New Post
        </Link>
      </div>

      {/* Blogs List */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <FileText size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-black uppercase text-slate-400 tracking-widest">No posts found</p>
            <Link href="/admin/blogs/new" className="text-black text-xs font-bold underline mt-2 block">Start writing your first post</Link>
          </div>
        ) : (
          blogs.map((blog) => {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short', day: 'numeric', year: 'numeric'
            }).format(new Date(blog.createdAt));

            return (
              <div 
                key={blog.id} 
                className="group bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] hover:border-black transition-all duration-500 flex flex-col md:flex-row items-center gap-8"
              >
                {/* Thumbnail */}
                <div className="w-32 h-24 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} className="w-full h-full object-cover" alt={blog.title} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <FileText size={24}/>
                    </div>
                  )}
                </div>

                {/* Name & Details */}
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-xl font-black uppercase tracking-tighter leading-none mb-3">
                    {blog.title}
                  </h3>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg ${
                      blog.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {blog.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Tag size={12} /> {blog.category?.name || "Uncategorized"}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Calendar size={12} /> {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 px-4">
                  <Link 
                    href={`/admin/blogs/${blog.id}/edit`} 
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
                    title="Edit Post"
                  >
                    <Edit size={20} />
                  </Link>
                  <Link 
                    href={`/blog/${blog.slug}`} 
                    target="_blank"
                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-90"
                    title="View Post"
                  >
                    <Eye size={20} />
                  </Link>
                  {/* Note: In a production app, wrap this in a form or a client component for the onClick delete handler */}
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