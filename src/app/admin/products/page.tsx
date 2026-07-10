"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Edit3, Trash2, Check, X, Search, Package } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: string;
  comparePrice?: string | null;
  image: string;
  gallery: string[];
  category: string;
  material?: string | null;
  dimensions?: string | null;
  capacity?: string | null;
  features: string[];
  isFeatured: boolean;
  isNew: boolean;
  stock: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [form, setForm] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    price: "",
    comparePrice: "",
    image: "",
    category: "وان",
    material: "",
    dimensions: "",
    capacity: "",
    features: "",
    isFeatured: false,
    isNew: false,
    stock: "10",
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      price: "",
      comparePrice: "",
      image: "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      category: "وان",
      material: "",
      dimensions: "",
      capacity: "",
      features: "سنگ مرمر طبیعی، پایه‌های چوب گردو، سیستم گرمایش هوشمند، گارانتی مادام‌العمر",
      isFeatured: true,
      isNew: true,
      stock: "10",
    });
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      tagline: p.tagline || "",
      description: p.description || "",
      price: p.price,
      comparePrice: p.comparePrice || "",
      image: p.image || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
      category: p.category || "وان",
      material: p.material || "",
      dimensions: p.dimensions || "",
      capacity: p.capacity || "",
      features: Array.isArray(p.features) ? p.features.join("، ") : "",
      isFeatured: p.isFeatured,
      isNew: p.isNew,
      stock: String(p.stock ?? 10),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`آیا از حذف محصول «${name}» اطمینان دارید؟`)) return;
    await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" });
    loadProducts();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = "/api/admin/products";
      const method = editing ? "PUT" : "POST";
      const body = {
        ...(editing ? { id: editing.id } : {}),
        ...form,
        features: form.features.split("،").map((s) => s.trim()).filter(Boolean),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setModalOpen(false);
        loadProducts();
      } else {
        const data = await res.json();
        alert(data.error || "خطا در ذخیره محصول");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (v: string) => new Intl.NumberFormat("fa-IR").format(Number(v));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">مدیریت محصولات</h1>
          <p className="text-cream/60 text-sm">افزودن، ویرایش و تنظیم موجودی و قیمت کالاها</p>
        </div>
        <button
          onClick={openNew}
          className="btn-gold px-6 py-3.5 rounded-full font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>افزودن محصول جدید</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول بر اساس نام یا دسته‌بندی..."
          className="w-full pr-11 pl-4 py-3 rounded-2xl bg-ink-2/80 border border-white/10 focus:border-gold outline-none transition-colors text-sm"
        />
      </div>

      {/* Table */}
      <div className="p-6 lg:p-8 rounded-2xl luxury-border bg-ink-2/60 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-cream/50 text-sm">در حال بارگذاری لیست محصولات...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-cream/40 text-sm">محصولی با این مشخصات یافت نشد.</div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-white/10 text-cream/50 text-xs">
                <th className="pb-4">تصویر</th>
                <th className="pb-4">نام محصول</th>
                <th className="pb-4">دسته‌بندی</th>
                <th className="pb-4">قیمت (تومان)</th>
                <th className="pb-4">موجودی</th>
                <th className="pb-4">ویژه / جدید</th>
                <th className="pb-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden product-image-wrap shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" />
                    </div>
                  </td>
                  <td className="py-4 font-bold">
                    <div>{p.name}</div>
                    <div className="text-xs text-cream/50 line-clamp-1">{p.tagline}</div>
                  </td>
                  <td className="py-4 text-xs text-cream/70">{p.category}</td>
                  <td className="py-4 font-bold text-gold">{formatPrice(p.price)}</td>
                  <td className="py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        p.stock > 3
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : p.stock > 0
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {p.stock > 0 ? `${new Intl.NumberFormat("fa-IR").format(p.stock)} عدد` : "ناموجود"}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {p.isFeatured && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] bg-gold/20 text-gold font-bold">ویژه</span>
                      )}
                      {p.isNew && (
                        <span className="px-2.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-bold">جدید</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gold/20 hover:text-gold flex items-center justify-center transition-colors"
                        title="ویرایش محصول"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 flex items-center justify-center transition-colors"
                        title="حذف محصول"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl p-8 rounded-3xl luxury-border bg-ink-2 max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editing ? `ویرایش محصول: ${editing.name}` : "افزودن محصول جدید به فروشگاه"}
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <label className="text-cream/70 mb-2 block">نام محصول *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: وان الماس"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">دسته‌بندی *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                >
                  <option value="وان">وان</option>
                  <option value="جکوزی">جکوزی</option>
                  <option value="زیردوشی">زیردوشی</option>
                </select>
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">قیمت (تومان) *</label>
                <input
                  required
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="مثال: 285000000"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none font-mono text-left"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">قیمت قبلی / خط‌خورده (تومان - اختیاری)</label>
                <input
                  type="number"
                  value={form.comparePrice}
                  onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                  placeholder="مثال: 340000000"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none font-mono text-left"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">موجودی انبار (عدد)</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="10"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none font-mono text-left"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">آدرس تصویر محصول</label>
                <select
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                >
                  <option value="https://images.pexels.com/photos/9695823/pexels-photo-9695823.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر وان الماس (https://images.pexels.com/photos/9695823/pexels-photo-9695823.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/29887335/pexels-photo-29887335.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر جکوزی سافایر (https://images.pexels.com/photos/29887335/pexels-photo-29887335.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/12059391/pexels-photo-12059391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر وان سلطنتی پارس (https://images.pexels.com/photos/12059391/pexels-photo-12059391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/23696835/pexels-photo-23696835.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر جکوزی اینفینیتی (https://images.pexels.com/photos/23696835/pexels-photo-23696835.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/27638183/pexels-photo-27638183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر وان نوردیک (https://images.pexels.com/photos/27638183/pexels-photo-27638183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop">تصویر جکوزی رُز (https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop)</option>
                  <option value="https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop">تصویر اصلی هیرو (https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">جمله کوتاه جذاب (Tagline)</label>
                <input
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  placeholder="شکوه مطلق در هر لمس"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-cream/70 mb-2 block">توضیحات کامل محصول</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="درباره ویژگی‌ها، ساخت و طراحی محصول بنویسید..."
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">جنس / متریال</label>
                <input
                  value={form.material}
                  onChange={(e) => setForm({ ...form, material: e.target.value })}
                  placeholder="سنگ مرمر کارارا"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">ابعاد (سانتی‌متر)</label>
                <input
                  value={form.dimensions}
                  onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                  placeholder="۱۸۰ × ۸۰ × ۶۵"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">ظرفیت</label>
                <input
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="۲۸۰ لیتر / ۴ نفره"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div>
                <label className="text-cream/70 mb-2 block">ویژگی‌های کلیدی (با ویرگول جدا کنید)</label>
                <input
                  value={form.features}
                  onChange={(e) => setForm({ ...form, features: e.target.value })}
                  placeholder="سنگ مرمر، گرمایش هوشمند، گارانتی مادام‌العمر"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-8 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                    className="w-5 h-5 accent-gold rounded"
                  />
                  <span>نمایش در بخش «محصولات ویژه / شاهکارهای ما» در صفحه اصلی</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                    className="w-5 h-5 accent-gold rounded"
                  />
                  <span>دارای نشان «محصول جدید»</span>
                </label>
              </div>

              <div className="md:col-span-2 flex gap-4 pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold flex-1 py-4 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  <span>{submitting ? "در حال ذخیره..." : editing ? "ذخیره تغییرات" : "افزودن محصول به سایت"}</span>
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
