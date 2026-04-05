import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    // 1. Check if data is missing
    if (!name || !email || !password || !phone) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // 2. Check if email or phone already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return new NextResponse("Email already exists", { status: 400 });
      }
      if (existingUser.phone === phone) {
        return new NextResponse("Phone number already exists", { status: 400 });
      }
    }

    // 3. Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save the user to MySQL Database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "USER", // Explicitly setting default role
      },
    });

    // 5. Return success (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);

  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}