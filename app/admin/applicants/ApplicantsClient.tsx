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

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  age: number | null;
  partnerFirstName: string | null;
  partnerLastName: string | null;
  status: string;
  createdAt: string | null;
  mediaUrl: string | null;
  instagramHandle: string | null;
  tiktokHandle: string | null;
  visibility: { isHidden: boolean } | null;
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
  applicants: Applicant[];
  allCategories: CategoryOption[];
  categoryCounts: Record<number, number>;
  currentStatus: string;
  currentPartner: string;
  currentSearch: string;
  currentCategory: string;
}

export default function ApplicantsClient({
  applicants,
  allCategories,
  categoryCounts,
  currentStatus,
  currentPartner,
  currentSearch,
  currentCategory,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [categoryUpdatingId, setCategoryUpdatingId] = useState<string | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [mediaDialogUrl, setMediaDialogUrl] = useState<string | null>(null);

  // Reset page when data changes
  const totalItems = applicants.length;
  const paginatedApplicants = applicants.slice(
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

    if (key === "partner") params.set("partner", value);
    else if (currentPartner !== "all") params.set("partner", currentPartner);

    if (key === "search") params.set("search", value);
    else if (search) params.set("search", search);

    if (key === "category") {
      if (value && value !== "all") params.set("category", value);
    } else if (currentCategory !== "all")
      params.set("category", currentCategory);

    navigate(`/admin/applicants?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", search);
  };

  const updateStatus = async (id: number, status: string) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-8 bg-[#FAF7F3] min-h-screen">
      <div className="mb-8">
        <h1 className="text-[32px] text-[#1C1A1A] montserrat-semibold mb-2">
          Applicants
        </h1>
        <p className="text-[#615552] text-[14px]">
          Manage all SoGbédè applications
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
                placeholder="Search by name, email, or phone..."
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
              defaultValue={currentPartner}
              onValueChange={(v) => updateFilters("partner", v)}
            >
              <SelectTrigger className="w-full md:w-[180px] bg-[#FAF9F8] border-[#ECE8E4] h-[42px]">
                <SelectValue placeholder="Partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="yes">With Partner</SelectItem>
                <SelectItem value="no">Solo</SelectItem>
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0 relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/60 z-10 flex flex-col items-center justify-center gap-3 rounded-lg">
              <Loader2 className="w-6 h-6 animate-spin text-[#3A2B27]" />
              <div className="w-full max-w-md space-y-3 px-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-36 flex-1" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#FAF9F8]">
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
                    Phone
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Location
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Age
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Partner
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Date
                  </TableHead>
                  <TableHead className="text-[12px] font-semibold text-[#615552]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplicants.map((applicant) => (
                  <React.Fragment key={applicant.id}>
                    <TableRow
                      className={`hover:bg-[#FAF9F8] cursor-pointer ${applicant.visibility?.isHidden ? "opacity-50" : ""}`}
                      onClick={() =>
                        setExpandedId(
                          expandedId === applicant.id ? null : applicant.id,
                        )
                      }
                    >
                      <TableCell>
                        {applicant.mediaUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={applicant.mediaUrl}
                            alt={`${applicant.firstName} ${applicant.lastName}`}
                            className="w-9 h-9 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-[#3A2B27]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMediaDialogUrl(applicant.mediaUrl!);
                            }}
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#3A2B27] flex items-center justify-center text-white text-xs font-semibold">
                            {applicant.firstName[0]}
                            {applicant.lastName[0]}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#1C1A1A]">
                        {applicant.firstName} {applicant.lastName}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {applicant.email}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {applicant.phone || "—"}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {[applicant.city, applicant.state]
                          .filter(Boolean)
                          .join(", ") || "—"}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {applicant.age || "—"}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {applicant.partnerFirstName ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-[14px] text-[#615552]">
                        {applicant.createdAt
                          ? new Date(applicant.createdAt).toLocaleDateString()
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {expandedId === applicant.id ? (
                          <ChevronUp className="w-4 h-4 text-[#3A2B27]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#3A2B27]" />
                        )}
                      </TableCell>
                    </TableRow>
                    {expandedId === applicant.id && (
                      <TableRow>
                        <TableCell colSpan={9} className="bg-[#FAF9F8] p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-[#777676] text-xs">Country</p>
                              <p>{applicant.country || "—"}</p>
                            </div>
                            {applicant.partnerFirstName && (
                              <div>
                                <p className="text-[#777676] text-xs">
                                  Partner
                                </p>
                                <p>
                                  {applicant.partnerFirstName}{" "}
                                  {applicant.partnerLastName}
                                </p>
                              </div>
                            )}
                            {applicant.instagramHandle && (
                              <div>
                                <p className="text-[#777676] text-xs">
                                  Instagram
                                </p>
                                <p>{applicant.instagramHandle}</p>
                              </div>
                            )}
                            {applicant.tiktokHandle && (
                              <div>
                                <p className="text-[#777676] text-xs">TikTok</p>
                                <p>{applicant.tiktokHandle}</p>
                              </div>
                            )}
                            {applicant.mediaUrl && (
                              <div>
                                <p className="text-[#777676] text-xs">Media</p>
                                <a
                                  href={applicant.mediaUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  View Media
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 mt-4">
                            {applicant.status !== "approved" && (
                              <Button
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-700"
                                disabled={updatingId === applicant.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(applicant.id, "approved");
                                }}
                              >
                                Approve
                              </Button>
                            )}
                            {applicant.status !== "rejected" && (
                              <Button
                                size="sm"
                                className="bg-red-600 text-white hover:bg-red-700"
                                disabled={updatingId === applicant.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(applicant.id, "rejected");
                                }}
                              >
                                Reject
                              </Button>
                            )}
                            {applicant.status !== "pending" && (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={updatingId === applicant.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(applicant.id, "pending");
                                }}
                              >
                                Set Pending
                              </Button>
                            )}
                          </div>

                          {/* Category Assignment */}
                          <div className="mt-4 pt-3 border-t border-[#ECE8E4]">
                            <p className="text-[#777676] text-xs mb-2">
                              Manage Categories
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              {allCategories.map((cat) => {
                                const isAssigned = applicant.categories.some(
                                  (ac) => ac.category.id === cat.id,
                                );
                                const updateKey = `${applicant.id}-${cat.id}`;
                                const isUpdating =
                                  categoryUpdatingId === updateKey;
                                return (
                                  <button
                                    key={cat.id}
                                    disabled={isUpdating}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleCategory(
                                        applicant.id,
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
                ))}
                {applicants.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-[14px] text-[#615552] py-8"
                    >
                      No applicants found.
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
          noun="applicant"
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
