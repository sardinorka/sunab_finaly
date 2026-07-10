import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await ensureSchema();
    const { slug } = await params;
    const [post] = await db
      .select()
      .from(posts)
      .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
      .limit(1);

    if (!post) {
      return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
    }

    // Also fetch related posts (same category, excluding current)
    const related = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        coverImage: posts.coverImage,
        category: posts.category,
        createdAt: posts.createdAt,
        readTime: posts.readTime,
      })
      .from(posts)
      .where(and(eq(posts.category, post.category), eq(posts.isPublished, true)))
      .limit(4);

    const relatedPosts = related.filter((r) => r.id !== post.id).slice(0, 3);

    return NextResponse.json({ post, relatedPosts });
  } catch (err) {
    console.error("Failed to fetch blog post:", err);
    return NextResponse.json({ error: "خطا در دریافت مقاله" }, { status: 500 });
  }
}
