"use client";

import { useState, useEffect } from "react";
import { Plus, FolderTree, Tag, X, Loader2, ChevronRight } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
    setLoading(false);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name, slug }),
    });
    resetAndRefresh();
  };

  const addSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await fetch("/api/subcategories", {
      method: "POST",
      body: JSON.stringify({ name, slug, categoryId: selectedParentId }),
    });
    resetAndRefresh();
  };

  const resetAndRefresh = () => {
    setName("");
    setSlug("");
    setSelectedParentId("");
    setShowCatModal(false);
    setShowSubModal(false);
    setIsSubmitting(false);
    fetchCategories();
  };

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-12 border-b pb-8">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Taxonomy</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">Manage Store Structure</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCatModal(true)} className="bg-black text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition">
            <Plus size={14} /> Category
          </button>
          <button onClick={() => setShowSubModal(true)} className="bg-slate-100 text-black px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition">
            <Plus size={14} /> Sub-Cat
          </button>
        </div>
      </div>

      {/* List Section */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-slate-200" size={40} /></div>
      ) : (
        <div className="grid gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white border-2 border-slate-50 rounded-[2rem] p-6 hover:border-black transition-all">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400"><FolderTree size={20} /></div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-lg">{cat.name}</h3>
                  <p className="text-[10px] font-mono text-slate-400">/{cat.slug}</p>
                </div>
              </div>
              
              {/* Subcategories Chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {cat.subcategories.map((sub: any) => (
                  <span key={sub.id} className="px-4 py-2 bg-slate-50 border rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <ChevronRight size={10} /> {sub.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setShowCatModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black"><X /></button>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">New Category</h2>
            <form onSubmit={addCategory} className="space-y-4">
              <input placeholder="Category Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-black" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
              <input placeholder="Slug" className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-mono text-xs text-slate-400 outline-none" value={slug} readOnly />
              <button disabled={isSubmitting} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest">
                {isSubmitting ? "Saving..." : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SUBCATEGORY MODAL */}
      {showSubModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 relative shadow-2xl">
            <button onClick={() => setShowSubModal(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black"><X /></button>
            <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-6">New Sub-Category</h2>
            <form onSubmit={addSubcategory} className="space-y-4">
              <select className="w-full px-6 py-4 rounded-2xl bg-slate-50 font-bold outline-none cursor-pointer" value={selectedParentId} onChange={(e) => setSelectedParentId(e.target.value)} required>
                <option value="">Select Parent Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Subcategory Name" className="w-full px-6 py-4 rounded-2xl bg-slate-50 font-bold outline-none border-2 border-transparent focus:border-black" value={name} onChange={(e) => handleNameChange(e.target.value)} required />
              <input placeholder="Slug" className="w-full px-6 py-4 rounded-2xl bg-slate-100 font-mono text-xs text-slate-400 outline-none" value={slug} readOnly />
              <button disabled={isSubmitting} className="w-full bg-black text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest">
                {isSubmitting ? "Saving..." : "Create Sub-Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}