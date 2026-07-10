"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, CheckCircle2, AlertCircle, Loader2, Shield } from "lucide-react";

type SetupResult = {
  success?: boolean;
  message?: string;
  error?: string;
  hint?: string;
  connected?: boolean;
  allTablesReady?: boolean;
  productCount?: number;
  productsInserted?: number;
  tables?: Record<string, boolean>;
};

export default function SetupPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<SetupResult | null>(null);

  const checkStatus = async () => {
    if (!password) {
      setResult({ error: "رمز ADMIN_PASSWORD را وارد کنید." });
      return;
    }
    setChecking(true);
    setResult(null);
    try {
      const res = await fetch(
        `/api/setup-db?password=${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (!res.ok) {
        setResult({ error: data.error || "بررسی وضعیت ناموفق بود." });
      } else {
        setResult(data);
      }
    } catch {
      setResult({ error: "خطا در ارتباط با سرور." });
    } finally {
      setChecking(false);
    }
  };

  const runSetup = async () => {
    if (!password) {
      setResult({ error: "رمز ADMIN_PASSWORD را وارد کنید." });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/setup-db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "خطا در ارتباط با سرور." });
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = result?.success || result?.allTablesReady;

  return (
    <main className="min-h-screen bg-ink text-cream flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-3xl border border-cream/10 bg-ink-2/90 p-8 md:p-10 shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 flex items-center justify-center">
            <Database className="w-6 h-6 text-gold" />
          </div>
          <div>
            <p className="text-xs tracking-[0.25em] text-gold uppercase">
              SUNAB Setup
            </p>
            <h1 className="text-2xl md:text-3xl font-bold">راه‌اندازی دیتابیس</h1>
          </div>
        </div>

        <p className="text-cream/70 text-sm leading-7 mb-8">
          خطای{" "}
          <code className="text-gold text-xs">relation &quot;page_views&quot; does not exist</code>{" "}
          یعنی جدول‌ها در Neon هنوز ساخته نشده‌اند. با یک کلیک همه جدول‌ها
          (محصولات، بلاگ، سفارش‌ها، بازدیدها، تنظیمات) ساخته می‌شوند و در صورت خالی
          بودن، داده‌های نمونه هم وارد می‌شوند.
        </p>

        <label className="block mb-2 text-sm text-cream/80">
          <span className="inline-flex items-center gap-2">
            <Shield className="w-4 h-4 text-gold" />
            رمز ADMIN_PASSWORD
          </span>
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="همان رمزی که در Netlify تنظیم کردی"
          className="w-full rounded-xl bg-ink border border-cream/15 px-4 py-3 text-sm outline-none focus:border-gold/60 mb-4"
          dir="ltr"
        />

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            type="button"
            onClick={runSetup}
            disabled={loading || checking}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gold text-ink font-semibold px-4 py-3 hover:bg-gold/90 disabled:opacity-60 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                در حال راه‌اندازی...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                راه‌اندازی دیتابیس
              </>
            )}
          </button>
          <button
            type="button"
            onClick={checkStatus}
            disabled={loading || checking}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-cream/20 px-4 py-3 text-sm hover:border-gold/50 disabled:opacity-60 transition"
          >
            {checking ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                بررسی...
              </>
            ) : (
              "بررسی وضعیت"
            )}
          </button>
        </div>

        {result && (
          <div
            className={`rounded-2xl border p-4 text-sm leading-7 ${
              isSuccess && !result.error
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                : result.error
                  ? "border-red-500/30 bg-red-500/10 text-red-100"
                  : "border-cream/15 bg-cream/5 text-cream/80"
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {isSuccess && !result.error ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              ) : result.error ? (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              ) : null}
              <div>
                {result.message && <p className="font-semibold">{result.message}</p>}
                {result.error && <p className="font-semibold">{result.error}</p>}
                {result.hint && <p className="opacity-80 mt-1">{result.hint}</p>}
                {typeof result.productCount === "number" && (
                  <p className="mt-2">تعداد محصولات: {result.productCount}</p>
                )}
                {typeof result.productsInserted === "number" &&
                  result.productsInserted > 0 && (
                    <p>{result.productsInserted} محصول نمونه اضافه شد.</p>
                  )}
                {result.tables && (
                  <ul className="mt-3 space-y-1 font-mono text-xs" dir="ltr">
                    {Object.entries(result.tables).map(([name, ok]) => (
                      <li key={name}>
                        {ok ? "✅" : "❌"} {name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-cream/10 flex flex-wrap gap-4 text-sm">
          <Link href="/" className="text-gold hover:underline">
            صفحه اصلی
          </Link>
          <Link href="/products" className="text-cream/60 hover:text-cream">
            محصولات
          </Link>
          <Link href="/admin" className="text-cream/60 hover:text-cream">
            پنل مدیریت
          </Link>
          <Link href="/admin/analytics" className="text-cream/60 hover:text-cream">
            آمار و سئو
          </Link>
        </div>
      </div>
    </main>
  );
}
