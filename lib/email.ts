import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

// Email Templates
export const emailTemplates = {
  applicationReceived: (name: string, applicationId: string) => ({
    subject: "Application Received - SoGbédè",
    html: `
      <h1>Hello ${name},</h1>
      <p>Thank you for your application to SoGbédè!</p>
      <p>Your application ID is: <strong>${applicationId}</strong></p>
      <p>We'll review your application and get back to you soon.</p>
    `,
  }),

  applicationApproved: (
    name: string,
    filmingDate: string,
    location: string,
  ) => ({
    subject: "Application Approved - SoGbédè",
    html: `
      <h1>Congratulations ${name}!</h1>
      <p>Your application has been approved!</p>
      <p><strong>Filming Date:</strong> ${filmingDate}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p>We look forward to seeing you!</p>
    `,
  }),

  applicationRejected: (name: string) => ({
    subject: "Application Update - SoGbédè",
    html: `
      <h1>Hello ${name},</h1>
      <p>Thank you for your interest in SoGbédè.</p>
      <p>Unfortunately, we are unable to proceed with your application at this time.</p>
      <p>We appreciate your interest and wish you all the best.</p>
    `,
  }),

  filmingReminder: (name: string, filmingDate: string, location: string) => ({
    subject: "Filming Date Reminder - SoGbédè",
    html: `
      <h1>Hello ${name},</h1>
      <p>This is a reminder about your upcoming filming session:</p>
      <p><strong>Date:</strong> ${filmingDate}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p>Please arrive 15 minutes early.</p>
    `,
  }),

  castingInvite: ({
    name,
    subject,
    shootDate,
    arrivalTime,
    studio,
    studioMapLink,
    greeting,
    senderName,
    closingSignature,
  }: {
    name: string;
    subject: string;
    shootDate: string;
    arrivalTime: string;
    studio: string;
    studioMapLink: string;
    greeting: string;
    senderName: string;
    closingSignature: string;
  }) => ({
    subject,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAF7F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F3;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:#3A2B27;padding:28px 32px;text-align:center;">
  <h1 style="color:#fff;margin:0;font-size:22px;letter-spacing:0.5px;">ṢOGBÉDÈ</h1>
  <p style="color:#FAF9F8;margin:6px 0 0;font-size:13px;opacity:0.8;">Casting Team</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px;">
  <p style="font-size:15px;color:#1C1A1A;margin:0 0 20px;line-height:1.6;">${greeting || `Hello ${name}`},</p>

  <p style="font-size:15px;color:#1C1A1A;margin:0 0 24px;line-height:1.6;">
    We are thrilled to let you know that <strong>you have been officially selected</strong> to appear on ṢOGBÉDÈ! 🎬
  </p>

  <!-- Details Card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F3;border-radius:8px;border:1px solid #ECE8E4;margin:0 0 24px;">
  <tr><td style="padding:20px 24px;">
    <p style="margin:0 0 4px;font-size:12px;color:#615552;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Your Shoot Details</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#615552;width:120px;">📅 Date</td>
      <td style="padding:8px 0;font-size:14px;color:#1C1A1A;font-weight:600;">${shootDate}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#615552;">⏰ Arrival Time</td>
      <td style="padding:8px 0;font-size:14px;color:#1C1A1A;font-weight:600;">${arrivalTime}</td>
    </tr>
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#615552;">🎥 Studio</td>
      <td style="padding:8px 0;font-size:14px;color:#1C1A1A;font-weight:600;">${studio}</td>
    </tr>
    </table>

    ${studioMapLink ? `<a href="${studioMapLink}" target="_blank" style="display:inline-block;margin-top:12px;background:#3A2B27;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:13px;font-weight:600;">📍 View Studio Location</a>` : ""}
  </td></tr>
  </table>

  <p style="font-size:14px;color:#615552;margin:0 0 8px;line-height:1.6;">
    Please arrive at least <strong>15 minutes before</strong> your scheduled time. Bring a valid photo ID.
  </p>

  <p style="font-size:14px;color:#615552;margin:0 0 24px;line-height:1.6;">
    If you have questions or need to reschedule, reply directly to this email.
  </p>

  <!-- Signature -->
  <p style="font-size:14px;color:#1C1A1A;margin:0;line-height:1.6;white-space:pre-line;">${closingSignature}${senderName ? `\n\n— ${senderName}` : ""}</p>
</td></tr>

<!-- Footer -->
<tr><td style="background:#FAF7F3;padding:20px 32px;text-align:center;border-top:1px solid #ECE8E4;">
  <p style="margin:0;font-size:12px;color:#777676;">© ${new Date().getFullYear()} ṢOGBÉDÈ. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  }),
};
