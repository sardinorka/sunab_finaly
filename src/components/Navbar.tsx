"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/products", label: "محصولات" },
  { href: "/blog", label: "بلاگ" },
  { href: "/about", label: "درباره ما" },
  { href: "/about#dealership", label: "اخذ نمایندگی" },
  { href: "/contact", label: "تماس" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItems, isHydrated } = useCart();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-ink/80 backdrop-blur-xl border-b border-white/5 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center group-hover:bg-gold transition-colors">
              <span className="text-gold group-hover:text-ink text-lg font-bold transition-colors">س</span>
            </div>
            <div className="flex flex-col">
              <span className="text-cream text-lg font-bold tracking-wide">سوناب</span>
              <span className="text-[10px] text-cream/50 tracking-[0.3em]">SUNAB</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-cream/80 hover:text-gold transition-colors group"
              >
                {link.label}
                <span className="absolute -bottom-1 right-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden md:flex w-10 h-10 rounded-full border border-white/10 items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <Link
              href="/cart"
              className="relative w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-gold text-ink text-[10px] flex items-center justify-center font-bold">
                  {new Intl.NumberFormat("fa-IR").format(totalItems)}
                </span>
              )}
            </Link>
            <button
              className="md:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden hidden md:block"
            >
              <form
                onSubmit={handleSearch}
                className="max-w-[1600px] mx-auto px-6 md:px-12 pt-6"
              >
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصول..."
                  className="w-full px-5 py-3 rounded-full bg-ink-2 border border-white/10 focus:border-gold outline-none transition-colors"
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full p-8">
              <div className="flex justify-between items-center mb-12">
                <span className="text-cream text-xl font-bold">منو</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSearch} className="mb-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصول..."
                  className="w-full px-5 py-3 rounded-full bg-ink-2 border border-white/10 focus:border-gold outline-none transition-colors"
                />
              </form>
              <nav className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-3xl text-cream hover:text-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
