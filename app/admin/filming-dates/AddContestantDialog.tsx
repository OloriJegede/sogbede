"use client";

import React, { useEffect, useState } from "react";
import { Plus, Loader2, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Applicant {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mediaUrl: string | null;
  status: string;
  categories: {
    category: {
      id: number;
      categoryName: string;
      categorySlug: string;
    };
  }[];
}

interface Props {
  episodeId: number;
  teamNumber: number;
  seatNumber: number;
  existingMemberAppIds: number[];
  onAdded: () => void;
}

export default function AddContestantDialog({
  episodeId,
  teamNumber,
  seatNumber,
  existingMemberAppIds,
  onAdded,
}: Props) {
  const [open, setOpen] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [readyToShineOnly, setReadyToShineOnly] = useState(true);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Fetch applicants when dialog opens
  useEffect(() => {
    if (!open) return;

    setLoadingApplicants(true);
    setError("");

    fetch("/api/applicants")
      .then((res) => (res.ok ? res.json() : Promise.reject("Failed to load")))
      .then((data: Applicant[]) => setApplicants(data))
      .catch(() => setError("Failed to load applicants"))
      .finally(() => setLoadingApplicants(false));
  }, [open]);

  const filtered = applicants.filter((a) => {
    // Exclude applicants already in this episode
    if (existingMemberAppIds.includes(a.id)) return false;

    // Search filter
    const q = searchQuery.toLowerCase();
    if (
      q &&
      !`${a.firstName} ${a.lastName}`.toLowerCase().includes(q) &&
      !a.email.toLowerCase().includes(q)
    ) {
      return false;
    }

    // "Ready to Shine" category filter
    if (readyToShineOnly) {
      const hasCategory = a.categories?.some(
        (c) =>
          c.category.categorySlug === "ready-to-shine" ||
          c.category.categoryName.toLowerCase().includes("ready to shine"),
      );
      if (!hasCategory) return false;
    }

    return true;
  });

  const handleAdd = async (applicant: Applicant) => {
    setAddingId(applicant.id);
    setError("");

    try {
      const res = await fetch(`/api/episodes/${episodeId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: applicant.id,
          teamNumber,
          seatNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add contestant");
        return;
      }

      setOpen(false);
      setSearchQuery("");
      onAdded();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setSearchQuery("");
          setError("");
        }
      }}
    >
      <DialogTrigger asChild>
        <button className="flex flex-col items-center gap-1 p-3 border-2 border-dashed border-[#ECE8E4] rounded-lg hover:border-[#3A2B27] hover:bg-[#FAF9F8] transition-colors cursor-pointer group w-full">
          <Plus className="w-5 h-5 text-[#777676] group-hover:text-[#3A2B27]" />
          <span className="text-[11px] text-[#777676] group-hover:text-[#3A2B27]">
            + Add contestant
          </span>
          <span className="text-[10px] text-[#999] group-hover:text-[#615552]">
            Slot {seatNumber}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-[20px] text-[#1C1A1A] montserrat-semibold">
            Add Contestant
          </DialogTitle>
          <p className="text-[13px] text-[#615552]">
            Team {teamNumber}, Seat {seatNumber} — Select an applicant
          </p>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-[13px]">
            {error}
          </div>
        )}

        {/* Search + filter */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777676]" />
            <Input
              placeholder="Search by name or email…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-[42px] bg-[#FAF9F8] border-[#ECE8E4]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="ready-to-shine"
              checked={readyToShineOnly}
              onCheckedChange={(v) => setReadyToShineOnly(v === true)}
            />
            <Label
              htmlFor="ready-to-shine"
              className="text-[13px] text-[#615552] cursor-pointer"
            >
              Only show &quot;Ready to Shine&quot; category
            </Label>
          </div>
        </div>

        {/* Applicant list */}
        <div className="flex-1 overflow-y-auto min-h-0 mt-2 -mx-1 px-1">
          {loadingApplicants ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-[#3A2B27]" />
              <span className="ml-2 text-[13px] text-[#615552]">
                Loading applicants…
              </span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[13px] text-[#777676]">
                {applicants.length === 0
                  ? "No applicants found."
                  : "No applicants match your search."}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((a) => {
                const isAdding = addingId === a.id;
                const cats =
                  a.categories
                    ?.map((c) => c.category.categoryName)
                    .join(", ") || "";

                return (
                  <div
                    key={a.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-[#ECE8E4] hover:border-[#3A2B27] hover:bg-[#FAF9F8] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {a.mediaUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={a.mediaUrl}
                          alt={`${a.firstName} ${a.lastName}`}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-[#3A2B27] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                          {a.firstName[0]}
                          {a.lastName[0]}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[14px] font-medium text-[#1C1A1A] truncate">
                          {a.firstName} {a.lastName}
                        </p>
                        <p className="text-[12px] text-[#777676] truncate">
                          {a.email}
                        </p>
                        {cats && (
                          <p className="text-[11px] text-[#999] truncate">
                            {cats}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      disabled={isAdding}
                      onClick={() => handleAdd(a)}
                      className="bg-[#3A2B27] hover:bg-[#4A3B37] text-white ml-3 flex-shrink-0"
                    >
                      {isAdding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5 mr-1" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
