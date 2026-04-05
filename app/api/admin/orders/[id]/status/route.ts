import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body; // The new status sent from the dashboard (e.g., "PROCESSING")

    // 1. Fetch the current order to check its existing status and items
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // 2. Logic: Only decrease stock if moving from PENDING to PROCESSING
    const shouldDeductStock = currentOrder.status === "PENDING" && status === "PROCESSING";

    // 3. Start a Transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update the Order status first
      const order = await tx.order.update({
        where: { id: params.id },
        data: { status },
      });

      // If our condition is met, loop through items and deduct stock
      if (shouldDeductStock) {
        for (const item of currentOrder.items) {
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
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