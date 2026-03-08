"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  noun?: string;
}

export default function TablePagination({
  currentPage,
  totalItems,
  pageSize = 10,
  onPageChange,
  noun = "item",
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  if (totalItems === 0) {
    return (
      <div className="flex items-center justify-between px-2 py-3">
        <p className="text-[13px] text-[#615552]">No {noun}s found</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between px-2 py-3">
      <p className="text-[13px] text-[#615552]">
        Showing {start}–{end} of {totalItems} {noun}
        {totalItems !== 1 ? "s" : ""}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-[13px]"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-[13px] text-[#615552] min-w-[80px] text-center">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-[13px]"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
