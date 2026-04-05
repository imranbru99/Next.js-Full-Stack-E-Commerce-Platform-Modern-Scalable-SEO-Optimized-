import Link from "next/link";
import { getCachedSettings } from "@/lib/store-data";

export default async function Footer() {
  const s = await getCachedSettings();
  const name = s?.storeName || "NEXTECOMMERCE";

  return (
    <footer className="bg-slate-50 border-t py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <p className="font-black text-2xl italic mb-4 uppercase">{name}</p>
          <p className="text-xs text-slate-400 uppercase tracking-widest leading-relaxed max-w-sm">
            {s?.metaDescription || "Premium quality clothing made for the modern lifestyle."}
          </p>
        </div>
        
        {/* Support Links */}
        <div>
          <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6">Explore</h4>
          <ul className="text-[10px] font-bold uppercase tracking-widest text-slate-500 space-y-4">
            <li><Link href="/about" className="hover:text-black">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-black">Contact</Link></li>
            <li><Link href="/refund-policy" className="hover:text-black">Refund Policy</Link></li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="font-bold text-[11px] uppercase tracking-widest mb-6">Legal</h4>
          <ul className="text-[10px] font-bold uppercase tracking-widest text-slate-500 space-y-4">
            <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-black">Terms of Service</Link></li>
            <li><Link href="/shipping" className="hover:text-black">Shipping Info</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-slate-200 text-center">
        <p className="text-[10px] text-slate-300 font-bold tracking-widest uppercase">
          © 2026 {name}. Locally Crafted in Bangladesh.
        </p>
      </div>
    </footer>
  );
}