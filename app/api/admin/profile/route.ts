import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 },
      );
    }

    await db.admin.update({
      where: { id: admin.id },
      data: { name, email },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 },
    );
  }
}
