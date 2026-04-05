import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { name, slug, categoryId } = await req.json();
    const subcategory = await prisma.subcategory.create({
      data: { name, slug, categoryId }
    });
    return NextResponse.json(subcategory);
  } catch (error) {
    return new NextResponse("Error creating subcategory", { status: 500 });
  }
}