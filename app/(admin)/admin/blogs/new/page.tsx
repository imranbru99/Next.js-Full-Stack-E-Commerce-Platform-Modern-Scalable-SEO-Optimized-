"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Info, FolderTree, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AddBlogPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Taxonomy States
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PUBLISHED");
  
  // Image State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    }
    fetchTaxonomy();
  }, []);

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    const selectedCat = categories.find((c) => c.id === id);
    setFilteredSubcategories(selectedCat?.subcategories || []);
    setSubcategoryId(""); 
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    setSlug(value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return alert("Please select a category");
    setIsLoading(true);

    try {
      let finalImageUrl = "";

      // 1. Upload Image (Using the same logic/folder as products)
      if (imageFile) {
        const formData = new FormData();
        formData.append("type", "blog");
        formData.append("file", imageFile);
        formData.append("slug", slug); 
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        finalImageUrl = data.url;
      }

      // 2. Save Blog Post
      const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          slug, 
          description, 
          status, 
          categoryId,
          subcategoryId: subcategoryId || null,
          imageUrl: finalImageUrl 
        }),
      });

      if (response.ok) {
        router.push("/admin/blogs");
        router.refresh();
      }
    } catch (error) {
      alert("Error creating blog post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b pb-8">
        <div>
          <Link href="/admin/blogs" className="flex items-center gap-2 text-slate-400 hover:text-black transition mb-2 text-sm font-bold">
            <ChevronLeft size={16} /> Back to Blogs
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Write New Post</h1>
        </div>
        <button 
          form="blog-form"
          disabled={isLoading}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> PUBLISH POST</>}
        </button>
      </div>

      <form id="blog-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Info size={20} /> <span className="font-bold text-xs uppercase tracking-widest">Post Content</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Post Title</label>
                <input 
                  required 
                  value={title} 
                  onChange={handleTitleChange} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold focus:ring-2 focus:ring-black outline-none transition" 
                  placeholder="e.g. Top 10 Fashion Trends" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Slug (Automatic)</label>
                <input 
                  readOnly 
                  value={slug} 
                  className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-slate-400 font-mono text-sm" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Content</label>
              <textarea 
                required 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={12} 
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 leading-relaxed focus:ring-2 focus:ring-black outline-none transition resize-y"
                placeholder="Write your blog post content here... (HTML supported if using a rich text editor later)"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Settings & Image */}
        <div className="lg:col-span-4 space-y-8">
          {/* Feature Image */}
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2">
              <ImageIcon size={16} className="text-purple-500" /> Feature Image
            </h2>
            <div className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Upload Image</span>
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          {/* Organization */}
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase text-slate-400 flex items-center gap-2">
              <FolderTree size={16} className="text-blue-500" /> Organization
            </h2>
            <div className="space-y-4">
              <select 
                required
                value={categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select 
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={!categoryId}
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="">None / Select Sub</option>
                {filteredSubcategories.map(sub => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>

              <div className="pt-6 border-t">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Visibility Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-black outline-none cursor-pointer"
                >
                  <option value="PUBLISHED">🚀 PUBLISHED</option>
                  <option value="PENDING">⏳ DRAFT</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}