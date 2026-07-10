import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    let query = db
      .select()
      .from(posts)
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.createdAt));

    const all = await query;
    let filtered = all;

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    const offset = (page - 1) * limit;
    const paginated = filtered.slice(offset, offset + limit);

    // Strip HTML content for listing
    const safe = paginated.map((p) => ({
      ...p,
      content: undefined, // don't send full content in list
      excerpt: p.excerpt,
    }));

    return NextResponse.json({
      posts: safe,
      total: filtered.length,
      page,
      totalPages: Math.ceil(filtered.length / limit),
    });
  } catch (err) {
    console.error("Failed to fetch blog posts:", err);
    return NextResponse.json({ error: "خطا در دریافت مقالات" }, { status: 500 });
  }
}
