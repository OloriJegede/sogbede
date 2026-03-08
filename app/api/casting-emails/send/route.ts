import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const {
      recipientIds,
      manualRecipients,
      shootDate,
      arrivalTime,
      subject,
      studio,
      studioMapLink,
      greeting,
      senderName,
      closingSignature,
    } = await request.json();

    if (
      (!recipientIds || recipientIds.length === 0) &&
      (!manualRecipients || manualRecipients.length === 0)
    ) {
      return NextResponse.json(
        { error: "No recipients selected" },
        { status: 400 },
      );
    }

    if (!shootDate || !arrivalTime || !studio) {
      return NextResponse.json(
        { error: "Shoot date, arrival time, and studio are required" },
        { status: 400 },
      );
    }

    // Fetch DB recipients
    const dbRecipients =
      recipientIds && recipientIds.length > 0
        ? await db.application.findMany({
            where: { id: { in: recipientIds } },
            select: { id: true, email: true, firstName: true, lastName: true },
          })
        : [];

    // Build a de-duplicated list (by email) of all recipients
    const allRecipients: {
      id: number | null;
      name: string;
      email: string;
    }[] = [];
    const seenEmails = new Set<string>();

    for (const r of dbRecipients) {
      const email = r.email.toLowerCase();
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        allRecipients.push({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`.trim(),
          email: r.email,
        });
      }
    }

    for (const m of manualRecipients || []) {
      const email = m.email.toLowerCase();
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        allRecipients.push({ id: null, name: m.name, email: m.email });
      }
    }

    const emailSubject = subject || "You're officially selected for ṢoGbédè!";

    // Send emails
    const results = await Promise.all(
      allRecipients.map(async (recipient) => {
        const templateData = emailTemplates.castingInvite({
          name: recipient.name,
          subject: emailSubject,
          shootDate,
          arrivalTime,
          studio,
          studioMapLink: studioMapLink || "",
          greeting: greeting
            ? greeting.replace("{name}", recipient.name)
            : `Hello ${recipient.name}`,
          senderName: senderName || "",
          closingSignature:
            closingSignature || "Ẹ ṣeun lójúlọ́jú,\nThe ṢoGbédè Team",
        });

        const result = await sendEmail({
          to: recipient.email,
          subject: templateData.subject,
          html: templateData.html,
        });

        // Track delivery for DB recipients
        if (recipient.id !== null) {
          const recipientKey = `${recipient.id}-castingInvite`;
          try {
            await db.castingEmailDeliveryStatus.upsert({
              where: { recipientKey },
              create: {
                recipientKey,
                applicationId: recipient.id,
                email: recipient.email,
                lastStatus: result.success ? "success" : "failed",
                lastSubject: templateData.subject,
                attemptCount: 1,
                successCount: result.success ? 1 : 0,
                lastAttemptAt: new Date(),
                lastSuccessAt: result.success ? new Date() : null,
              },
              update: {
                lastStatus: result.success ? "success" : "failed",
                lastSubject: templateData.subject,
                attemptCount: { increment: 1 },
                successCount: result.success ? { increment: 1 } : undefined,
                lastAttemptAt: new Date(),
                lastSuccessAt: result.success ? new Date() : undefined,
              },
            });
          } catch (trackErr) {
            console.error("Failed to track delivery:", trackErr);
          }
        }

        return {
          email: recipient.email,
          name: recipient.name,
          success: result.success,
        };
      }),
    );

    const successCount = results.filter((r) => r.success).length;
    const failCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      sent: successCount,
      failed: failCount,
      results,
    });
  } catch (error) {
    console.error("Casting email send error:", error);
    return NextResponse.json(
      { error: "Failed to send casting emails" },
      { status: 500 },
    );
  }
}
