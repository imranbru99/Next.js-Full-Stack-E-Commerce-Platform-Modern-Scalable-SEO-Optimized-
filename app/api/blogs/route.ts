import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      title, 
      slug, 
      description, 
      status, 
      categoryId, 
      subcategoryId,
      imageUrl 
    } = body;

    // 1. Validate required fields
    if (!title || !slug || !categoryId || !description) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 2. Check for duplicate slug
    const existingBlog = await prisma.blog.findUnique({ where: { slug } });
    if (existingBlog) {
      return new NextResponse("Blog slug already exists", { status: 400 });
    }

    // 3. Create Blog
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        description,
        status: status || "PENDING",
        categoryId: categoryId,
        subcategoryId: subcategoryId || null, 
        imageUrl: imageUrl || null,
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(blog);
  } catch (error) {
    console.error("BLOG_CREATE_ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}