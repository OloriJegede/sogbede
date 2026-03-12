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

  filmingReminder: ({
    name,
    shootDate,
    arrivalTime,
    studio,
    studioMapLink,
    senderName,
    closingSignature,
  }: {
    name: string;
    shootDate: string;
    arrivalTime: string;
    studio: string;
    studioMapLink: string;
    senderName: string;
    closingSignature: string;
  }) => ({
    subject: "Filming Day Reminder - ṢoGbédè",
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F2EE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EE;padding:24px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#FDFCFB;border-radius:4px;overflow:hidden;">

<!-- Header -->
<tr><td style="background:#1C1A1A;padding:20px 28px;">
  <p style="color:#fff;margin:0;font-size:18px;font-weight:700;letter-spacing:1px;">ṢoGbédè</p>
  <p style="color:#aaa;margin:4px 0 0;font-size:12px;">Casting Team - ORIIA Studios</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px 28px;background:#FDFCFB;">
  <h2 style="font-size:24px;font-weight:700;color:#1C1A1A;margin:0 0 16px;line-height:1.2;">Filming Day Reminder</h2>

  <p style="font-size:14px;color:#333;margin:0 0 20px;line-height:1.7;">
    Hello <strong>${name}</strong>, this is a friendly reminder that your filming day for ṢoGbédè is coming up! We can't wait to see you.
  </p>

  <!-- Details Card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 24px;">
  <tr><td style="padding:16px 20px;">
    <p style="margin:0 0 8px;font-size:13px;color:#333;"><strong>Arrival Time:</strong> ${arrivalTime}</p>
    <p style="margin:0 0 8px;font-size:13px;color:#333;"><strong>Date:</strong> ${shootDate}</p>
    <p style="margin:0;font-size:13px;color:#333;"><strong>Studio:</strong> ${studioMapLink ? `<a href="${studioMapLink}" style="color:#3A2B27;font-weight:600;">${studio} (Open in Google Maps)</a>` : studio}</p>
  </td></tr>
  </table>

  <p style="font-size:14px;font-weight:700;color:#1C1A1A;margin:0 0 12px;">Quick Reminders:</p>

  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;"><strong>Arrive on time</strong> — your full experience will last approximately two hours.</p>
  </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#C9B49A;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#1C1A1A;margin:0;line-height:1.6;"><strong>Dress to impress</strong> — honor Yoruba pride. You'll be shown from head to toe.</p>
  </td></tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 24px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;"><strong>Bring your energy</strong> — you and your teammate can win up to $2,000!</p>
  </td></tr>
  </table>

  <p style="font-size:14px;color:#555;margin:0 0 20px;line-height:1.7;">
    We're looking forward to an amazing day celebrating Yoruba culture. See you soon!
  </p>

  <p style="font-size:14px;color:#555;margin:0 0 4px;line-height:1.6;">${closingSignature || "Ẹ seun lórpòlopò,"}</p>
  ${senderName ? `<p style="font-size:14px;color:#555;margin:0;line-height:1.6;">${senderName}</p>` : ""}
</td></tr>

<!-- Footer -->
<tr><td style="background:#F5F2EE;padding:16px 28px;border-top:1px solid #E0DBD5;">
  <p style="margin:0;font-size:11px;color:#999;text-align:center;">© ${new Date().getFullYear()} ṢoGbédè. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
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
<body style="margin:0;padding:0;background:#F5F2EE;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F2EE;padding:24px 16px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#FDFCFB;border-radius:4px;overflow:hidden;">

<!-- Header -->
<tr><td style="background:#1C1A1A;padding:20px 28px;">
  <p style="color:#fff;margin:0;font-size:18px;font-weight:700;letter-spacing:1px;">ṢoGbédè</p>
  <p style="color:#aaa;margin:4px 0 0;font-size:12px;">Casting Team - ORIIA Studios</p>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px 28px;background:#FDFCFB;">
  <p style="font-size:14px;color:#555;margin:0 0 12px;line-height:1.6;">${greeting || "Ẹ kú u dédé Ìwòyí o"}</p>

  <h2 style="font-size:28px;font-weight:700;color:#1C1A1A;margin:0 0 20px;line-height:1.2;">${name}</h2>

  <p style="font-size:14px;color:#333;margin:0 0 24px;line-height:1.7;">
    Congratulations on being selected to be on ṢoGbédè. We're excited to have you join us. Thank you for being part of this groundbreaking show celebrating Yoruba people, language, fashion, and culture.
  </p>

  <!-- Details Card -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 24px;">
  <tr><td style="padding:16px 20px;">
    <p style="margin:0 0 8px;font-size:13px;color:#333;"><strong>Arrival Time:</strong> ${arrivalTime}</p>
    <p style="margin:0 0 8px;font-size:13px;color:#333;"><strong>Date:</strong> ${shootDate}</p>
    <p style="margin:0;font-size:13px;color:#333;"><strong>Studio:</strong> ${studioMapLink ? `<a href="${studioMapLink}" style="color:#3A2B27;font-weight:600;">${studio} (Open in Google Maps)</a>` : studio}</p>
  </td></tr>
  </table>

  <p style="font-size:14px;color:#555;margin:0 0 24px;line-height:1.7;">
    Please note that your full experience at the studio will last approximately two hours. This includes orientation, glam, rehearsal, and filming. Arriving on time is essential so everything flows smoothly and you get the full ṢoGbédè experience.
  </p>

  <p style="font-size:14px;font-weight:700;color:#1C1A1A;margin:0 0 16px;line-height:1.6;">Here's what to expect on recording day:</p>

  <!-- Call Time & Arrival -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;"><strong>Call Time &amp; Arrival:</strong> Please arrive on time so you don't miss pre-show pampering and practice.</p>
  </td></tr>
  </table>

  <!-- What to Wear -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1C1A1A;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#fff;margin:0;line-height:1.6;"><strong>What to Wear:</strong> Dress to impress in a way that honors Yoruba pride. Coordinate with your teammate if possible, and remember you'll be shown from head to toe.</p>
  </td></tr>
  </table>

  <!-- Greenroom & Glam -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;"><strong>Greenroom &amp; Glam:</strong> After orientation, you'll enjoy refreshments, rehearsal, and touch-ups so you're camera-ready.</p>
  </td></tr>
  </table>

  <!-- The Show -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#C9B49A;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#1C1A1A;margin:0;line-height:1.6;"><strong>The Show:</strong> Intro, Kílorí, Kílogbó, Kílowí, and Outro. Each part gives room to have fun, earn points, and let your personality shine.</p>
  </td></tr>
  </table>

  <!-- Prize -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 8px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;">You and your teammate can win up to $2,000 on the show, so bring your energy and your Yoruba fluency.</p>
  </td></tr>
  </table>

  <!-- After the Show -->
  <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DBD5;border-radius:4px;margin:0 0 24px;">
  <tr><td style="padding:14px 18px;">
    <p style="font-size:13px;color:#333;margin:0;line-height:1.6;"><strong>After the Show:</strong> We may do a short exit interview and invite you to share your experience on social media. Don't forget your swag bag before heading out.</p>
  </td></tr>
  </table>

  <p style="font-size:14px;color:#555;margin:0 0 20px;line-height:1.7;">
    Thank you again for helping us preserve and celebrate Yoruba culture. We can't wait to see you.
  </p>

  <p style="font-size:14px;color:#555;margin:0 0 4px;line-height:1.6;">${closingSignature || "Ẹ seun lórpòlopò,"}</p>
  ${senderName ? `<p style="font-size:14px;color:#555;margin:0;line-height:1.6;">${senderName}</p>` : ""}
</td></tr>

<!-- Footer -->
<tr><td style="background:#F5F2EE;padding:16px 28px;border-top:1px solid #E0DBD5;">
  <p style="margin:0;font-size:11px;color:#999;text-align:center;">© ${new Date().getFullYear()} ṢoGbédè. All rights reserved.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
  }),
};
