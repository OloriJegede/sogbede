export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import MessagesClient from "./MessagesClient";

export default async function MessagesPage() {
  // Fetch all non-removed applications as potential recipients
  const applications = await db.application.findMany({
    where: { status: { not: "removed" } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      status: true,
    },
    orderBy: { lastName: "asc" },
  });

  // Fetch recent email delivery history
  const emailHistory = await db.castingEmailDeliveryStatus.findMany({
    orderBy: { lastAttemptAt: "desc" },
    take: 20,
    include: {
      application: {
        select: { firstName: true, lastName: true },
      },
    },
  });

  const serializedHistory = emailHistory.map((h) => ({
    ...h,
    lastAttemptAt: h.lastAttemptAt?.toISOString() ?? null,
    lastSuccessAt: h.lastSuccessAt?.toISOString() ?? null,
    createdAt: h.createdAt?.toISOString() ?? null,
    updatedAt: h.updatedAt?.toISOString() ?? null,
  }));

  return (
    <MessagesClient
      applications={applications}
      emailHistory={serializedHistory}
    />
  );
}
