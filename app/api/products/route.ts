import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      name, 
      slug, 
      description, 
      basePrice, 
      status, 
      variants, 
      categoryId, 
      subcategoryId 
    } = body;

    // 1. Validate required fields
    if (!name || !slug || !basePrice || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 2. Check for duplicate slug
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      return new NextResponse("Product slug already exists", { status: 400 });
    }

    // 3. Create Product with Variants
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        status: status || "PENDING",
        basePrice: parseFloat(basePrice.toString()),
        categoryId: categoryId,
        subcategoryId: subcategoryId || null, 

        variants: {
          create: variants.map((v: any) => {
            const currentStock = parseInt(v.stock.toString()) || 0;
            return {
              color: v.color || null,
              size: v.size || null,
              // 'stock' is the current balance (decreases on sale)
              stock: currentStock,
              // 'initialStock' is the starting point (stays 300)
              initialStock: currentStock, 
              price: v.price ? parseFloat(v.price.toString()) : null,
              imageUrl: v.imageUrl || null,
            };
          }),
        },
      },
      include: {
        variants: true,
        category: true
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("PRODUCT_CREATE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}