import React from "react";
import { Bell, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const TopBar = ({ adminName }: { adminName?: string }) => {
  return (
    <div className="h-16 bg-white border-b border-[#ECE8E4] px-6 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#777676] w-4 h-4" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-[#FAF9F8] border-[#ECE8E4] h-[42px]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-[#615552]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#3A2B27] rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <span className="text-[14px] text-[#1C1A1A]">
            {adminName || "Admin"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
