import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const slug = formData.get("slug") as string;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    // 1. Convert file to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. Generate YYYYMM folder name based on current date
    const date = new Date();
    const yearMonth = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    
    // 3. Define the path inside the Next.js public directory
    const uploadDir = path.join(process.cwd(), "public", "uploads", yearMonth);

    // Ensure the directory exists (creates it if it doesn't)
    await fs.mkdir(uploadDir, { recursive: true });

    // 4. Generate the custom filename
    const randomString = Math.random().toString(36).substring(2, 8); // e.g. "x7b9z1"
    const safeSlug = slug || "product";
    const filename = `${safeSlug}-${randomString}.webp`;
    const filepath = path.join(uploadDir, filename);

    // 5. Convert to WebP and save to disk
    await sharp(buffer)
      .webp({ quality: 80 }) // 80% quality is great for web
      .toFile(filepath);

    // 6. Return the public URL to save in the database
    const publicUrl = `/uploads/${yearMonth}/${filename}`;
    
    return NextResponse.json({ url: publicUrl });

  } catch (error) {
    console.error("UPLOAD_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}