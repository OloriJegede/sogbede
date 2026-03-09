export const dynamic = "force-dynamic";

import React from "react";
import { FileText, Clock, CalendarDays, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfToday.getDate() - startOfToday.getDay());

  const [totalCount, pendingCount, todayCount, thisWeekCount, recentApps] =
    await Promise.all([
      db.application.count(),
      db.application.count({ where: { status: "pending" } }),
      db.application.count({ where: { createdAt: { gte: startOfToday } } }),
      db.application.count({ where: { createdAt: { gte: startOfWeek } } }),
      db.application.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          mediaUrl: true,
          createdAt: true,
          status: true,
        },
      }),
    ]);

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

      <Card>
        <CardHeader>
          <CardTitle className="text-[20px] text-[#1C1A1A]">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[12px] font-semibold text-[#615552] w-[60px]">
                  Photo
                </TableHead>
                <TableHead className="text-[12px] font-semibold text-[#615552]">
                  Name
                </TableHead>
                <TableHead className="text-[12px] font-semibold text-[#615552]">
                  Email
                </TableHead>
                <TableHead className="text-[12px] font-semibold text-[#615552]">
                  Date
                </TableHead>
                <TableHead className="text-[12px] font-semibold text-[#615552]">
                  Status
                </TableHead>
                <TableHead className="text-[12px] font-semibold text-[#615552]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApps.map((app) => (
                <TableRow key={app.id} className="hover:bg-[#FAF9F8]">
                  <TableCell>
                    {app.mediaUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={app.mediaUrl}
                        alt={`${app.firstName} ${app.lastName}`}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#3A2B27] flex items-center justify-center text-white text-xs font-semibold">
                        {app.firstName[0]}
                        {app.lastName[0]}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#1C1A1A]">
                    {app.firstName} {app.lastName}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#615552]">
                    {app.email}
                  </TableCell>
                  <TableCell className="text-[14px] text-[#615552]">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-[12px] capitalize ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : app.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link href={`/admin/applicants`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#3A2B27]"
                      >
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {recentApps.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-[14px] text-[#615552] py-8"
                  >
                    No applications yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
