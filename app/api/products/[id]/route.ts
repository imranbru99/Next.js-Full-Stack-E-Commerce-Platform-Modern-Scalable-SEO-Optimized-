import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });
    if (!product) return new NextResponse("Product not found", { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      name, slug, description, basePrice, 
      status, categoryId, subcategoryId, variants 
    } = body;

    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update Core Product
      const product = await tx.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          basePrice: parseFloat(basePrice),
          status,
          categoryId,
          subcategoryId: subcategoryId || null,
        },
      });

      // 2. Refresh Variants (Delete old ones and create new mapped ones)
      await tx.variant.deleteMany({ where: { productId: id } });
      await tx.variant.createMany({
        data: variants.map((v: any) => ({
          productId: id,
          color: v.color || null,
          size: v.size || null,
          stock: parseInt(v.stock) || 0,
          price: v.price ? parseFloat(v.price) : null,
          imageUrl: v.imageUrl || null,
        })),
      });

      return product;
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}