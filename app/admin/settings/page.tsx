export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const admin = await getAdminFromCookies();
  if (!admin) redirect("/admin/login");

  // Load admin settings from admin_settings table
  const settings = await db.adminSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.settingKey] = s.settingValue ?? "";
  }

  return (
    <SettingsClient
      admin={{ id: admin.id, email: admin.email, name: admin.name }}
      settings={settingsMap}
    />
  );
}
