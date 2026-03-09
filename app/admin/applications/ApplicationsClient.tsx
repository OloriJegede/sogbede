"use client";

import React, { useState, useTransition } from "react";
import { Search, ChevronDown, ChevronUp, Loader2, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import TablePagination from "@/components/ui/table-pagination";

const PAGE_SIZE = 10;

interface ApplicationWithRelations {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  filmingDate: string | null;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  mediaUrl: string | null;
  mediaFilename: string | null;
  mediaType: string | null;
  status: string;
  createdAt: string | null;
  adminNotes: string | null;
  occupation: string | null;
  interests: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  additionalNotes: string | null;
  consentRecord: { id: number; consentSignedAt: string | null } | null;
  consentRequest: { id: number; status: string } | null;
  categories: Array<{
    category: { id: number; categoryName: string; colorCode: string | null };
  }>;
}

interface CategoryOption {
  id: number;
  categoryName: string;
  colorCode: string | null;
}

interface Props {
  applications: ApplicationWithRelations[];
  allCategories: CategoryOption[];
  categoryCounts: Record<number, number>;
  currentStatus: string;
  currentSearch: string;
  currentDateFrom: string;
  currentDateTo: string;
  currentCategory: string;
}

export default function ApplicationsClient({
  applications,
  allCategories,
  categoryCounts,
  currentStatus,
  currentSearch,
  currentDateFrom,
  currentDateTo,
  currentCategory,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [dateFrom, setDateFrom] = useState(currentDateFrom);
  const [dateTo, setDateTo] = useState(currentDateTo);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [categoryUpdatingId, setCategoryUpdatingId] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaDialogUrl, setMediaDialogUrl] = useState<string | null>(null);

  const totalItems = applications.length;
  const paginatedApplications = applications.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const toggleCategory = async (
    appId: number,
    categoryId: number,
    isCurrentlyAssigned: boolean,
  ) => {
    const key = `${appId}-${categoryId}`;
    setCategoryUpdatingId(key);
    try {
      if (isCurrentlyAssigned) {
        await fetch(`/api/applications/${appId}/categories`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId }),
        });
      } else {
        await fetch(`/api/applications/${appId}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId }),
        });
      }
      router.refresh();
    } finally {
      setCategoryUpdatingId(null);
    }
  };

  const navigate = (url: string) => {
    startTransition(() => {
      router.push(url);
    });
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (key === "status") params.set("status", value);
    else if (currentStatus !== "all") params.set("status", currentStatus);

    if (key === "search") params.set("search", value);
    else if (search) params.set("search", search);

    if (key === "dateFrom") {
      if (value) params.set("dateFrom", value);
    } else if (dateFrom) params.set("dateFrom", dateFrom);

    if (key === "dateTo") {
      if (value) params.set("dateTo", value);
    } else if (dateTo) params.set("dateTo", dateTo);

    if (key === "category") {
      if (value && value !== "all") params.set("category", value);
    } else if (currentCategory !== "all")
      params.set("category", currentCategory);

    navigate(`/admin/applications?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", search);
  };

  // Calculate completeness based on filled fields
  const getCompleteness = (app: ApplicationWithRelations) => {
    const fields = [
      app.firstName,
      app.lastName,
      app.email,
      app.phone,
      app.mediaUrl,
      app.filmingDate,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Applications
        </h1>
        <p className="text-[#615552] text-[14px]">
          View and manage all submitted applications
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 mb-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777676] w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select
              defaultValue={currentStatus}
              onValueChange={(v) => updateFilters("status", v)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-[#FAF9F8] border-[#ECE8E4] h-[42px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              defaultValue={currentCategory}
              onValueChange={(v) => updateFilters("category", v)}
            >
              <SelectTrigger className="w-full md:w-[200px] bg-[#FAF9F8] border-[#ECE8E4] h-[42px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    <span className="flex items-center gap-2">
                      {cat.colorCode && (
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: cat.colorCode }}
                        />
                      )}
                      {cat.categoryName}
                      <span className="text-[11px] text-[#999] ml-auto">
                        ({categoryCounts[cat.id] || 0})
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="bg-[#3A2B27] text-white h-[42px]">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-[12px] text-[#777676] mb-1 block">
                From Date
              </label>
              <Input
                type="date"
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  updateFilters("dateFrom", e.target.value);
                }}
              />
            </div>
            <div className="flex-1">
              <label className="text-[12px] text-[#777676] mb-1 block">
                To Date
              </label>
              <Input
                type="date"
                className="bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  updateFilters("dateTo", e.target.value);
                }}
              />
            </div>
            {(dateFrom || dateTo) && (
              <Button
                variant="outline"
                className="h-[42px] text-[13px]"
                onClick={() => {
                  setDateFrom("");
                  setDateTo("");
                  const params = new URLSearchParams();
                  if (currentStatus !== "all")
                    params.set("status", currentStatus);
                  if (search) params.set("search", search);
                  if (currentCategory !== "all")
                    params.set("category", currentCategory);
                  navigate(`/admin/applications?${params.toString()}`);
                }}
              >
                Clear Dates
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 relative">
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF9F8]">
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    ID
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552] w-[60px]">
                    Photo
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Applicant Name
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Email
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Submitted
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Partner
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Filming Date
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Details
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.map((app) => {
                  const completeness = getCompleteness(app);
                  void completeness; // retained for potential reuse
                  return (
                    <React.Fragment key={app.id}>
                      <TableRow
                        className="hover:bg-[#FAF9F8] cursor-pointer"
                        onClick={() =>
                          setExpandedId(expandedId === app.id ? null : app.id)
                        }
                      >
                        <TableCell className="text-[14px] text-[#1C1A1A] font-semibold">
                          #{app.id}
                        </TableCell>
                        <TableCell>
                          {app.mediaUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={app.mediaUrl}
                              alt={`${app.firstName} ${app.lastName}`}
                              className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3A2B27]"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMediaDialogUrl(app.mediaUrl!);
                              }}
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
                            : "—"}
                        </TableCell>
                        <TableCell className="text-[14px] text-[#615552]">
                          {app.partnerFirstName ? "Yes" : "No"}
                        </TableCell>
                        <TableCell className="text-[14px] text-[#615552]">
                          {app.filmingDate
                            ? new Date(app.filmingDate).toLocaleDateString()
                            : "Not set"}
                        </TableCell>
                        <TableCell>
                          {expandedId === app.id ? (
                            <ChevronUp className="w-4 h-4 text-[#3A2B27]" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-[#3A2B27]" />
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedId === app.id && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-[#FAF9F8] p-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              {app.occupation && (
                                <div>
                                  <p className="text-[#777676] text-xs">
                                    Occupation
                                  </p>
                                  <p>{app.occupation}</p>
                                </div>
                              )}
                              {app.interests && (
                                <div>
                                  <p className="text-[#777676] text-xs">
                                    Interests
                                  </p>
                                  <p>{app.interests}</p>
                                </div>
                              )}
                              {app.mediaUrl && (
                                <div>
                                  <p className="text-[#777676] text-xs">
                                    Media
                                  </p>
                                  <a
                                    href={app.mediaUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline"
                                  >
                                    {app.mediaFilename || "View Media"}
                                  </a>
                                  {app.mediaType && (
                                    <span className="text-xs text-gray-400 ml-1">
                                      ({app.mediaType})
                                    </span>
                                  )}
                                </div>
                              )}
                              {app.additionalNotes && (
                                <div className="col-span-2">
                                  <p className="text-[#777676] text-xs">
                                    Additional Notes
                                  </p>
                                  <p>{app.additionalNotes}</p>
                                </div>
                              )}
                              {app.adminNotes && (
                                <div className="col-span-2">
                                  <p className="text-[#777676] text-xs">
                                    Admin Notes
                                  </p>
                                  <p>{app.adminNotes}</p>
                                </div>
                              )}
                              {app.categories.length > 0 && (
                                <div className="col-span-2">
                                  <p className="text-[#777676] text-xs mb-1">
                                    Categories
                                  </p>
                                  <div className="flex gap-1 flex-wrap">
                                    {app.categories.map((ac) => (
                                      <span
                                        key={ac.category.id}
                                        className="px-2 py-0.5 rounded text-xs text-white"
                                        style={{
                                          backgroundColor:
                                            ac.category.colorCode || "#3b82f6",
                                        }}
                                      >
                                        {ac.category.categoryName}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Category Assignment */}
                            <div className="mt-4 pt-3 border-t border-[#ECE8E4]">
                              <p className="text-[#777676] text-xs mb-2">
                                Manage Categories
                              </p>
                              <div className="flex gap-2 flex-wrap">
                                {allCategories.map((cat) => {
                                  const isAssigned = app.categories.some(
                                    (ac) => ac.category.id === cat.id,
                                  );
                                  const updateKey = `${app.id}-${cat.id}`;
                                  const isUpdating =
                                    categoryUpdatingId === updateKey;
                                  return (
                                    <button
                                      key={cat.id}
                                      disabled={isUpdating}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCategory(
                                          app.id,
                                          cat.id,
                                          isAssigned,
                                        );
                                      }}
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border ${
                                        isAssigned
                                          ? "text-white border-transparent"
                                          : "bg-white text-[#615552] border-[#ECE8E4] hover:border-[#3A2B27]"
                                      } ${isUpdating ? "opacity-50" : "cursor-pointer"}`}
                                      style={
                                        isAssigned
                                          ? {
                                              backgroundColor:
                                                cat.colorCode || "#3b82f6",
                                            }
                                          : undefined
                                      }
                                    >
                                      {isUpdating ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                      ) : isAssigned ? (
                                        <X className="w-3 h-3" />
                                      ) : (
                                        <Plus className="w-3 h-3" />
                                      )}
                                      {cat.categoryName}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
                {applications.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-[14px] text-[#615552] py-8"
                    >
                      No applications found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4">
        <TablePagination
          currentPage={currentPage}
          totalItems={totalItems}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          noun="application"
        />
      </div>

      {/* Media preview dialog */}
      <Dialog
        open={!!mediaDialogUrl}
        onOpenChange={(o) => !o && setMediaDialogUrl(null)}
      >
        <DialogContent className="max-w-xl p-2 bg-black">
          {mediaDialogUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={mediaDialogUrl}
              alt="Media preview"
              className="w-full h-auto rounded max-h-[80vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
