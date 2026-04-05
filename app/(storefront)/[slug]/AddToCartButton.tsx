"use client";

import { useState } from "react";
import { useCart } from "@/lib/store/useCart";
import { ShoppingCart, ArrowRight, CreditCard, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AddToCartButton({ product, selectedVariant }: { product: any, selectedVariant: any }) {
  const router = useRouter();
  const { items, addItem } = useCart();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const isAlreadyInCart = items.some((item) => item.variantId === selectedVariant?.id);
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: selectedVariant.price || product.basePrice,
      image: selectedVariant.imageUrl,
      color: selectedVariant.color,
      size: selectedVariant.size,
      quantity: 1,
    });
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    setIsRedirecting(true);
    if (!isAlreadyInCart) handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col xl:flex-row gap-4">
        {isAlreadyInCart ? (
          <button
            onClick={() => router.push("/cart")}
            className="flex-1 flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all"
          >
            Go to Cart <ArrowRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 flex items-center justify-center gap-3 bg-white text-black border-2 border-black px-10 py-5 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all disabled:opacity-20"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        )}

        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock || isRedirecting}
          className="flex-1 flex items-center justify-center gap-3 bg-black text-white px-10 py-5 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {isRedirecting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <><CreditCard size={16} /> Buy Now</>
          )}
        </button>
      </div>
      
      {isAlreadyInCart && (
        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] text-center italic">
          — This item is already in your bag —
        </p>
      )}
    </div>
  );
}