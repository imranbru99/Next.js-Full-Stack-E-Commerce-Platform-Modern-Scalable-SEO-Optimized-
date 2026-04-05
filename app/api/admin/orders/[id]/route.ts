import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } // Define as Promise
) {
  try {
    const { id } = await params; // CRITICAL: Await the ID
    const body = await req.json();
    const { status } = body;

    console.log(`Updating Order ${id} to ${status}`);

    const updatedOrder = await prisma.order.update({
      where: { id: id },
      data: { status: status },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("PATCH_ERROR:", error.message);
    return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
  }
}