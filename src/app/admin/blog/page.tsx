"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit3, Trash2, Check, X, Search, Eye, FileText } from "lucide-react";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorName: string;
  readTime: number;
  isPublished: boolean;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
    category: "راهنمای خرید",
    tags: "",
    authorName: "تیم سوناب",
    readTime: "5",
    isPublished: true,
    seoTitle: "",
    seoDescription: "",
  });

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      if (Array.isArray(data)) setAllPosts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "<h2>عنوان بخش</h2>\n<p>محتوای مقاله خود را اینجا بنویسید...</p>",
      coverImage: "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      category: "راهنمای خرید",
      tags: "",
      authorName: "تیم سوناب",
      readTime: "5",
      isPublished: true,
      seoTitle: "",
      seoDescription: "",
    });
    setModalOpen(true);
  };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || "",
      content: p.content || "",
      coverImage: p.coverImage || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      category: p.category || "راهنمای خرید",
      tags: Array.isArray(p.tags) ? p.tags.join("، ") : "",
      authorName: p.authorName || "تیم سوناب",
      readTime: String(p.readTime || 5),
      isPublished: p.isPublished,
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`آیا از حذف مقاله «${title}» اطمینان دارید؟`)) return;
    await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE" });
    loadPosts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = {
        ...(editing ? { id: editing.id } : {}),
        ...form,
        tags: form.tags.split("،").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch("/api/admin/posts", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        loadPosts();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ذخیره مقاله");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = allPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const categories = ["راهنمای خرید", "سلامتی و تندرستی", "طراحی و دکوراسیون", "نگهداری و مراقبت", "داستان برند", "اخبار و رویدادها"];

  const imageOptions = [
    "https://images.pexels.com/photos/9695823/pexels-photo-9695823.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/29887335/pexels-photo-29887335.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/12059391/pexels-photo-12059391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/23696835/pexels-photo-23696835.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/27638183/pexels-photo-27638183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
    "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت مقالات بلاگ</h1>
          <p className="text-cream/60 text-sm">افزودن، ویرایش و انتشار مقالات سئو-محور</p>
        </div>
        <Link
          href="/blog"
          target="_blank"
          className="btn-outline px-5 py-3 rounded-full text-xs flex items-center gap-2 hover:border-gold hover:text-gold"
        >
          <Eye className="w-4 h-4" />
          <span>مشاهده بلاگ در سایت</span>
        </Link>
        <button
          onClick={openNew}
          className="btn-gold px-6 py-3.5 rounded-full font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>نوشتن مقاله جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی مقاله بر اساس عنوان یا دسته‌بندی..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-ink-2/80 border border-white/10 focus:border-gold outline-none text-sm"
        />
      </div>

      {/* Posts Grid (card view) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center py-12 text-cream/50 text-sm col-span-full">
            در حال بارگذاری مقالات...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-cream/40 text-sm col-span-full">
            مقاله‌ای یافت نشد. اولین مقاله را با دکمه «نوشتن مقاله جدید» اضافه کنید.
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl luxury-border bg-ink-2/60 overflow-hidden flex flex-col"
            >
              <div className="relative aspect-[16/10] product-image-wrap">
                <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-gold text-ink text-[11px] font-bold">
                    {p.category}
                  </span>
                </div>
                {!p.isPublished && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-red-500/80 text-white text-[11px] font-bold">
                      پیش‌نویس
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-[10px] text-cream/50">
                  <span>{new Date(p.createdAt).toLocaleDateString("fa-IR")}</span>
                  <span>•</span>
                  <span>{p.readTime} دقیقه</span>
                  <span>•</span>
                  <span>{p.authorName}</span>
                </div>

                <h3 className="text-lg font-bold line-clamp-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-cream/60 line-clamp-2 leading-relaxed">
                  {p.excerpt || "بدون خلاصه"}
                </p>

                {p.tags && p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {p.tags.slice(0, 3).map((t: string) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-cream/50"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-white/5 mt-2 justify-end">
                  <Link
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
                    title="پیش‌نمایش مقاله"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={() => openEdit(p)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
                    title="ویرایش مقاله"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="حذف مقاله"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl p-8 rounded-3xl luxury-border bg-ink-2 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editing ? "ویرایش مقاله" : "نوشتن مقاله جدید"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">عنوان مقاله *</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="مثلاً: راهنمای جامع انتخاب وان لاکچری برای حمام مستر"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-base"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-cream/70 mb-2 block">دسته‌بندی *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div>
                <label className="text-cream/70 mb-2 block">نویسنده</label>
                <input
                  value={form.authorName}
                  onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-cream/70 mb-2 block">زمان مطالعه (دقیقه)</label>
                <input
                  type="number"
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-cream/70 mb-2 block">تصویر جلد</label>
                <select
                  value={form.coverImage}
                  onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                >
                  {imageOptions.map((o) => (
                    <option key={o} value={o}>{o.includes("pexels") ? o.split("/").pop()?.split("?")[0] || o : o}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="text-cream/70 mb-2 block">برچسب‌ها (با ویرگول جدا کنید)</label>
                <input
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="وان، راهنما، طراحی داخلی"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              {/* Excerpt */}
              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">خلاصه کوتاه (برای نمایش در لیست)</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none resize-none"
                />
              </div>

              {/* Content */}
              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">
                  محتوای کامل مقاله * <span className="text-cream/40">(HTML ─ از تگ‌های h2, h3, p, ul, ol, table استفاده کنید)</span>
                </label>
                <textarea
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={16}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none resize-y font-mono text-xs leading-relaxed"
                  dir="ltr"
                />
              </div>

              {/* SEO Fields */}
              <div className="md:col-span-2 border-t border-white/10 pt-6 mt-2">
                <h3 className="text-cream font-bold mb-4 gap-2 flex items-center">
                  <FileText className="w-4 h-4 text-gold" />
                  تنظیمات سئو (SEO)
                </h3>
              </div>

              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">عنوان سئو (SEO Title ─ در صورت خالی بودن از عنوان اصلی استفاده می‌شود)</label>
                <input
                  value={form.seoTitle}
                  onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                  placeholder="بهترین عنوان برای گوگل (حداکثر ۶۰ کاراکتر)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">توضیحات متا (Meta Description ─ حداکثر ۱۶۰ کاراکتر)</label>
                <textarea
                  value={form.seoDescription}
                  onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none resize-none"
                />
              </div>

              {/* Published toggle */}
              <div className="md:col-span-2 flex items-center gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-5 h-5 accent-gold rounded"
                  />
                  <span className="text-cream/80">
                    منتشر شود <span className="text-cream/40 text-xs">(قابل مشاهده در سایت)</span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold flex-1 py-4 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>{submitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "انتشار مقاله"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
