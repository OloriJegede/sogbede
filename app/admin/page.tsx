export const dynamic = "force-dynamic";

import React from "react";
import { FileText, Clock, CalendarDays, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import ApplicantsClient from "./applicants/ApplicantsClient";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const partner =
    typeof params.partner === "string" ? params.partner : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const category =
    typeof params.category === "string" ? params.category : undefined;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const where: Record<string, unknown> = {};

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

  const [
    totalCount,
    pendingCount,
    todayCount,
    thisWeekCount,
    applicants,
    allCategories,
    allCategoryLinks,
  ] = await Promise.all([
    db.application.count(),
    db.application.count({ where: { status: "pending" } }),
    db.application.count({ where: { createdAt: { gte: startOfToday } } }),
    db.application.count({ where: { createdAt: { gte: startOfWeek } } }),
    db.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        visibility: true,
        categories: {
          include: { category: true },
        },
      },
    }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.applicationCategory.findMany(),
  ]);

  const categoryCounts: Record<number, number> = {};
  for (const link of allCategoryLinks) {
    categoryCounts[link.categoryId] =
      (categoryCounts[link.categoryId] || 0) + 1;
  }

  const stats = [
    {
      title: "Total Applications",
      value: totalCount.toString(),
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Pending Review",
      value: pendingCount.toString(),
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "Applied Today",
      value: todayCount.toString(),
      icon: CalendarDays,
      color: "text-green-600",
    },
    {
      title: "Applied This Week",
      value: thisWeekCount.toString(),
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Dashboard
        </h1>
        <p className="text-[#615552] text-[14px]">
          Welcome back! Here's what's happening with SoGbédè applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[14px] font-medium text-[#615552]">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-[32px] font-bold text-[#1C1A1A]">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ApplicantsClient
        applicants={JSON.parse(JSON.stringify(applicants))}
        allCategories={JSON.parse(JSON.stringify(allCategories))}
        categoryCounts={categoryCounts}
        currentPartner={partner || "all"}
        currentSearch={search || ""}
        currentCategory={category || "all"}
        basePath="/admin"
      />
    </div>
  );
}
