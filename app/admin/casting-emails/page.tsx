export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import CastingEmailsClient from "./CastingEmailsClient";

export default async function CastingEmailsPage() {
  // Fetch applicants in the "Ready to Shine" category (match by slug or name)
  const recipients = await db.application.findMany({
    where: {
      categories: {
        some: {
          category: {
            OR: [
              { categorySlug: "ready-to-shine" },
              { categoryName: "Ready to Shine" },
            ],
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

  // Fetch ALL applications for the compose tab
  const allApplications = await db.application.findMany({
    where: { status: { not: "removed" } },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      categories: {
        include: { category: true },
      },
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

  // Fetch all categories for the filter dropdown
  const allCategories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const serializedRecipients = recipients.map((r) => ({
    ...r,
    filmingDate: r.filmingDate?.toISOString() ?? null,
  }));

  const serializedApplications = allApplications.map((a) => ({
    ...a,
    categories: (a.categories ?? []).map((c) => ({
      category: {
        id: c.category.id,
        categoryName: c.category.categoryName,
        categorySlug: c.category.categorySlug,
      },
    })),
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
      allApplications={serializedApplications}
      allCategories={allCategories}
      emailHistory={serializedHistory}
    />
  );
}
