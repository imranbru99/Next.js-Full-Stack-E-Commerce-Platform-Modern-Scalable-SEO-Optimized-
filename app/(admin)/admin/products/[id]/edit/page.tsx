"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  Plus, Trash2, ChevronLeft, Save, Info, 
  Layers, FolderTree, Tag, Loader2, Eye
} from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/components/SettingsContext";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const { currencySymbol } = useSettings();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Taxonomy States
  const [categories, setCategories] = useState<any[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<any[]>([]);

  // Form States
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [variants, setVariants] = useState<any[]>([]);

  // 1. Fetch Taxonomy & Product Data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        setCategories(catData);

        // Fetch Product
        const prodRes = await fetch(`/api/products/${productId}`);
        if (!prodRes.ok) throw new Error("Failed to fetch product");
        const product = await prodRes.json();

        // Map Product to State
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setBasePrice(product.basePrice.toString());
        setStatus(product.status);
        setCategoryId(product.categoryId);
        setSubcategoryId(product.subcategoryId || "");
        
        // Filter subcategories for the initial category
        const selectedCat = catData.find((c: any) => c.id === product.categoryId);
        setFilteredSubcategories(selectedCat?.subcategories || []);

        setVariants(product.variants.map((v: any) => ({
          ...v,
          stock: v.stock.toString(),
          imageFile: null
        })));

      } catch (err) {
        console.error(err);
        alert("Error loading data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [productId]);

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    const selectedCat = categories.find((c) => c.id === id);
    setFilteredSubcategories(selectedCat?.subcategories || []);
    setSubcategoryId(""); 
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // 1. Upload new images if selected
      const updatedVariants = await Promise.all(
        variants.map(async (v) => {
          if (v.imageFile) {
            const formData = new FormData();
            formData.append("file", v.imageFile);
            formData.append("slug", slug);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            return { ...v, imageUrl: data.url };
          }
          return v;
        })
      );

      // 2. Save to DB
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, slug, description, 
          basePrice: parseFloat(basePrice), 
          status, categoryId, 
          subcategoryId: subcategoryId || null,
          variants: updatedVariants 
        }),
      });

      if (response.ok) {
        router.push("/admin/products");
        router.refresh();
      }
    } catch (error) {
      alert("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Loading Product...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-24 px-4 sm:px-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 border-b pb-8">
        <div>
          <Link href="/admin/products" className="flex items-center gap-2 text-slate-400 hover:text-black transition mb-2 text-sm font-bold">
            <ChevronLeft size={16} /> Catalog
          </Link>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Edit: {name}</h1>
        </div>
        <div className="flex gap-3">
          <Link href={`/product/${slug}`} target="_blank" className="p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition">
             <Eye size={20} />
          </Link>
          <button 
            form="edit-form"
            disabled={isSaving}
            className="bg-black text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> UPDATE PRODUCT</>}
          </button>
        </div>
      </div>

      <form id="edit-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Info size={20} /> <span className="font-bold text-xs uppercase tracking-widest">General Info</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Product Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-black transition" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Slug</label>
                <input value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl text-slate-400 font-mono text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Description</label>
              <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={6} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-700 leading-relaxed outline-none focus:ring-2 focus:ring-black transition resize-none" />
            </div>
          </div>

          {/* Variants Section */}
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2 text-purple-600">
                  <Layers size={20} /> <span className="font-bold text-xs uppercase tracking-widest">Inventory & Variants</span>
               </div>
               <button 
                type="button" 
                onClick={() => setVariants([...variants, { color: "", size: "", stock: "0", price: "", imageFile: null, imageUrl: "" }])}
                className="text-[10px] font-black bg-slate-100 px-4 py-2 rounded-xl hover:bg-slate-200 transition uppercase"
               >
                + Add Option
               </button>
            </div>
            
            <div className="space-y-4">
              {variants.map((v, i) => (
                <div key={i} className="group relative grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border rounded-3xl bg-slate-50 hover:bg-white hover:border-black transition-all">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Color</label>
                    <input type="text" value={v.color || ""} onChange={(e) => updateVariant(i, "color", e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-1 outline-none text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Size</label>
                    <input type="text" value={v.size || ""} onChange={(e) => updateVariant(i, "size", e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-1 outline-none text-sm font-bold" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stock</label>
                    <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="w-full bg-transparent border-b border-slate-200 py-1 outline-none text-sm font-bold" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Update Image</label>
                    <div className="flex items-center gap-2">
                       {v.imageUrl && !v.imageFile && <div className="w-8 h-8 rounded-lg overflow-hidden border"><img src={v.imageUrl} className="object-cover w-full h-full" /></div>}
                       <input type="file" onChange={(e) => updateVariant(i, "imageFile", e.target.files?.[0])} className="w-full text-[10px] mt-1" />
                    </div>
                  </div>
                  <button type="button" onClick={() => setVariants(variants.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"><Trash2 size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-6">
            <h2 className="text-sm font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
              <FolderTree size={16} className="text-blue-500" /> Organization
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Category</label>
                <select required value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer">
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Sub-Category</label>
                <select value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer">
                  <option value="">None</option>
                  {filteredSubcategories.map(sub => <option key={sub.id} value={sub.id}>{sub.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border shadow-sm space-y-8">
            <div>
              <h2 className="text-sm font-black uppercase text-slate-400 mb-4 flex items-center gap-2">
                <Tag size={16} className="text-green-500" /> Pricing
              </h2>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl italic text-slate-400">{currencySymbol}</span>
                <input required type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} className="w-full pl-14 pr-5 py-5 bg-slate-50 rounded-2xl text-2xl font-black outline-none" />
              </div>
            </div>

            <div className="pt-8 border-t">
              <h2 className="text-sm font-black uppercase text-slate-400 mb-4">Status</h2>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-5 py-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none appearance-none cursor-pointer">
                <option value="ACTIVE">🚀 LIVE</option>
                <option value="PENDING">⏳ DRAFT</option>
                <option value="ARCHIVED">📦 ARCHIVED</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}