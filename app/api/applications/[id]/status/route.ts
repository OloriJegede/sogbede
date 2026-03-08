import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);
    const { status } = await request.json();

    if (!["pending", "approved", "rejected", "removed"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const application = await db.application.update({
      where: { id: applicationId },
      data: { status },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 },
    );
  }
}
