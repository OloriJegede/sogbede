"use client";

// import type { Metadata } from "next";
import "./globals.css";
import AppHeader from "@/components/Headers/AppHeader";
import AppFooter from "@/components/Headers/AppFooter";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {!isAdminRoute && <AppHeader />}
        {children}
        {!isAdminRoute && <AppFooter />}
      </body>
    </html>
  );
}
