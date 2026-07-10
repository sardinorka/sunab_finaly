import { db } from "@/db";
import { posts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    await ensureSchema();
  } catch {
    return { title: "مقاله یافت نشد" };
  }
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
    .limit(1);

  if (!post) return { title: "مقاله یافت نشد" };

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      type: "article",
      locale: "fa_IR",
      images: [{ url: post.coverImage, width: 1200, height: 630 }],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.authorName],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureSchema();
  const [post] = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
    .limit(1);

  if (!post) notFound();

  const relatedPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      category: posts.category,
      createdAt: posts.createdAt,
      readTime: posts.readTime,
      authorName: posts.authorName,
    })
    .from(posts)
    .where(and(eq(posts.category, post.category), eq(posts.isPublished, true)))
    .limit(4);

  const related = relatedPosts.filter((r) => r.id !== post.id).slice(0, 3);

  const dateStr = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.coverImage,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "سوناب",
      logo: {
        "@type": "ImageObject",
        url: "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://sunab.ir/blog/${post.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <article className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>بازگشت به بلاگ</span>
        </Link>

        {/* Header */}
        <div className="mb-10 space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold tracking-wider">
            {post.category}
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance text-cream">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-cream/60">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              {dateStr}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gold" />
              {post.readTime} دقیقه مطالعه
            </span>
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-gold" />
              {post.authorName}
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?search=${encodeURIComponent(tag)}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 text-xs text-cream/60 hover:bg-gold/10 hover:text-gold transition-colors"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Cover Image */}
        <div className="relative product-image-wrap aspect-[16/9] rounded-3xl overflow-hidden mb-12 luxury-border">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none prose-headings:text-cream prose-headings:font-bold prose-headings:mb-4 prose-p:text-cream/80 prose-p:leading-relaxed prose-strong:text-gold prose-a:text-gold prose-a:no-underline hover:prose-a:underline prose-li:text-cream/70 prose-li:mb-2 prose-th:text-cream/80 prose-td:text-cream/70 prose-table:border-white/10 prose-hr:border-white/10"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="border-t border-white/10 pt-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-10">
                مقالات <span className="shine">مرتبط</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((rp) => (
                  <BlogCard key={rp.id} post={rp as any} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
