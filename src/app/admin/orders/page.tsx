"use client";
import { useEffect, useState } from "react";
import { ShoppingBag, CheckCircle, Clock, Truck, XCircle, Eye, Phone, MapPin, Mail } from "lucide-react";

interface OrderItem {
  productId: string | number;
  name: string;
  slug: string;
  image: string;
  price: string;
  quantity: number;
}

interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: string;
  note?: string | null;
  items: OrderItem[];
  total: string;
  status: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdating(id);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      await loadOrders();
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setUpdating(null);
    }
  };

  const formatPrice = (v: string | number) => new Intl.NumberFormat("fa-IR").format(Number(v));

  const getStatusBadge = (st: string) => {
    switch (st) {
      case "pending":
        return { text: "در انتظار بررسی", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "processing":
        return { text: "در حال آماده‌سازی", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "shipped":
        return { text: "ارسال شده", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "completed":
        return { text: "تکمیل و تحویل‌شده", color: "bg-green-500/10 text-green-400 border-green-500/20" };
      case "cancelled":
        return { text: "لغو شده", color: "bg-red-500/10 text-red-400 border-red-500/20" };
      default:
        return { text: st, color: "bg-white/10 text-cream" };
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">سفارش‌های مشتریان</h1>
        <p className="text-cream/60 text-sm">بررسی، مدیریت و تغییر وضعیت سفارش‌های ثبت‌شده</p>
      </div>

      <div className="p-6 lg:p-8 rounded-2xl luxury-border bg-ink-2/60 overflow-x-auto">
        {loading ? (
          <div className="text-center py-12 text-cream/50 text-sm">در حال دریافت لیست سفارش‌ها...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-cream/40 text-sm">
            هنوز سفارشی ثبت نشده است. پس از ثبت سفارش توسط کاربران، لیست در اینجا نمایش داده می‌شود.
          </div>
        ) : (
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="border-b border-white/10 text-cream/50 text-xs">
                <th className="pb-4">شماره سفارش</th>
                <th className="pb-4">نام مشتری</th>
                <th className="pb-4">تلفن تماس</th>
                <th className="pb-4">مبلغ نهایی (تومان)</th>
                <th className="pb-4">روش پرداخت</th>
                <th className="pb-4">تاریخ ثبت</th>
                <th className="pb-4">وضعیت</th>
                <th className="pb-4 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => {
                const st = getStatusBadge(o.status);
                const dateStr = o.createdAt
                  ? new Date(o.createdAt).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "امروز";
                return (
                  <tr key={o.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-mono text-gold font-bold">{o.orderNumber}</td>
                    <td className="py-4 font-bold">{o.customerName}</td>
                    <td className="py-4 font-mono text-xs text-cream/70" dir="ltr">
                      {o.phone}
                    </td>
                    <td className="py-4 font-bold text-gold">{formatPrice(o.total)}</td>
                    <td className="py-4 text-xs text-cream/70">{o.paymentMethod}</td>
                    <td className="py-4 text-xs text-cream/50">{dateStr}</td>
                    <td className="py-4">
                      <select
                        disabled={updating === o.id}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border outline-none bg-ink cursor-pointer ${st.color}`}
                      >
                        <option value="pending" className="bg-ink text-amber-400">
                          در انتظار بررسی
                        </option>
                        <option value="processing" className="bg-ink text-blue-400">
                          در حال آماده‌سازی
                        </option>
                        <option value="shipped" className="bg-ink text-purple-400">
                          ارسال شده
                        </option>
                        <option value="completed" className="bg-ink text-green-400">
                          تکمیل‌شده
                        </option>
                        <option value="cancelled" className="bg-ink text-red-400">
                          لغو شده
                        </option>
                      </select>
                    </td>
                    <td className="py-4 text-left">
                      <button
                        onClick={() => setSelected(o)}
                        className="btn-outline px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 ml-auto hover:border-gold hover:text-gold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>مشاهده جزئیات</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl p-8 rounded-3xl luxury-border bg-ink-2 max-h-[90vh] overflow-y-auto relative space-y-6 text-sm">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <ShoppingBag className="w-6 h-6 text-gold" />
              <div>
                <div className="text-lg font-bold">جزئیات سفارش: {selected.orderNumber}</div>
                <div className="text-xs text-cream/50">ثبت شده توسط: {selected.customerName}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-ink/50 border border-white/5">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <div>
                  <div className="text-xs text-cream/50">تلفن تماس</div>
                  <div className="font-mono text-left" dir="ltr">{selected.phone}</div>
                </div>
              </div>

              {selected.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <div>
                    <div className="text-xs text-cream/50">ایمیل</div>
                    <div>{selected.email}</div>
                  </div>
                </div>
              )}

              <div className="sm:col-span-2 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-cream/50">آدرس کامل ارسال</div>
                  <div>
                    {selected.city} — {selected.address} (کد پستی: <span className="font-mono" dir="ltr">{selected.postalCode}</span>)
                  </div>
                </div>
              </div>

              {selected.note && (
                <div className="sm:col-span-2 pt-3 border-t border-white/5">
                  <div className="text-xs text-cream/50 mb-1">یادداشت مشتری</div>
                  <div className="text-xs italic bg-white/[0.02] p-3 rounded-xl">{selected.note}</div>
                </div>
              )}
            </div>

            <div>
              <div className="font-bold mb-3 text-cream">اقلام سفارش ({selected.items?.length || 0} مورد):</div>
              <div className="space-y-3">
                {selected.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-ink/40 border border-white/5">
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-cream/50">تعداد: {formatPrice(item.quantity)} عدد</div>
                    </div>
                    <div className="font-bold text-gold">
                      {formatPrice(Number(item.price) * item.quantity)} <span className="text-xs text-cream/40">تومان</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/10 text-base font-bold">
              <span>مبلغ نهایی پرداخت‌شده / قابل پرداخت:</span>
              <span className="text-xl text-gold">
                {formatPrice(selected.total)} <span className="text-xs text-cream/40">تومان</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
