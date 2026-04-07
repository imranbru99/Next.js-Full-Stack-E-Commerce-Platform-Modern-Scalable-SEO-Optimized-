import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;
    const type = formData.get("type") as string; // Check if it's a "blog" or standard upload

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // 1. Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Generate Date Variables
    const date = new Date();
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    // 3. Determine the Path (Products vs Blogs)
    let relativeDir = `uploads/${yearMonth}`; // DEFAULT: Product behavior remains identical
    
    if (type === "blog") {
      relativeDir = `uploads/blog/${yearMonth}`; // BLOG: Goes to /uploads/blog/2026/
    }

    // 4. Define the path inside the Next.js public directory
    const uploadDir = path.join(process.cwd(), "public", ...relativeDir.split("/"));

    // Ensure the directory exists (creates it if it doesn't)
    await fs.mkdir(uploadDir, { recursive: true });

    // 5. Generate the custom filename
    const randomString = Math.random().toString(36).substring(2, 8); 
    const safeSlug = slug || (type === "blog" ? "blog-post" : "product");
    const filename = `${safeSlug}-${randomString}.webp`;
    const filepath = path.join(uploadDir, filename);

    // 6. Convert to WebP and save to disk
    await sharp(buffer)
      .webp({ quality: 80 }) 
      .toFile(filepath);

    // 7. Return the public URL to save in the database
    const publicUrl = `/${relativeDir}/${filename}`;
    
    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}