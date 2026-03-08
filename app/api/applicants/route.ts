import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const partner = searchParams.get("partner");

    const applications = await db.application.findMany({
      where: {
        ...(status && status !== "all" ? { status } : {}),
        ...(partner === "yes"
          ? { partnerFirstName: { not: null } }
          : partner === "no"
            ? { partnerFirstName: null }
            : {}),
      },
      include: {
        categories: { include: { category: true } },
        visibility: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Fetch applicants error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 },
    );
  }
}
