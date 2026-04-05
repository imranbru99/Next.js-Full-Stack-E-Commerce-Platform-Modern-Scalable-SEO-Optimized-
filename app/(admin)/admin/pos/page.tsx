import { prisma } from "@/lib/prisma";
import PosClient from "./PosClient"; // Adjust path if needed

export default async function PosPage() {
  // Fetch products with their variants from the database
  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Terminal POS</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Storefront Management System</p>
      </div>
      
      {/* Pass an empty array as fallback if products is null */}
      <PosClient products={products || []} />
    </div>
  );
}