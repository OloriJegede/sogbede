export const dynamic = "force-dynamic";

import React from "react";
import { db } from "@/lib/db";
import ApplicantsClient from "./ApplicantsClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApplicantsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const partner =
    typeof params.partner === "string" ? params.partner : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;

  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (partner === "yes") {
    where.partnerFirstName = { not: null };
  } else if (partner === "no") {
    where.partnerFirstName = null;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  if (category && category !== "all") {
    where.categories = {
      some: { categoryId: parseInt(category) },
    };
  }

  // Fetch all categories for filter dropdown
  const allCategories = await db.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Fetch category counts (total applications per category)
  const allCategoryLinks = await db.applicationCategory.findMany();
  const categoryCounts: Record<number, number> = {};
  for (const link of allCategoryLinks) {
    categoryCounts[link.categoryId] =
      (categoryCounts[link.categoryId] || 0) + 1;
  }

  const applicants = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      visibility: true,
      categories: {
        include: { category: true },
      },
    },
  });

  return (
    <ApplicantsClient
      applicants={JSON.parse(JSON.stringify(applicants))}
      allCategories={JSON.parse(JSON.stringify(allCategories))}
      categoryCounts={categoryCounts}
      currentStatus={status || "all"}
      currentPartner={partner || "all"}
      currentSearch={search || ""}
      currentCategory={category || "all"}
    />
  );
}
