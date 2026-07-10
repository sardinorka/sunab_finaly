import { NextResponse } from "next/server";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const rows = await db.select().from(settings);
    const map: Record<string, string | null> = {};
    for (const r of rows) {
      map[r.key] = r.value;
    }
    return NextResponse.json(map);
  } catch (err) {
    console.error("settings fetch failed", err);
    return NextResponse.json({ error: "خطا در دریافت تنظیمات" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    // body is an object { key: value, key2: value2 }
    for (const [key, value] of Object.entries(body)) {
      if (typeof key !== "string" || key.length === 0) continue;
      const existing = await db
        .select()
        .from(settings)
        .where(eq(settings.key, key))
        .limit(1);
      if (existing.length > 0) {
        await db
          .update(settings)
          .set({ value: String(value ?? ""), updatedAt: new Date() })
          .where(eq(settings.key, key));
      } else {
        await db
          .insert(settings)
          .values({ key, value: String(value ?? ""), updatedAt: new Date() });
      }
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("settings update failed", err);
    return NextResponse.json({ error: "خطا در ذخیره تنظیمات" }, { status: 500 });
  }
}
