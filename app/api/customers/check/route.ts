import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone");

  if (!phone || phone.length < 11) return new NextResponse("Invalid", { status: 400 });

  try {
    const lastOrder = await prisma.order.findFirst({
      where: { phone: phone },
      orderBy: { createdAt: 'desc' },
    });

    if (!lastOrder) return NextResponse.json({ exists: false });

    // Try to find the user's name from their previous order or account
    const user = await prisma.user.findUnique({ where: { id: lastOrder.userId } });

    return NextResponse.json({
      exists: true,
      name: user?.name || "Customer",
      address: lastOrder.address
    });
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
}