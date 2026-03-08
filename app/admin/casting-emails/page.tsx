export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import CastingEmailsClient from "./CastingEmailsClient";

export default async function CastingEmailsPage() {
  // Fetch applicants in the "Ready to Shine" category
  const recipients = await db.application.findMany({
    where: {
      categories: {
        some: {
          category: {
            categorySlug: "ready-to-shine",
          },
        },
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      mediaUrl: true,
      filmingDate: true,
    },
    orderBy: { lastName: "asc" },
  });

  // Fetch casting email delivery history
  const emailHistory = await db.castingEmailDeliveryStatus.findMany({
    orderBy: { lastAttemptAt: "desc" },
    take: 50,
    include: {
      application: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  const serializedRecipients = recipients.map((r) => ({
    ...r,
    filmingDate: r.filmingDate?.toISOString() ?? null,
  }));

  const serializedHistory = emailHistory.map((h) => ({
    ...h,
    lastAttemptAt: h.lastAttemptAt?.toISOString() ?? null,
    lastSuccessAt: h.lastSuccessAt?.toISOString() ?? null,
    createdAt: h.createdAt?.toISOString() ?? null,
    updatedAt: h.updatedAt?.toISOString() ?? null,
  }));

  return (
    <CastingEmailsClient
      recipients={serializedRecipients}
      emailHistory={serializedHistory}
    />
  );
}
