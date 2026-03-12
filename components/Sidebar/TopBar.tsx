import React from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const routeNames: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/filming-dates": "Episode Planner",
  "/admin/casting-emails": "Casting Emails",
  "/admin/settings": "Settings",
};

const TopBar = ({ adminName }: { adminName?: string }) => {
  const pathname = usePathname();
  const routeName = routeNames[pathname] || "Admin";

  return (
    <div className="h-16 bg-white border-b border-[#ECE8E4] px-6 flex items-center justify-between">
      <h2 className="text-[20px] text-[#1C1A1A] montserrat-semibold">
        {routeName}
      </h2>

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
