import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, referrer, userAgent, sessionId } = body;

    if (!path || !sessionId) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    // Ensure tables exist (fixes Neon fresh DB: relation page_views does not exist)
    await ensureSchema();

    // Try to extract country from Cloudflare/Netlify edge headers if available
    let country: string | null = null;
    try {
      country =
        request.headers.get("cf-ipcountry") ||
        request.headers.get("x-vercel-ip-country") ||
        request.headers.get("x-country") ||
        null;
    } catch {
      country = null;
    }

    await db.insert(pageViews).values({
      path,
      referrer: referrer || null,
      userAgent: userAgent || null,
      country,
      sessionId,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("analytics track failed", err);
    // Never break the storefront because of analytics
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
