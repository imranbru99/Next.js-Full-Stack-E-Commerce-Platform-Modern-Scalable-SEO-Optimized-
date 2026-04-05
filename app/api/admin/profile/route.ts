import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import bcrypt from "bcryptjs"; // Recommended for passwords

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, phone, newPassword } = body;

    const updateData: any = {
      name,
      email,
      phone,
    };

    // Only update password if a new one is provided
    if (newPassword && newPassword.length > 0) {
      // const hashedPassword = await bcrypt.hash(newPassword, 10);
      // updateData.password = hashedPassword;
      updateData.password = newPassword; // Replace with hashed version in production
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}