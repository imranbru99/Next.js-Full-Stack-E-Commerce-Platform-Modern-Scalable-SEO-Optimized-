"use client";

import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { Share2, Copy, Check, Truck, RefreshCcw } from "lucide-react";
import { useSettings } from "@/components/SettingsContext"; // Import your global settings

export default function ProductClient({ product }: { product: any }) {
  const { currencySymbol } = useSettings(); // Use the dynamic symbol ($, ৳, etc.)
  
  const [selectedColor, setSelectedColor] = useState<string | null>(product.variants[0]?.color || null);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.variants[0]?.size || null);
  const [copied, setCopied] = useState(false);

  const activeVariant = product.variants.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) || product.variants.find((v: any) => v.color === selectedColor) 
    || product.variants[0];

  const availableColors = Array.from(new Set(product.variants.map((v: any) => v.color).filter(Boolean))) as string[];
  
  const availableSizes = product.variants
    .filter((v: any) => v.color === selectedColor)
    .map((v: any) => v.size)
    .filter(Boolean) as string[];

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      
      {/* LEFT: Image Section */}
      <div className="space-y-6 sticky top-32">
        <div className="bg-slate-50 aspect-[3/4] overflow-hidden relative group">
          <img 
            src={activeVariant?.imageUrl || product.variants[0]?.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          {activeVariant?.stock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-black text-white px-10 py-4 font-black uppercase tracking-[0.3em] -rotate-2">Sold Out</span>
            </div>
          )}
        </div>
        
        {/* Gallery */}
        <div className="grid grid-cols-4 gap-4">
          {product.variants.map((v: any, i: number) => (
            <button 
              key={i} 
              onClick={() => { setSelectedColor(v.color); setSelectedSize(v.size); }}
              className={`aspect-square border-2 transition-all overflow-hidden ${
                activeVariant?.id === v.id ? "border-black" : "border-transparent opacity-50 hover:opacity-100"
              }`}
            >
              <img src={v.imageUrl} className="w-full h-full object-cover" alt="thumb" />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Info Section */}
      <div className="flex flex-col pt-4">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
             <span className="h-px w-8 bg-black"></span>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Premium Collection</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 uppercase italic leading-[0.85] mb-8">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-8">
            <span className="text-5xl font-black tracking-tighter italic">
              <span className="text-xl not-italic mr-2 text-slate-400 font-bold">{currencySymbol}</span>
              {(activeVariant?.price || product.basePrice).toLocaleString()}
            </span>
            <div className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest border ${
              activeVariant?.stock > 0 ? "border-green-200 text-green-600" : "border-red-200 text-red-600"
            }`}>
              {activeVariant?.stock > 0 ? `Stock: ${activeVariant.stock}` : "Sold Out"}
            </div>
          </div>
        </div>

        {/* Selection Logic */}
        <div className="space-y-12 mb-16">
          {availableColors.length > 0 && (
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">01. Choose Finish</h3>
              <div className="flex flex-wrap gap-4">
                {availableColors.map((color) => (
                  <button 
                    key={color}
                    onClick={() => {
                        setSelectedColor(color);
                        if (!product.variants.find((v:any) => v.color === color && v.size === selectedSize)) {
                            setSelectedSize(product.variants.find((v:any) => v.color === color)?.size || null);
                        }
                    }}
                    className={`px-10 py-4 border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                      selectedColor === color ? "border-black bg-black text-white" : "border-slate-100 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div>
              <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">02. Select Size</h3>
              <div className="flex flex-wrap gap-4">
                {availableSizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-16 border-2 flex items-center justify-center font-black text-[10px] uppercase tracking-widest transition-all ${
                      selectedSize === size ? "border-black bg-black text-white" : "border-slate-100 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-10 border-t border-slate-100 pt-12">
          <AddToCartButton product={product} selectedVariant={activeVariant} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-5 p-8 bg-slate-50 group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
               <Truck className="text-slate-900" size={28} />
               <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest leading-loose">
                 Nationwide <br/><span className="text-black text-xs tracking-normal">Express Delivery</span>
               </div>
            </div>
            <div className="flex items-center gap-5 p-8 bg-slate-50 group hover:bg-white border border-transparent hover:border-slate-100 transition-all">
               <RefreshCcw className="text-slate-900" size={28} />
               <div className="text-[9px] uppercase font-black text-slate-400 tracking-widest leading-loose">
                 Hassle Free <br/><span className="text-black text-xs tracking-normal">7 Day Exchange</span>
               </div>
            </div>
          </div>

          <div className="flex justify-center gap-10 pt-6">
            <button onClick={copyLink} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>} 
              {copied ? "Copied" : "Copy Link"}
            </button>
            <button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
              <Share2 size={14}/> Share product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}