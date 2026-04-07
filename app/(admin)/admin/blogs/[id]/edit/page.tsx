"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Info, FolderTree, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params); // Unwrap the promise
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

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

  // Fetch Taxonomies & Existing Blog Data
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData);

        // Fetch Existing Blog
        const blogRes = await fetch(`/api/blogs/${id}`);
        if (!blogRes.ok) throw new Error("Blog not found");
        const blogData = await blogRes.json();

        setTitle(blogData.title);
        setSlug(blogData.slug);
        setDescription(blogData.description);
        setStatus(blogData.status);
        setCategoryId(blogData.categoryId);
        setSubcategoryId(blogData.subcategoryId || "");
        
        if (blogData.imageUrl) {
          setImagePreview(blogData.imageUrl);
        }

        // Set subcategories based on fetched category
        const selectedCat = catData.find((c: any) => c.id === blogData.categoryId);
        setFilteredSubcategories(selectedCat?.subcategories || []);

      } catch (error) {
        console.error(error);
        alert("Failed to load data");
      } finally {
        setIsFetching(false);
      }
    }
    loadData();
  }, [id]);

  const handleCategoryChange = (catId: string) => {
    setCategoryId(catId);
    const selectedCat = categories.find((c) => c.id === catId);
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
      let finalImageUrl = undefined; // Undefined means it won't overwrite the existing image in DB

      // If a NEW image was selected, upload it
      if (imageFile) {
        const formData = new FormData();
        formData.append("type", "blog");
        formData.append("file", imageFile);
        formData.append("slug", slug); 
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        finalImageUrl = data.url;
      }

      // Update Blog Post
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
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
      alert("Error updating blog post");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={40} /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b pb-8">
        <div>
          <Link href="/admin/blogs" className="flex items-center gap-2 text-slate-400 hover:text-black transition mb-2 text-sm font-bold">
            <ChevronLeft size={16} /> Back to Blogs
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Edit Post</h1>
        </div>
        <button 
          form="edit-blog-form"
          disabled={isLoading}
          className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> UPDATE POST</>}
        </button>
      </div>

      <form id="edit-blog-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Slug</label>
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
            <div className="w-full aspect-video bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Change Image</span>
                  </div>
                </>
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