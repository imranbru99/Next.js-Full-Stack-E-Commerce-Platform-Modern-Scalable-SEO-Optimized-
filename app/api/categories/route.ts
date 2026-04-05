import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  try {
    const { name, slug } = await req.json();
    const category = await prisma.category.create({
      data: { name, slug }
    });
    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse("Error creating category", { status: 500 });
  }
}