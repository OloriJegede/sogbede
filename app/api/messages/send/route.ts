import { NextRequest, NextResponse } from "next/server";
import { sendEmail, emailTemplates } from "@/lib/email";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { recipientIds, templateType, customSubject, customMessage } =
      await request.json();

    // Fetch recipients from applications table
    const recipients = await db.application.findMany({
      where: { id: { in: recipientIds } },
      select: { id: true, email: true, firstName: true },
    });

    // Send emails
    const results = await Promise.all(
      recipients.map(async (recipient) => {
        let emailData;

        if (
          templateType &&
          emailTemplates[templateType as keyof typeof emailTemplates]
        ) {
          emailData = (
            emailTemplates[
              templateType as keyof typeof emailTemplates
            ] as Function
          )(recipient.firstName);
        } else {
          emailData = {
            subject: customSubject,
            html: customMessage,
          };
        }

        const result = await sendEmail({
          to: recipient.email,
          ...emailData,
        });

        // Track delivery status
        const recipientKey = `${recipient.id}-${templateType || "custom"}`;
        try {
          await db.castingEmailDeliveryStatus.upsert({
            where: { recipientKey },
            create: {
              recipientKey,
              applicationId: recipient.id,
              email: recipient.email,
              lastStatus: result.success ? "success" : "failed",
              lastSubject: emailData.subject || null,
              attemptCount: 1,
              successCount: result.success ? 1 : 0,
              lastAttemptAt: new Date(),
              lastSuccessAt: result.success ? new Date() : null,
            },
            update: {
              lastStatus: result.success ? "success" : "failed",
              lastSubject: emailData.subject || null,
              attemptCount: { increment: 1 },
              successCount: result.success ? { increment: 1 } : undefined,
              lastAttemptAt: new Date(),
              lastSuccessAt: result.success ? new Date() : undefined,
            },
          });
        } catch (trackErr) {
          console.error("Failed to track email delivery:", trackErr);
        }

        return result;
      }),
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 },
    );
  }
}
