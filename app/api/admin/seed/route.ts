import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/seed
 * One-time endpoint to create the first admin user.
 * Body: { email, password, name }
 */
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, and name are required" },
        { status: 400 },
      );
    }

    // Check if any admin exists
    const count = await db.admin.count();
    if (count > 0) {
      return NextResponse.json(
        { error: "Admin user already exists. Seed is disabled." },
        { status: 403 },
      );
    }

    const hashedPassword = await hashPassword(password);
    const admin = await db.admin.create({
      data: { email, password: hashedPassword, name },
    });

    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (error: unknown) {
    console.error("Seed error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to seed admin";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
