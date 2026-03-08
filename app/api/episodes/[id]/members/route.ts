import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

// POST — add a contestant to an episode
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const episodeId = Number(id);
    const { applicationId, teamNumber, seatNumber } = await request.json();

    if (!applicationId || !teamNumber || !seatNumber) {
      return NextResponse.json(
        { error: "applicationId, teamNumber, and seatNumber are required" },
        { status: 400 },
      );
    }

    // Validate team/seat bounds (2 teams, 2 seats each)
    if (![1, 2].includes(teamNumber) || ![1, 2].includes(seatNumber)) {
      return NextResponse.json(
        { error: "teamNumber and seatNumber must be 1 or 2" },
        { status: 400 },
      );
    }

    // Check episode exists
    const episode = await db.episode.findUnique({
      where: { id: episodeId },
    });
    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 });
    }

    // Check max 4 members
    const memberCount = await db.episodeMember.count({
      where: { episodeId },
    });
    if (memberCount >= 4) {
      return NextResponse.json(
        { error: "Episode already has the maximum 4 contestants" },
        { status: 409 },
      );
    }

    // Check slot not taken
    const existingSlot = await db.episodeMember.findFirst({
      where: { episodeId, teamNumber, seatNumber },
    });
    if (existingSlot) {
      return NextResponse.json(
        {
          error: `Team ${teamNumber}, Seat ${seatNumber} is already taken`,
        },
        { status: 409 },
      );
    }

    // Check applicant not already in this episode
    const existingMember = await db.episodeMember.findFirst({
      where: { episodeId, applicationId: Number(applicationId) },
    });
    if (existingMember) {
      return NextResponse.json(
        { error: "This applicant is already in this episode" },
        { status: 409 },
      );
    }

    // Fetch application for snapshot
    const application = await db.application.findUnique({
      where: { id: Number(applicationId) },
    });
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    const member = await db.episodeMember.create({
      data: {
        episodeId,
        applicationId: Number(applicationId),
        fullNameSnapshot: `${application.firstName} ${application.lastName}`,
        emailSnapshot: application.email,
        photoUrlSnapshot: application.mediaUrl || null,
        teamNumber,
        seatNumber,
      },
    });

    return NextResponse.json({ success: true, member }, { status: 201 });
  } catch (error) {
    console.error("Add episode member error:", error);
    return NextResponse.json(
      { error: "Failed to add contestant" },
      { status: 500 },
    );
  }
}

// DELETE — remove a contestant from an episode
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await params; // consume params
    const { memberId } = await request.json();

    if (!memberId) {
      return NextResponse.json(
        { error: "memberId is required" },
        { status: 400 },
      );
    }

    await db.episodeMember.delete({
      where: { id: Number(memberId) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove episode member error:", error);
    return NextResponse.json(
      { error: "Failed to remove contestant" },
      { status: 500 },
    );
  }
}
