import { NextRequest, NextResponse } from "next/server";
import { emailTemplates } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const {
      shootDate,
      arrivalTime,
      subject,
      studio,
      studioMapLink,
      greeting,
      senderName,
      closingSignature,
      sampleName,
    } = await request.json();

    const templateData = emailTemplates.castingInvite({
      name: sampleName || "John Doe",
      subject: subject || "You're officially selected for ṢoGbédè!",
      shootDate: shootDate || "TBD",
      arrivalTime: arrivalTime || "TBD",
      studio: studio || "TBD",
      studioMapLink: studioMapLink || "",
      greeting: greeting
        ? greeting.replace("{name}", sampleName || "John Doe")
        : `Hello ${sampleName || "John Doe"}`,
      senderName: senderName || "",
      closingSignature:
        closingSignature || "Ẹ ṣeun lọ́pọ̀lọpọ̀,\nThe ṢoGbédè Team",
    });

    return NextResponse.json({ html: templateData.html });
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 },
    );
  }
}
