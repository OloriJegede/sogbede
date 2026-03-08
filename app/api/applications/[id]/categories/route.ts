import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT: Set categories for an application (replaces all existing)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);
    const { categoryIds } = (await request.json()) as {
      categoryIds: number[];
    };

    if (!Array.isArray(categoryIds)) {
      return NextResponse.json(
        { error: "categoryIds must be an array" },
        { status: 400 },
      );
    }

    // Remove all existing category links for this application
    await db.applicationCategory.deleteMany({
      where: { applicationId },
    });

    // Create new category links
    const created = [];
    for (const categoryId of categoryIds) {
      const link = await db.applicationCategory.create({
        data: {
          applicationId,
          categoryId,
          assignedAt: new Date(),
        },
      });
      created.push(link);
    }

    return NextResponse.json({ success: true, categories: created });
  } catch (error) {
    console.error("Category update error:", error);
    return NextResponse.json(
      { error: "Failed to update categories" },
      { status: 500 },
    );
  }
}

// POST: Add a single category to an application
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);
    const { categoryId } = (await request.json()) as { categoryId: number };

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 },
      );
    }

    // Check if already assigned
    const existing = await db.applicationCategory.findMany({
      where: { applicationId, categoryId },
    });

    if (existing.length > 0) {
      return NextResponse.json({ success: true, already: true });
    }

    const link = await db.applicationCategory.create({
      data: {
        applicationId,
        categoryId,
        assignedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, link });
  } catch (error) {
    console.error("Category add error:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 },
    );
  }
}

// DELETE: Remove a single category from an application
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const applicationId = parseInt(id);
    const { categoryId } = (await request.json()) as { categoryId: number };

    if (!categoryId) {
      return NextResponse.json(
        { error: "categoryId is required" },
        { status: 400 },
      );
    }

    await db.applicationCategory.deleteMany({
      where: { applicationId, categoryId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Category remove error:", error);
    return NextResponse.json(
      { error: "Failed to remove category" },
      { status: 500 },
    );
  }
}
