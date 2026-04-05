import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { variant: { include: { product: true } } }
        },
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}