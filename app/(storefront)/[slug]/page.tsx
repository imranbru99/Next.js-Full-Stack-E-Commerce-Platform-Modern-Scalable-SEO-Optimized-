import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";
import { Metadata } from "next"; // Import Metadata type

// 1. DYNAMIC METADATA GENERATOR
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slug },
    select: { 
      name: true, 
      description: true 
    }
  });

  if (!product) {
    return { title: "Product Not Found" };
  }

  // Cleaning the description (removes HTML tags if any)
  const cleanDescription = product.description.replace(/<[^>]*>?/gm, '').slice(0, 160);

  return {
    title: product.name, // Tab Title
    description: cleanDescription, // Meta Description
    keywords: product.name, // Meta Keywords (same as title as requested)
    openGraph: {
      title: product.name,
      description: cleanDescription,
      // You can also add images here for Social Media sharing
    }
  };
}

// 2. PAGE COMPONENT
export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug: slug },
    include: { 
      variants: true,
      category: true // Good practice to include category for breadcrumbs
    }
  });

  if (!product) return notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <ProductClient product={product} />
    </main>
  );
}