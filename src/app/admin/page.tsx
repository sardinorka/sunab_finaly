"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, TrendingUp, Clock, AlertTriangle, ArrowLeft } from "lucide-react";

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  total: string;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number }[];
}

interface Product {
  id: number;
  name: string;
  stock: number;
  price: string;
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          fetch("/api/admin/orders").then((r) => r.json()),
          fetch("/api/admin/products").then((r) => r.json()),
        ]);
        if (Array.isArray(ordersRes)) setOrders(ordersRes);
        if (Array.isArray(productsRes)) setProducts(productsRes);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-cream/50">در حال دریافت آمار فروشگاه...</div>;
  }

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const pendingOrders = orders.filter((o) => o.status === "pending");
  const lowStockProducts = products.filter((p) => p.stock <= 2);

  const formatPrice = (v: number) => new Intl.NumberFormat("fa-IR").format(v);

  const getStatusLabel = (st: string) => {
    switch (st) {
      case "pending": return { text: "در انتظار بررسی", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "processing": return { text: "در حال پردازش", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "shipped": return { text: "ارسال شده", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "completed": return { text: "تکمیل و تحویل‌شده", color: "bg-green-500/10 text-green-400 border-green-500/20" };
      case "cancelled": return { text: "لغو شده", color: "bg-red-500/10 text-red-400 border-red-500/20" };
      default: return { text: st, color: "bg-white/10 text-cream" };
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-2">داشبورد مدیریت</h1>
        <p className="text-cream/60 text-sm">خلاصه وضعیت فروش، سفارش‌های جدید و کالاها</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold" />
            </div>
            <span className="text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full">فروش کل</span>
          </div>
          <div className="text-2xl font-bold text-gold mb-1">
            {formatPrice(totalRevenue)} <span className="text-xs text-cream/40">تومان</span>
          </div>
          <div className="text-xs text-cream/50">مجموع درآمد سفارش‌ها</div>
        </div>

        <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">سفارش‌ها</span>
          </div>
          <div className="text-3xl font-bold text-cream mb-1">{formatPrice(orders.length)}</div>
          <div className="text-xs text-cream/50">تعداد کل سفارش‌های ثبت‌شده</div>
        </div>

        <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-400" />
            </div>
            {pendingOrders.length > 0 && (
              <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full animate-pulse font-bold">
                نیاز به بررسی
              </span>
            )}
          </div>
          <div className="text-3xl font-bold text-amber-400 mb-1">{formatPrice(pendingOrders.length)}</div>
          <div className="text-xs text-cream/50">سفارش‌های جدید در انتظار</div>
        </div>

        <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full">محصولات</span>
          </div>
          <div className="text-3xl font-bold text-cream mb-1">{formatPrice(products.length)}</div>
          <div className="text-xs text-cream/50">تعداد کالاها در فروشگاه</div>
        </div>
      </div>

      {/* Low Stock Warning */}
      {lowStockProducts.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="font-bold text-amber-300">هشدار موجودی کم</div>
              <div className="text-xs text-amber-200/70">
                {lowStockProducts.length} محصول موجودی آن‌ها رو به اتمام یا صفر است.
              </div>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold shrink-0 transition-colors"
          >
            بررسی و افزایش موجودی
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="p-6 lg:p-8 rounded-2xl luxury-border bg-ink-2/60">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">آخرین سفارش‌های دریافتی</h2>
          <Link href="/admin/orders" className="text-xs text-gold flex items-center gap-1 hover:underline">
            <span>مشاهده همه سفارش‌ها</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 text-cream/40 text-sm">
            هنوز سفارشی ثبت نشده است. با ثبت اولین سفارش توسط مشتری، اطلاعات اینجا نمایش داده می‌شود.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-white/10 text-cream/50 text-xs">
                  <th className="pb-3">شماره سفارش</th>
                  <th className="pb-3">نام مشتری</th>
                  <th className="pb-3">تلفن تماس</th>
                  <th className="pb-3">اقلام</th>
                  <th className="pb-3">مبلغ کل (تومان)</th>
                  <th className="pb-3">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.slice(0, 6).map((o) => {
                  const st = getStatusLabel(o.status);
                  return (
                    <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 font-mono text-gold font-bold">{o.orderNumber}</td>
                      <td className="py-4 font-bold">{o.customerName}</td>
                      <td className="py-4 font-mono text-xs text-cream/70" dir="ltr">{o.phone}</td>
                      <td className="py-4 text-xs text-cream/60">
                        {o.items?.map((i) => `${i.name} (${i.quantity} عدد)`).join(" + ")}
                      </td>
                      <td className="py-4 font-bold text-gold">{formatPrice(Number(o.total))}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${st.color}`}>
                          {st.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
