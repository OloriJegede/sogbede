import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      state,
      country,
      age,
      occupation,
      interests,
      filmingDate,
      partnerFirstName,
      partnerLastName,
      mediaUrl,
      mediaFilename,
      mediaSize,
      mediaType,
      instagramHandle,
      tiktokHandle,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "First name, last name, and email are required" },
        { status: 400 },
      );
    }

    // Check for duplicate email
    const existing = await db.application.findFirst({
      where: { email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An application with this email already exists" },
        { status: 409 },
      );
    }

    const application = await db.application.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        city: city || null,
        state: state || null,
        country: country || null,
        age: age ? parseInt(age, 10) : null,
        occupation: occupation || null,
        interests: interests || null,
        filmingDate: filmingDate ? new Date(filmingDate) : null,
        partnerFirstName: partnerFirstName || null,
        partnerLastName: partnerLastName || null,
        mediaUrl: mediaUrl || null,
        mediaFilename: mediaFilename || null,
        mediaSize: mediaSize ? parseInt(mediaSize, 10) : null,
        mediaType: mediaType || null,
        instagramHandle: instagramHandle || null,
        tiktokHandle: tiktokHandle || null,
        additionalNotes: additionalNotes || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      { success: true, applicationId: application.id },
      { status: 201 },
    );
  } catch (error) {
    console.error("Application submit error:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
