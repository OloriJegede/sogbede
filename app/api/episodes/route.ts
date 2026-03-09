import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { episodeNumber, shootDate, notes } = body;

    // If episodeNumber is provided, check it's not already taken
    if (episodeNumber) {
      const existing = await db.episode.findUnique({
        where: { episodeNumber: Number(episodeNumber) },
      });
      if (existing) {
        return NextResponse.json(
          { error: `Episode number ${episodeNumber} already exists` },
          { status: 409 },
        );
      }
    }

    // Auto-generate episode number if not provided
    let finalEpisodeNumber = episodeNumber ? Number(episodeNumber) : null;
    if (!finalEpisodeNumber) {
      const latest = await db.episode.findFirst({
        orderBy: { episodeNumber: "desc" },
      });
      finalEpisodeNumber = (latest?.episodeNumber ?? 0) + 1;
    }

    const episode = await db.episode.create({
      data: {
        episodeNumber: finalEpisodeNumber,
        shootDate: shootDate ? new Date(shootDate) : null,
        status: "planned",
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, episode }, { status: 201 });
  } catch (error) {
    console.error("Create episode error:", error);
    return NextResponse.json(
      { error: "Failed to create episode" },
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

    const { id, status, shootDate } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Episode id is required" },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = {};

    if (status !== undefined) {
      if (!["planned", "shot", "cancelled"].includes(status)) {
        return NextResponse.json(
          { error: "Invalid status. Must be planned, shot, or cancelled" },
          { status: 400 },
        );
      }
      data.status = status;
    }

    if (shootDate !== undefined) {
      data.shootDate = shootDate ? new Date(shootDate) : null;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const episode = await db.episode.update({
      where: { id: Number(id) },
      data,
    });

    return NextResponse.json({ success: true, episode });
  } catch (error) {
    console.error("Update episode error:", error);
    return NextResponse.json(
      { error: "Failed to update episode" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "Episode id is required" },
        { status: 400 },
      );
    }

    // Remove all members first, then delete episode
    await db.episodeMember.deleteMany({ where: { episodeId: Number(id) } });
    await db.episode.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete episode error:", error);
    return NextResponse.json(
      { error: "Failed to delete episode" },
      { status: 500 },
    );
  }
}
