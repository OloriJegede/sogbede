import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookies } from "@/lib/auth";

// GET — load settings
export async function GET() {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await db.adminSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.settingKey] = s.settingValue ?? "";
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error("Settings fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// PUT — save settings (upsert each key)
export async function PUT(request: NextRequest) {
  try {
    const admin = await getAdminFromCookies();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Record<string, string> = await request.json();

    const ops = Object.entries(body).map(([key, value]) =>
      db.adminSetting.upsert({
        where: { settingKey: key },
        create: { settingKey: key, settingValue: value },
        update: { settingValue: value },
      }),
    );

    await Promise.all(ops);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings save error:", error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
