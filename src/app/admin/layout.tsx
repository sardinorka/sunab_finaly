"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  PenTool,
  TrendingUp,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/me", { cache: "no-store" });
        const data = await res.json();
        if (data.authenticated) {
          setAuthorized(true);
        } else {
          router.push("/admin/login");
        }
      } catch {
        router.push("/admin/login");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (authorized === null) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-cream/50 text-sm">
        در حال بارگذاری پنل مدیریت...
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "داشبورد آماری", icon: LayoutDashboard },
    { href: "/admin/products", label: "مدیریت محصولات", icon: Package },
    { href: "/admin/orders", label: "سفارش‌های مشتریان", icon: ShoppingBag },
    { href: "/admin/blog", label: "مقالات بلاگ", icon: PenTool },
    { href: "/admin/analytics", label: "بازدیدها و سئو", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-ink flex flex-col lg:flex-row text-cream antialiased">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-ink-2/80 border-l border-white/5 p-6 shrink-0 min-h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/10">
          <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center bg-gold/10 shrink-0">
            <ShieldCheck className="w-5 h-5 text-gold" />
          </div>
          <div>
            <div className="font-bold text-cream">پنل مدیریت</div>
            <div className="text-[11px] text-gold tracking-widest uppercase">سوناب</div>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  active
                    ? "bg-gold text-ink"
                    : "text-cream/70 hover:bg-white/5 hover:text-cream"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-cream/60 hover:text-gold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>مشاهده ویترین سایت</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="lg:hidden bg-ink-2 border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-gold" />
          <span className="font-bold">مدیریت سوناب</span>
        </div>
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/95 pt-20 p-6 flex flex-col justify-between lg:hidden">
          <nav className="space-y-3">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold ${
                    active ? "bg-gold text-ink" : "text-cream/80 bg-ink-2"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <Link
              href="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-ink-2 text-cream/70 text-sm"
            >
              <ExternalLink className="w-5 h-5" />
              <span>مشاهده ویترین سایت</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-red-500/10 text-red-400 text-sm font-bold"
            >
              <LogOut className="w-5 h-5" />
              <span>خروج از پنل</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
