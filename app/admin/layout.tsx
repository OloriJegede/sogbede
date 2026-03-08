"use client";

import SideMenu from "@/components/Sidebar/SideMenu";
import TopBar from "@/components/Sidebar/TopBar";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";
  const [adminName, setAdminName] = useState<string | undefined>();

  useEffect(() => {
    if (isLoginRoute) return;

    fetch("/api/admin/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.name) setAdminName(data.name);
      })
      .catch(() => {});
  }, [isLoginRoute]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen">
      <div className="w-[250px]">
        <SideMenu adminName={adminName} />
      </div>
      <div className="flex-1 flex flex-col">
        <TopBar adminName={adminName} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
