"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Home,
  Settings,
  Calendar,
  Clapperboard,
  LogOut,
  Loader2,
} from "lucide-react";

const SideMenu = ({ adminName }: { adminName?: string }) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const menuItems = [
    { name: "Home", icon: Home, href: "/admin" },
    { name: "Episode Planner", icon: Calendar, href: "/admin/filming-dates" },
    {
      name: "Casting Emails",
      icon: Clapperboard,
      href: "/admin/casting-emails",
    },
    { name: "Settings", icon: Settings, href: "/admin/settings" },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {
      // ignore – we redirect regardless
    }
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="w-64 h-screen bg-[#3A2B27] text-white p-6 flex flex-col">
      <div className="mb-8">
        <Image
          src="/logo-white.svg"
          alt="SoGbédè Logo"
          width={120}
          height={32}
        />
        <p className="text-[12px] text-[#FAF9F8] opacity-70 pt-8">
          Admin Dashboard
        </p>
      </div>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#4A3B37] transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-[14px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {adminName && (
        <p className="text-[12px] text-[#FAF9F8] opacity-60 px-4 mb-2 truncate">
          Signed in as {adminName}
        </p>
      )}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-[#4A3B37] transition-colors text-[#FAF9F8] border-t border-[#4A3B37] pt-4 mt-4 disabled:opacity-50"
      >
        {loggingOut ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <LogOut className="w-5 h-5" />
        )}
        <span className="text-[14px]">
          {loggingOut ? "Logging out…" : "Logout"}
        </span>
      </button>
    </div>
  );
};

export default SideMenu;
