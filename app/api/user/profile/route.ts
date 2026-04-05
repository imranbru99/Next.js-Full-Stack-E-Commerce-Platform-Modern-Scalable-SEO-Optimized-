import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import bcrypt from "bcryptjs"; // Switched to bcryptjs for Turbopack compatibility

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, currentPassword, newPassword } = body;
    const userId = (session.user as any).id;

    // --- CASE 1: Updating Name Only ---
    if (name && !currentPassword && !newPassword) {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
      
      return NextResponse.json({
        message: "Profile updated",
        user: { name: updatedUser.name }
      });
    }

    // --- CASE 2: Updating Password ---
    if (currentPassword && newPassword) {
      const user = await prisma.user.findUnique({ 
        where: { id: userId } 
      });

      if (!user || !user.password) {
        return new NextResponse("User record or password not found", { status: 404 });
      }

      // Verify the existing password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return new NextResponse("Current password is incorrect", { status: 400 });
      }

      // Hash the new password (bcryptjs usage is identical to bcrypt)
      const salt = await bcrypt.genSalt(10);
      const hashedNewPassword = await bcrypt.hash(newPassword, salt);

      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
      });

      return NextResponse.json({ message: "Password updated successfully" });
    }

    return new NextResponse("Missing required fields", { status: 400 });

  } catch (error: any) {
    console.error("PROFILE_PATCH_ERROR:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}