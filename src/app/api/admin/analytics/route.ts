import { NextResponse } from "next/server";
import { db } from "@/db";
import { pageViews } from "@/db/schema";
import { sql, gte, and } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const since = new Date();
    since.setDate(since.getDate() - days);

    // Total pageviews in window
    const totalRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since));
    const total = totalRows[0]?.count ?? 0;

    // Unique sessions in window
    const uniqueRows = await db
      .select({ count: sql<number>`count(distinct ${pageViews.sessionId})::int` })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since));
    const uniqueSessions = uniqueRows[0]?.count ?? 0;

    // Top pages
    const topPagesRaw = await db
      .select({
        path: pageViews.path,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .where(gte(pageViews.createdAt, since))
      .groupBy(pageViews.path)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Top referrers
    const topReferrers = await db
      .select({
        referrer: pageViews.referrer,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .where(and(gte(pageViews.createdAt, since), sql`${pageViews.referrer} is not null`))
      .groupBy(pageViews.referrer)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    // Daily views for chart
    const dailyRows = await db.execute(sql`
      SELECT
        date_trunc('day', ${pageViews.createdAt})::date AS day,
        count(*)::int AS views,
        count(distinct ${pageViews.sessionId})::int AS sessions
      FROM ${pageViews}
      WHERE ${pageViews.createdAt} >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `);
    const daily = (dailyRows as any).rows ?? dailyRows;

    // Top countries
    const topCountries = await db
      .select({
        country: pageViews.country,
        views: sql<number>`count(*)::int`,
      })
      .from(pageViews)
      .where(and(gte(pageViews.createdAt, since), sql`${pageViews.country} is not null`))
      .groupBy(pageViews.country)
      .orderBy(sql`count(*) desc`)
      .limit(10);

    return NextResponse.json({
      total,
      uniqueSessions,
      topPages: topPagesRaw,
      topReferrers: topReferrers
        .filter((r) => r.referrer && r.referrer !== "")
        .map((r) => ({ ...r, referrer: r.referrer as string })),
      daily,
      topCountries: topCountries
        .filter((c) => c.country)
        .map((c) => ({ ...c, country: c.country as string })),
    });
  } catch (err) {
    console.error("analytics summary failed", err);
    return NextResponse.json({ error: "خطا در دریافت آمار" }, { status: 500 });
  }
}
