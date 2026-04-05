import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.storeSettings.findUnique({
      where: { id: "1" },
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const updatedSettings = await prisma.storeSettings.upsert({
      where: { id: "1" },
      update: { ...body },
      create: { id: "1", ...body },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error("UPSERT_ERROR", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}