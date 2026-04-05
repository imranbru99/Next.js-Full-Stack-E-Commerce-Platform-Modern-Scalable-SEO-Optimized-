import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const orders = await prisma.order.findMany({
      where: { userId: (session.user as any).id },
      include: {
        items: {
          include: {
            variant: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error) {
    return new NextResponse("Error fetching orders", { status: 500 });
  }
}