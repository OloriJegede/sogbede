export const dynamic = "force-dynamic";

import React from "react";
import { db } from "@/lib/db";
import ApplicationsClient from "./ApplicationsClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ApplicationsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const dateFrom =
    typeof params.dateFrom === "string" ? params.dateFrom : undefined;
  const dateTo = typeof params.dateTo === "string" ? params.dateTo : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;

  const where: Record<string, unknown> = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
    ];
  }

  if (dateFrom || dateTo) {
    const createdAtFilter: Record<string, unknown> = {};
    if (dateFrom) createdAtFilter.gte = new Date(`${dateFrom}T00:00:00`);
    if (dateTo) createdAtFilter.lte = new Date(`${dateTo}T23:59:59`);
    where.createdAt = createdAtFilter;
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

  const applications = await db.application.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      categories: {
        include: { category: true },
      },
      consentRecord: true,
      consentRequest: true,
    },
  });

  return (
    <ApplicationsClient
      applications={JSON.parse(JSON.stringify(applications))}
      allCategories={JSON.parse(JSON.stringify(allCategories))}
      categoryCounts={categoryCounts}
      currentStatus={status || "all"}
      currentSearch={search || ""}
      currentDateFrom={dateFrom || ""}
      currentDateTo={dateTo || ""}
      currentCategory={category || "all"}
    />
  );
}
