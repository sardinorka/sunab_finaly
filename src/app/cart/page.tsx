"use client";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice, isHydrated } = useCart();

  const formatPrice = (value: number) => new Intl.NumberFormat("fa-IR").format(value);

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gold" />
          <span className="text-xs text-gold tracking-[0.3em] uppercase">سبد خرید</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-16">
          سبد <span className="shine">خرید شما</span>
        </h1>

        {!isHydrated ? null : items.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20">
            <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-3xl font-bold mb-4">سبد خرید شما خالی است</h2>
            <p className="text-cream/60 mb-8">
              هنوز محصولی به سبد خرید خود اضافه نکرده‌اید. از کالکشن ما دیدن کنید و شاهکار خود را انتخاب نمایید.
            </p>
            <Link
              href="/products"
              className="btn-gold px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 group"
            >
              <span className="font-bold">مشاهده محصولات</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 p-5 rounded-2xl luxury-border bg-ink-2/50"
                >
                  <div className="relative w-full sm:w-32 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 product-image-wrap">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-xl font-bold hover:text-gold transition-colors"
                      >
                        {item.name}
                      </Link>
                      <div className="text-gold mt-2 font-bold">
                        {formatPrice(Number(item.price))} <span className="text-xs text-cream/40">تومان</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-ink rounded-full px-2 py-2 luxury-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold">
                          {new Intl.NumberFormat("fa-IR").format(item.quantity)}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-red-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-8 rounded-2xl luxury-border bg-ink-2/50 h-fit sticky top-32">
              <h2 className="text-2xl font-bold mb-6">خلاصه سفارش</h2>
              <div className="space-y-3 pb-6 border-b border-white/10 text-sm">
                <div className="flex justify-between text-cream/70">
                  <span>تعداد اقلام</span>
                  <span>{new Intl.NumberFormat("fa-IR").format(items.reduce((s, i) => s + i.quantity, 0))}</span>
                </div>
                <div className="flex justify-between text-cream/70">
                  <span>هزینه ارسال</span>
                  <span>رایگان</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-6">
                <span className="text-lg font-bold">مبلغ قابل پرداخت</span>
                <span className="text-2xl font-bold text-gold">
                  {formatPrice(totalPrice)} <span className="text-xs text-cream/40">تومان</span>
                </span>
              </div>
              <Link
                href="/checkout"
                className="btn-gold w-full px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 group"
              >
                <span className="font-bold">ادامه فرآیند خرید</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
