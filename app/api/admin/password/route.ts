import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookies, verifyPassword, hashPassword } from "@/lib/auth";

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Both current and new password are required" },
        { status: 400 },
      );
    }

    // Fetch admin with password
    const adminRecord = await db.admin.findUnique({
      where: { id: admin.id },
    });

    if (!adminRecord) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const valid = await verifyPassword(currentPassword, adminRecord.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const hashed = await hashPassword(newPassword);
    await db.admin.update({
      where: { id: admin.id },
      data: { password: hashed },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 },
    );
  }
}
