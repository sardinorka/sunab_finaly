"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export default function ProductFilters({
  categories,
  activeCategory,
  activeSearch,
  activeSort,
  activeInStock,
  activePriceMin,
  activePriceMax,
}: {
  categories: Category[];
  activeCategory?: string;
  activeSearch?: string;
  activeSort?: string;
  activeInStock?: string;
  activePriceMin?: string;
  activePriceMax?: string;
}) {
  const router = useRouter();

  const buildUrl = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged: Record<string, string | undefined> = {
      category: activeCategory,
      search: activeSearch,
      sort: activeSort,
      inStock: activeInStock,
      priceMin: activePriceMin,
      priceMax: activePriceMax,
      ...overrides,
    };

    // Clean out nulls
    for (const [k, v] of Object.entries(merged)) {
      if (v) params.set(k, v);
    }
    return `/products?${params.toString()}`;
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl({ sort: e.target.value || undefined }));
  };

  const handleInStock = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(buildUrl({ inStock: e.target.checked ? "1" : undefined }));
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    router.push(
      buildUrl({
        priceMin: (form.get("priceMin") as string) || undefined,
        priceMax: (form.get("priceMax") as string) || undefined,
      })
    );
  };

  const activeFiltersCount = [
    activeCategory,
    activeSearch,
    activeSort,
    activeInStock,
    activePriceMin || activePriceMax,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top bar: search + sort + active count */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value;
            router.push(buildUrl({ search: q || undefined }));
          }}
          className="relative flex-1 max-w-md"
        >
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cream/40" />
          <input
            name="q"
            type="text"
            defaultValue={activeSearch || ""}
            placeholder="جستجوی محصول..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-ink-2/80 border border-white/10 focus:border-gold outline-none text-sm transition-colors"
          />
        </form>

        {/* Sort + Stock Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-cream/50" />
            <select
              value={activeSort || ""}
              onChange={handleSort}
              className="px-3 py-2.5 rounded-xl bg-ink-2/80 border border-white/10 text-sm text-cream/80 outline-none cursor-pointer hover:border-white/20 transition-colors appearance-none"
            >
              <option value="">مرتب‌سازی پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="newest">جدیدترین</option>
            </select>
          </div>

          <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-ink-2/80 border border-white/10 cursor-pointer hover:border-gold/50 transition-colors text-sm">
            <input
              type="checkbox"
              checked={activeInStock === "1"}
              onChange={handleInStock}
              className="w-4 h-4 accent-gold rounded"
            />
            <span className="text-cream/80">فقط کالاهای موجود</span>
          </label>

          {activeFiltersCount > 0 && (
            <Link
              href="/products"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>حذف فیلترها</span>
            </Link>
          )}
        </div>
      </div>

      {/* Category filters + Price range */}
      <div className="flex flex-col lg:flex-row gap-4 items-start justify-between">
        {/* Category Chips */}
        <div className="flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`px-4 py-2 rounded-full text-xs border font-bold transition-all ${
              !activeCategory
                ? "bg-gold text-ink border-gold shadow-lg shadow-gold/20"
                : "border-white/10 text-cream/70 hover:border-gold/50 hover:text-gold hover:bg-gold/5"
            }`}
          >
            همه محصولات
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={buildUrl({ category: c.slug })}
              className={`px-4 py-2 rounded-full text-xs border transition-all ${
                activeCategory === c.slug
                  ? "bg-gold text-ink border-gold shadow-lg shadow-gold/20 font-bold"
                  : "border-white/10 text-cream/70 hover:border-gold/50 hover:text-gold hover:bg-gold/5"
              }`}
            >
              {c.name}
              {typeof c.count === "number" && (
                <span className="ml-1.5 opacity-60">
                  ({new Intl.NumberFormat("fa-IR").format(c.count)})
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Price Range Filter */}
        <form
          onSubmit={handlePriceSubmit}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-ink-2/80 border border-white/10"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-cream/50 mr-2" />
          <input
            name="priceMin"
            type="number"
            defaultValue={activePriceMin || ""}
            placeholder="حداقل"
            className="w-24 px-2.5 py-1.5 rounded-xl bg-ink border border-white/5 text-xs text-cream outline-none focus:border-gold/50 transition-colors text-center"
          />
          <span className="text-cream/40 text-xs">تا</span>
          <input
            name="priceMax"
            type="number"
            defaultValue={activePriceMax || ""}
            placeholder="حداکثر"
            className="w-24 px-2.5 py-1.5 rounded-xl bg-ink border border-white/5 text-xs text-cream outline-none focus:border-gold/50 transition-colors text-center"
          />
          <span className="text-cream/40 text-[10px] ml-1">میلیون تومان</span>
          <button
            type="submit"
            className="px-4 py-1.5 rounded-xl bg-gold text-ink text-xs font-bold hover:bg-gold-2 transition-colors"
          >
            اعمال
          </button>
        </form>
      </div>

      {/* Active filter tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 text-xs">
          {activeSearch && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              جستجو: «{activeSearch}»
            </span>
          )}
          {activePriceMin && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              از {new Intl.NumberFormat("fa-IR").format(Number(activePriceMin))} میلیون
            </span>
          )}
          {activePriceMax && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              تا {new Intl.NumberFormat("fa-IR").format(Number(activePriceMax))} میلیون
            </span>
          )}
          {activeSort && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/20">
              {activeSort === "price-asc" ? "ارزان‌ترین" : activeSort === "price-desc" ? "گران‌ترین" : "جدیدترین"}
            </span>
          )}
          {activeInStock === "1" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              فقط موجود
            </span>
          )}
        </div>
      )}
    </div>
  );
}
