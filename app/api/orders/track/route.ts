import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("id");

    if (!orderId) return new NextResponse("Order ID Required", { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        }
      }
    });

    if (!order) return new NextResponse("Order Not Found", { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}