import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. Define params as a Promise
) {
  try {
    const { id } = await params; // 2. Await the params to get the ID
    const body = await req.json();
    const { status } = body; 

    // 3. Fetch current order with its items
    const currentOrder = await prisma.order.findUnique({
      where: { id: id },
      include: { items: true },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // 4. Logic: Deduct stock when moving from PENDING to PROCESSING
    const shouldDeductStock = currentOrder.status === "PENDING" && status === "PROCESSING";

    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update the Order status
      const order = await tx.order.update({
        where: { id: id },
        data: { status },
      });

      if (shouldDeductStock) {
        for (const item of currentOrder.items) {
          // A. Update Variant Stock
          const updatedVariant = await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: { decrement: item.quantity },
            },
          });

          // B. Sync Product Master Stock (Keep both in sync)
          await tx.product.update({
            where: { id: updatedVariant.productId },
            data: {
              stock: { decrement: item.quantity },
            },
          });
        }
      }

      return order;
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("ORDER_STATUS_UPDATE_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}