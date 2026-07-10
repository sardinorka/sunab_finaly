import { NextResponse } from "next/server";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const all = await db.select().from(posts).orderBy(desc(posts.createdAt));
    return NextResponse.json(all);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
    return NextResponse.json({ error: "خطا در دریافت مقالات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    if (!body.title || !body.content || !body.category) {
      return NextResponse.json({ error: "عنوان، محتوا و دسته‌بندی الزامی هستند" }, { status: 400 });
    }

    const slug = body.slug || body.title.replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "") + "-" + Date.now().toString(36);

    const [created] = await db
      .insert(posts)
      .values({
        title: body.title,
        slug,
        excerpt: body.excerpt || body.content.replace(/<[^>]*>/g, "").slice(0, 160),
        content: body.content,
        coverImage: body.coverImage || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
        category: body.category,
        tags: Array.isArray(body.tags) ? body.tags : body.tags?.split("،").map((s: string) => s.trim()).filter(Boolean) || [],
        authorName: body.authorName || "تیم سوناب",
        authorAvatar: body.authorAvatar || null,
        readTime: Number(body.readTime) || Math.ceil(body.content.replace(/<[^>]*>/g, "").length / 600),
        isPublished: Boolean(body.isPublished),
        seoTitle: body.seoTitle || body.title,
        seoDescription: body.seoDescription || body.excerpt || body.content.replace(/<[^>]*>/g, "").slice(0, 160),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(created);
  } catch (err) {
    console.error("Failed to create post:", err);
    return NextResponse.json({ error: "خطا در ایجاد مقاله" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "شناسه مقاله الزامی است" }, { status: 400 });
    }

    const [updated] = await db
      .update(posts)
      .set({
        title: body.title,
        slug: body.slug,
        excerpt: body.excerpt || "",
        content: body.content,
        coverImage: body.coverImage || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
        category: body.category,
        tags: Array.isArray(body.tags) ? body.tags : body.tags?.split("،").map((s: string) => s.trim()).filter(Boolean) || [],
        authorName: body.authorName || "تیم سوناب",
        authorAvatar: body.authorAvatar || null,
        readTime: Number(body.readTime) || Math.ceil((body.content || "").replace(/<[^>]*>/g, "").length / 600),
        isPublished: Boolean(body.isPublished),
        seoTitle: body.seoTitle || body.title,
        seoDescription: body.seoDescription || body.excerpt || "",
        updatedAt: new Date(),
      })
      .where(eq(posts.id, Number(body.id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update post:", err);
    return NextResponse.json({ error: "خطا در ویرایش مقاله" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه مقاله الزامی است" }, { status: 400 });
    }

    await db.delete(posts).where(eq(posts.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete post:", err);
    return NextResponse.json({ error: "خطا در حذف مقاله" }, { status: 500 });
  }
}
