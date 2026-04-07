import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id },
    });
    if (!blog) return new NextResponse("Not Found", { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, description, status, categoryId, subcategoryId, imageUrl } = body;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        status,
        categoryId,
        subcategoryId: subcategoryId || null,
        ...(imageUrl && { imageUrl }), // Only update image if a new one is provided
      },
    });

    return NextResponse.json(blog);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.delete({
      where: { id },
    });
    return NextResponse.json(blog);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}