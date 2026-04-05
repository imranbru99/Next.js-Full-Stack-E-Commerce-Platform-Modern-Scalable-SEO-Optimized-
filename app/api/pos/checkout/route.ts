import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Destructure data sent from the frontend
    const { items, phone, address, name, total, shippingCharge } = body;

    // Validation
    if (!items || items.length === 0 || !phone) {
      return new NextResponse("Missing items or customer phone", { status: 400 });
    }

    // 2. Run a Prisma Transaction
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Handle Guest User (Identify by phone)
      const guestEmail = `guest_${phone}@nextecommerce.com`;
      const user = await tx.user.upsert({
        where: { phone: phone },
        update: { name: name },
        create: {
          name: name,
          phone: phone,
          email: guestEmail,
          role: "USER",
        },
      });

      // B. Create the Order with DEEP INCLUDES for the Receipt
      const order = await tx.order.create({
        data: {
          userId: user.id,
          total: parseFloat(total),
          shippingCharge: parseFloat(shippingCharge || 0),
          address: address || "In-Store POS",
          phone: phone,
          productId: items[0].productId, 
          status: "DELIVERED", 
          items: {
            create: items.map((item: any) => ({
              variantId: item.variantId,
              quantity: parseInt(item.quantity),
              price: parseFloat(item.price),
            })),
          },
        },
        // THIS BLOCK IS CRITICAL: It fetches the Product Name for the invoice
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: {
                    select: {
                      name: true // We need the name for the receipt!
                    }
                  }
                }
              }
            }
          }
        }
      });

      // C. Update Stock for each item (Decrement both Variant and Master Stock)
      for (const item of items) {
        // Update Variant Stock
        await tx.variant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: parseInt(item.quantity) } },
        });

        // Update Product Master Stock
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: parseInt(item.quantity) } },
        });
      }

      return order;
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("POS_CHECKOUT_ERROR:", error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}