import { listProducts, listCategories } from "@/lib/products";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import ProductFilters from "@/components/ProductFilters";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    inStock?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
}) {
  const sp = await searchParams;
  const { category, search, sort, inStock, priceMin, priceMax } = sp;

  const [allProducts, categories] = await Promise.all([
    listProducts({
      category,
      search,
      sort,
      inStock: inStock === "1",
      priceMin: priceMin ? Number(priceMin) : undefined,
      priceMax: priceMax ? Number(priceMax) : undefined,
    }),
    listCategories(),
  ]);

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fa-IR").format(Number(price) / 1000000) + " میلیون";
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-8 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-px bg-gold" />
          <span className="text-xs text-gold tracking-[0.3em] uppercase">کالکشن</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          تمام <span className="shine">شاهکارها</span>
        </h1>
        <p className="text-cream/60 text-lg max-w-2xl">
          مجموعه کامل وان، جکوزی و زیردوشی‌های لاکچری سوناب (SUNAB). هر محصول، یک داستان از شکوه و آرامش.
        </p>
        {search && (
          <p className="mt-4 text-sm text-cream/50">
            نتایج جستجو برای: <span className="text-gold">«{search}»</span>
            {allProducts.length > 0 && (
              <span className="text-cream/40">
                {" "}
                — {new Intl.NumberFormat("fa-IR").format(allProducts.length)} محصول یافت شد
              </span>
            )}
          </p>
        )}
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 max-w-[1600px] mx-auto pb-10">
        <ProductFilters
          categories={categories}
          activeCategory={category}
          activeSearch={search}
          activeSort={sort}
          activeInStock={inStock}
          activePriceMin={priceMin}
          activePriceMax={priceMax}
        />
      </section>

      {/* Products Grid */}
      <section className="pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        {allProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
              <ArrowLeft className="w-6 h-6 text-gold/40" />
            </div>
            <div className="text-cream/60 mb-2">محصولی با این شرایط یافت نشد.</div>
            <Link href="/products" className="text-xs text-gold hover:underline">
              حذف همه فیلترها
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {allProducts.map((product, i) => (
              <div key={product.id} className="group card-hover">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative product-image-wrap aspect-[4/5] rounded-2xl overflow-hidden mb-6 luxury-border">
                    {product.isNew && (
                      <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-gold text-ink text-xs font-bold">
                        جدید
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-ink/80 border border-white/20 text-cream text-xs font-bold">
                        ناموجود
                      </div>
                    )}
                    {product.onSale && (
                      <div className="absolute bottom-4 right-4 z-10 px-3 py-1 rounded-full bg-red-500/80 text-white text-xs font-bold">
                        تخفیف ویژه
                      </div>
                    )}
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <span className="text-xs text-cream/60 tracking-wider">{product.category}</span>
                      <div className="w-10 h-10 rounded-full bg-gold/10 backdrop-blur-md border border-gold/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowLeft className="w-4 h-4 text-gold" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gold/70 tracking-[0.3em]">
                        {new Intl.NumberFormat("fa-IR").format(i + 1).padStart(2, "۰")}
                      </span>
                      <div className="w-8 h-px bg-gold/30" />
                    </div>
                    <h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-cream/60 line-clamp-1">{product.tagline}</p>
                  </div>
                </Link>
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                  <div>
                    <span className="text-lg font-bold text-gold">
                      {formatPrice(product.price)} <span className="text-xs text-cream/40">تومان</span>
                    </span>
                    {product.onSale && product.regularPrice && (
                      <span className="text-xs text-cream/40 line-through block">
                        {formatPrice(product.regularPrice)} تومان
                      </span>
                    )}
                  </div>
                  <AddToCartButton product={product} variant="icon" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
