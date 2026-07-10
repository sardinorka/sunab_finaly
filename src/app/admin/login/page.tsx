"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.push("/admin");
      } else {
        setError(data.error || "رمز عبور اشتباه است");
      }
    } catch {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink flex flex-col justify-center items-center px-6 grain">
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl luxury-border bg-ink-2/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border border-gold flex items-center justify-center mx-auto mb-4 bg-gold/5">
            <Lock className="w-7 h-7 text-gold" />
          </div>
          <h1 className="text-2xl font-bold text-cream mb-1">ورود به پنل مدیریت</h1>
          <p className="text-xs text-cream/50 tracking-wider">سیستم مدیریت اختصاصی سوناب</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs text-cream/70 mb-2 block font-bold">رمز عبور مدیریت</label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-5 py-4 rounded-2xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors text-center font-mono text-lg tracking-widest text-cream"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{loading ? "در حال بررسی..." : "ورود به پنل مدیریت"}</span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-cream/60 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>بازگشت به فروشگاه</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
