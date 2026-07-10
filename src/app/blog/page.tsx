import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بلاگ سوناب | مقالات تخصصی وان و جکوزی و زیردوشی",
  description:
    "مجله تخصصی سوناب: راهنمای خرید وان، جکوزی و زیردوشی، ایده‌های طراحی حمام لوکس، نکات نگهداری و آخرین ترندهای دکوراسیون.",
  openGraph: {
    title: "بلاگ سوناب | مقالات تخصصی وان و جکوزی و زیردوشی",
    description: "راهنمای خرید، طراحی و نگهداری وان، جکوزی و زیردوشی‌های لوکس",
    type: "website",
    locale: "fa_IR",
  },
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  await ensureSchema();

  const allPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt));

  let filtered = allPosts;
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

  // Unique categories
  const categories = Array.from(new Set(allPosts.map((p) => p.category)));

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-10 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gold" />
          <span className="text-xs text-gold tracking-[0.3em] uppercase">بلاگ</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          مجله <span className="shine">سوناب</span>
        </h1>
        <p className="text-cream/60 text-lg max-w-2xl leading-relaxed">
          مقالات تخصصی درباره دنیای وان و جکوزی لاکچری، راهنمای خرید، ایده‌های طراحی و دکوراسیون حمام مدرن.
        </p>
        {search && (
          <p className="mt-4 text-sm text-cream/50">
            نتایج جستجو برای: <span className="text-gold">«{search}»</span> — {filtered.length} مقاله یافت شد
          </p>
        )}
      </section>

      {/* Category filters */}
      {categories.length > 0 && (
        <section className="px-6 md:px-12 max-w-[1600px] mx-auto pb-10">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/blog"
              className={`px-5 py-2 rounded-full text-sm border transition-colors ${
                !category
                  ? "bg-gold text-ink border-gold font-bold"
                  : "border-white/10 text-cream/70 hover:border-gold hover:text-gold"
              }`}
            >
              همه مقالات
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`px-5 py-2 rounded-full text-sm border transition-colors ${
                  category === c
                    ? "bg-gold text-ink border-gold font-bold"
                    : "border-white/10 text-cream/70 hover:border-gold hover:text-gold"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-cream/50">مقاله‌ای با این مشخصات یافت نشد.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
