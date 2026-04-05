import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, phone, address, name, total, shippingCharge } = body;

    if (!items || items.length === 0 || !phone || !address || !name) {
      return new NextResponse("Missing Information", { status: 400 });
    }

    // 1. Handle User (Guest logic)
    // We use the phone number for the 'where' clause because it's unique in your schema
    const guestEmail = `guest_${phone}@nextecommerce.com`;
    
    const user = await prisma.user.upsert({
      where: { phone: phone }, // Use phone as the unique lookup
      update: { 
        name: name,
        email: guestEmail // Keep email in sync
      },
      create: {
        name: name,
        email: guestEmail,
        phone: phone, // THIS WAS MISSING AND CAUSED THE ERROR
        password: "guest_checkout_secure",
        role: "USER",
      },
    });

    // 2. Create the Order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: parseFloat(total),
        shippingCharge: parseFloat(shippingCharge || 0),
        address: address,
        phone: phone,
        // Using the first item's product ID as a reference for the main order
        productId: items[0]?.productId || "unknown", 
        status: "PENDING",
        items: {
          create: items.map((item: any) => ({
            variantId: item.variantId, 
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
          })),
        },
      },
    });

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("DATABASE_INSERT_ERROR:", error.message);
    return new NextResponse(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}