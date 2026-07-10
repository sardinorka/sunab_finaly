"use client";
import { useEffect, useState } from "react";
import { Save, Loader2, Globe, TrendingUp, Users, Eye, BarChart3, Hash, Image as ImageIcon, Code } from "lucide-react";

interface AnalyticsData {
  total: number;
  uniqueSessions: number;
  topPages: { path: string; views: number }[];
  topReferrers: { referrer: string; views: number }[];
  daily: { day: string; views: number; sessions: number }[];
  topCountries: { country: string; views: number }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [range, setRange] = useState(30);
  const [loading, setLoading] = useState(true);

  // SEO settings
  const [seoForm, setSeoForm] = useState({
    seo_meta_title: "",
    seo_meta_description: "",
    seo_meta_keywords: "",
    seo_og_image: "",
    seo_google_analytics_id: "",
    seo_google_tag_manager_id: "",
    seo_bing_webmaster: "",
    seo_yandex_verification: "",
    custom_head_scripts: "",
  });
  const [seoSaved, setSeoSaved] = useState(false);
  const [seoSaving, setSeoSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/analytics?days=${range}`).then((r) => r.json()),
      fetch("/api/admin/settings").then((r) => r.json()),
    ])
      .then(([a, s]) => {
        setData(a);
        setSeoForm((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(s || {}).filter(([k]) => k in prev)
          ),
        }));
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [range]);

  const saveSeo = async () => {
    setSeoSaving(true);
    setSeoSaved(false);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seoForm),
      });
      setSeoSaved(true);
      setTimeout(() => setSeoSaved(false), 2500);
    } finally {
      setSeoSaving(false);
    }
  };

  const maxDaily = data?.daily
    ? Math.max(...data.daily.map((d) => d.views), 1)
    : 1;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">بازدیدها و سئو</h1>
          <p className="text-cream/60 text-sm">تحلیل بازدید سایت و تنظیمات سئو برای گوگل و موتورهای جستجو</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                range === d
                  ? "bg-gold text-ink border-gold"
                  : "border-white/10 text-cream/70 hover:border-gold hover:text-gold"
              }`}
            >
              {d} روز اخیر
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Cards */}
      {loading ? (
        <div className="text-center py-12 text-cream/50 text-sm">در حال بارگذاری آمار...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Eye}
              label="کل بازدیدها"
              value={data?.total ?? 0}
              color="gold"
            />
            <StatCard
              icon={Users}
              label="بازدیدکنندگان یکتا"
              value={data?.uniqueSessions ?? 0}
              color="blue"
            />
            <StatCard
              icon={Globe}
              label="میانگین صفحه به ازای هر بازدیدکننده"
              value={
                data && data.uniqueSessions > 0
                  ? (data.total / data.uniqueSessions).toFixed(1)
                  : "۰"
              }
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="بازدید امروز"
              value={(() => {
                if (!data?.daily) return 0;
                const today = new Date().toISOString().slice(0, 10);
                return data.daily.find((d) => d.day?.toString().startsWith(today))?.views ?? 0;
              })()}
              color="green"
            />
          </div>

          {/* Chart */}
          {data?.daily && data.daily.length > 0 && (
            <div className="p-6 lg:p-8 rounded-2xl luxury-border bg-ink-2/60">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-gold" />
                نمودار بازدید روزانه
              </h3>
              <div className="flex items-end justify-between gap-1.5 h-48 px-2">
                {data.daily.map((d, i) => {
                  const h = (d.views / maxDaily) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="relative w-full flex items-end h-full">
                        <div
                          className="w-full bg-gradient-to-t from-gold/60 to-gold rounded-t-md transition-all hover:from-gold hover:to-gold-2"
                          style={{ height: `${h}%`, minHeight: h > 0 ? "4px" : "0" }}
                          title={`${d.day}: ${d.views} بازدید`}
                        />
                      </div>
                      <div className="text-[9px] text-cream/40 group-hover:text-gold transition-colors">
                        {d.day?.toString().slice(5, 10) ?? ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Top Pages & Referrers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
              <h3 className="text-lg font-bold mb-4">پربازدیدترین صفحات</h3>
              {data?.topPages && data.topPages.length > 0 ? (
                <ul className="space-y-2">
                  {data.topPages.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink/50 hover:bg-ink/80 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-cream/40 font-mono w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <code className="text-xs text-cream/80 truncate" dir="ltr">
                          {p.path}
                        </code>
                      </div>
                      <span className="text-xs text-gold font-bold whitespace-nowrap">
                        {new Intl.NumberFormat("fa-IR").format(p.views)} بازدید
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-cream/40 text-xs text-center py-8">
                  هنوز بازدیدی ثبت نشده است. به زودی با اولین بازدیدها این نمودار فعال می‌شود.
                </p>
              )}
            </div>

            <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
              <h3 className="text-lg font-bold mb-4">منابع ورود کاربران</h3>
              {data?.topReferrers && data.topReferrers.length > 0 ? (
                <ul className="space-y-2">
                  {data.topReferrers.map((r, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-ink/50"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] text-cream/40 font-mono w-5 shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <code className="text-xs text-cream/80 truncate" dir="ltr">
                          {r.referrer}
                        </code>
                      </div>
                      <span className="text-xs text-gold font-bold whitespace-nowrap">
                        {new Intl.NumberFormat("fa-IR").format(r.views)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-cream/40 text-xs text-center py-8">
                  اکثر بازدیدها مستقیم یا بدون معرف هستند.
                </p>
              )}
            </div>
          </div>

          {/* Top Countries */}
          {data?.topCountries && data.topCountries.length > 0 && (
            <div className="p-6 rounded-2xl luxury-border bg-ink-2/60">
              <h3 className="text-lg font-bold mb-4">کاربران بر اساس کشور</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.topCountries.map((c) => (
                  <div
                    key={c.country}
                    className="p-4 rounded-xl bg-ink/50 text-center hover:border-gold border border-transparent transition-colors"
                  >
                    <div className="text-xs text-cream/60 mb-1">کد کشور</div>
                    <div className="text-xl font-bold text-gold font-mono">{c.country}</div>
                    <div className="text-[11px] text-cream/50 mt-1">
                      {new Intl.NumberFormat("fa-IR").format(c.views)} بازدید
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!data?.total && (
            <div className="p-8 rounded-2xl bg-ink-2/60 border border-white/5 text-center">
              <p className="text-cream/60 text-sm mb-2">
                هنوز هیچ بازدیدی ثبت نشده است.
              </p>
              <p className="text-cream/40 text-xs">
                بازدیدها به محض بازدید کاربران از سایت به طور خودکار ثبت می‌شوند.
              </p>
            </div>
          )}
        </>
      )}

      {/* SEO Settings */}
      <div className="p-6 md:p-8 rounded-2xl luxury-border bg-ink-2/60 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
            <Hash className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h2 className="text-xl font-bold">تنظیمات سئو و ردیابی</h2>
            <p className="text-xs text-cream/50">
              این تنظیمات روی تمام صفحات سایت اعمال می‌شود. بعد از ذخیره، تغییرات ظرف چند دقیقه ایندکس می‌شود.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              عنوان متای پیش‌فرض (Meta Title)
            </label>
            <input
              value={seoForm.seo_meta_title}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_meta_title: e.target.value })
              }
              placeholder="سوناب | وان، جکوزی و زیردوشی لاکچری"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
            <p className="text-[11px] text-cream/40 mt-1.5">
              حداکثر ۶۰ کاراکتر پیشنهاد می‌شود
            </p>
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              کلمات کلیدی (با ویرگول جدا کنید)
            </label>
            <input
              value={seoForm.seo_meta_keywords}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_meta_keywords: e.target.value })
              }
              placeholder="وان لوکس، جکوزی، زیردوشی سنگی"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              توضیحات متا (Meta Description)
            </label>
            <textarea
              value={seoForm.seo_meta_description}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_meta_description: e.target.value })
              }
              rows={2}
              placeholder="توضیح یک‌خطی درباره فروشگاه شما برای نمایش در نتایج گوگل..."
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm resize-none"
            />
            <p className="text-[11px] text-cream/40 mt-1.5">
              حداکثر ۱۶۰ کاراکتر
            </p>
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" /> تصویر اشتراک‌گذاری (OG Image)
            </label>
            <input
              value={seoForm.seo_og_image}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_og_image: e.target.value })
              }
              placeholder="https://sunab.ir/og-image.jpg"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
            <p className="text-[11px] text-cream/40 mt-1.5">
              تصویری که در اشتراک‌گذاری لینک در شبکه‌های اجتماعی نمایش داده می‌شود (۱۲۰۰×۶۳۰ پیشنهاد می‌شود)
            </p>
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              Google Analytics 4 ID
            </label>
            <input
              value={seoForm.seo_google_analytics_id}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_google_analytics_id: e.target.value })
              }
              placeholder="G-XXXXXXXXXX"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              Google Tag Manager ID
            </label>
            <input
              value={seoForm.seo_google_tag_manager_id}
              onChange={(e) =>
                setSeoForm({
                  ...seoForm,
                  seo_google_tag_manager_id: e.target.value,
                })
              }
              placeholder="GTM-XXXXXXX"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              Bing Webmaster Verification
            </label>
            <input
              value={seoForm.seo_bing_webmaster}
              onChange={(e) =>
                setSeoForm({ ...seoForm, seo_bing_webmaster: e.target.value })
              }
              placeholder="کد تایید Bing"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-cream/70 mb-1.5 block font-bold">
              Yandex Verification
            </label>
            <input
              value={seoForm.seo_yandex_verification}
              onChange={(e) =>
                setSeoForm({
                  ...seoForm,
                  seo_yandex_verification: e.target.value,
                })
              }
              placeholder="کد تایید Yandex"
              dir="ltr"
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs text-cream/70 mb-1.5 block font-bold flex items-center gap-1.5">
              <Code className="w-3 h-3" /> اسکریپت سفارشی (در &lt;head&gt;)
            </label>
            <textarea
              value={seoForm.custom_head_scripts}
              onChange={(e) =>
                setSeoForm({ ...seoForm, custom_head_scripts: e.target.value })
              }
              rows={3}
              dir="ltr"
              placeholder='<meta name="custom" content="value"> یا اسکریپت‌های دلخواه'
              className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-xs font-mono resize-y"
            />
            <p className="text-[11px] text-cream/40 mt-1.5">
              برای استفاده‌های خاص مثل Schema.org، فایل robots یا هر تگ سفارشی دیگر
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-3">
          {seoSaved && (
            <span className="text-green-400 text-sm flex items-center gap-1.5">
              <Save className="w-4 h-4" /> با موفقیت ذخیره شد
            </span>
          )}
          <button
            onClick={saveSeo}
            disabled={seoSaving}
            className="btn-gold px-8 py-3 rounded-full font-bold flex items-center gap-2 disabled:opacity-50"
          >
            {seoSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> ذخیره تنظیمات سئو
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: number | string;
  color: "gold" | "blue" | "purple" | "green";
}) {
  const colors = {
    gold: "from-gold/20 to-gold/5 text-gold border-gold/20",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
    purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
    green: "from-green-500/20 to-green-500/5 text-green-400 border-green-500/20",
  };

  return (
    <div className={`p-6 rounded-2xl luxury-border bg-gradient-to-br ${colors[color]} backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold mb-1">
        {typeof value === "number"
          ? new Intl.NumberFormat("fa-IR").format(value)
          : value}
      </div>
      <div className="text-xs text-cream/60 leading-relaxed">{label}</div>
    </div>
  );
}
