"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Landmark, Truck, ShoppingBag } from "lucide-react";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, isHydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank-transfer">("bank-transfer");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    postalCode: "",
    note: "",
  });

  const formatPrice = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          billing: {
            firstName: form.firstName,
            lastName: form.lastName,
            phone: form.phone,
            email: form.email || undefined,
            city: form.city,
            address: form.address,
            postalCode: form.postalCode,
          },
          paymentMethod,
          note: form.note || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "خطا در ثبت سفارش");
      }
      clearCart();
      router.push(`/order-success?order=${encodeURIComponent(data.orderNumber)}&total=${data.total}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setSubmitting(false);
    }
  };

  if (isHydrated && items.length === 0) {
    return (
      <main className="min-h-screen bg-ink">
        <Navbar />
        <section className="pt-40 pb-24 px-6 text-center">
          <h1 className="text-3xl font-bold mb-6">سبد خرید شما خالی است</h1>
          <Link href="/products" className="btn-gold px-8 py-4 rounded-full inline-flex items-center justify-center">
            مشاهده محصولات
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gold" />
          <span className="text-xs text-gold tracking-[0.3em] uppercase">تسویه حساب</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-16">
          تکمیل <span className="shine">سفارش</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="p-8 rounded-2xl luxury-border bg-ink-2/50">
              <h2 className="text-xl font-bold mb-6">اطلاعات ارسال</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">نام</label>
                  <input
                    required
                    value={form.firstName}
                    onChange={handleChange("firstName")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">نام خانوادگی</label>
                  <input
                    required
                    value={form.lastName}
                    onChange={handleChange("lastName")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">شماره موبایل</label>
                  <input
                    required
                    dir="ltr"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">ایمیل (اختیاری)</label>
                  <input
                    type="email"
                    dir="ltr"
                    value={form.email}
                    onChange={handleChange("email")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">شهر</label>
                  <input
                    required
                    value={form.city}
                    onChange={handleChange("city")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-sm text-cream/70 mb-2 block">کد پستی</label>
                  <input
                    required
                    dir="ltr"
                    value={form.postalCode}
                    onChange={handleChange("postalCode")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-cream/70 mb-2 block">آدرس کامل</label>
                  <input
                    required
                    value={form.address}
                    onChange={handleChange("address")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm text-cream/70 mb-2 block">توضیحات سفارش (اختیاری)</label>
                  <textarea
                    rows={3}
                    value={form.note}
                    onChange={handleChange("note")}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-8 rounded-2xl luxury-border bg-ink-2/50">
              <h2 className="text-xl font-bold mb-6">روش پرداخت</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank-transfer")}
                  className={`p-5 rounded-xl border text-right flex items-center gap-4 transition-colors ${
                    paymentMethod === "bank-transfer"
                      ? "border-gold bg-gold/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Landmark className={`w-6 h-6 ${paymentMethod === "bank-transfer" ? "text-gold" : "text-cream/60"}`} />
                  <div>
                    <div className="font-bold">کارت به کارت / واریز بانکی</div>
                    <div className="text-xs text-cream/50">پرداخت با اطلاعات کارت پس از ثبت سفارش</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`p-5 rounded-xl border text-right flex items-center gap-4 transition-colors ${
                    paymentMethod === "cod" ? "border-gold bg-gold/10" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Truck className={`w-6 h-6 ${paymentMethod === "cod" ? "text-gold" : "text-cream/60"}`} />
                  <div>
                    <div className="font-bold">پرداخت در محل</div>
                    <div className="text-xs text-cream/50">پرداخت هنگام تحویل سفارش</div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-8 rounded-2xl luxury-border bg-ink-2/50 h-fit sticky top-32">
            <h2 className="text-2xl font-bold mb-6">خلاصه سفارش</h2>
            <div className="space-y-4 pb-6 border-b border-white/10 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 product-image-wrap">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">{item.name}</div>
                    <div className="text-xs text-cream/50">
                      {new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد
                    </div>
                  </div>
                  <div className="text-sm text-gold font-bold whitespace-nowrap">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center py-6">
              <span className="text-lg font-bold">مبلغ نهایی</span>
              <span className="text-2xl font-bold text-gold">
                {formatPrice(totalPrice)} <span className="text-xs text-cream/40">تومان</span>
              </span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-gold w-full px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold">{submitting ? "در حال ثبت سفارش..." : "ثبت نهایی سفارش"}</span>
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </main>
  );
}
