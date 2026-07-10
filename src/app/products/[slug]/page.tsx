import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import AddToCartButton from "@/components/AddToCartButton";
import Image from "next/image";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fa-IR").format(Number(price));
  };

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <div className="relative product-image-wrap aspect-[4/5] rounded-3xl overflow-hidden luxury-border">
            {product.isNew && (
              <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-full bg-gold text-ink text-sm font-bold">
                محصول جدید
              </div>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">
                {product.category}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-4">{product.name}</h1>
            <p className="text-xl text-cream/70 mb-8">{product.tagline}</p>

            <div className="flex items-baseline gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-4xl font-bold text-gold">
                {formatPrice(product.price)}
              </span>
              <span className="text-cream/50">تومان</span>
              {product.onSale && product.regularPrice && (
                <span className="text-lg text-cream/40 line-through">
                  {formatPrice(product.regularPrice)}
                </span>
              )}
            </div>

            <p className="text-cream/70 leading-relaxed mb-8">{product.description}</p>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-cream mb-4 tracking-wider">ویژگی‌های کلیدی</h3>
                <ul className="space-y-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-cream/80">
                      <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-gold" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specs */}
            {(product.material || product.dimensions || product.capacity) && (
              <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-white/10">
                {product.material && (
                  <div>
                    <div className="text-xs text-cream/50 mb-1">جنس</div>
                    <div className="text-sm text-cream font-bold">{product.material}</div>
                  </div>
                )}
                {product.dimensions && (
                  <div>
                    <div className="text-xs text-cream/50 mb-1">ابعاد</div>
                    <div className="text-sm text-cream font-bold">{product.dimensions}</div>
                  </div>
                )}
                {product.capacity && (
                  <div>
                    <div className="text-xs text-cream/50 mb-1">ظرفیت</div>
                    <div className="text-sm text-cream font-bold">{product.capacity}</div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 p-4 rounded-xl bg-ink-2 border border-white/5">
              <div className="flex items-center gap-3 text-sm text-cream/60">
                <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                <span>
                  {product.inStock
                    ? "موجود در انبار - ارسال در ۳-۵ روز کاری"
                    : "این محصول در حال حاضر ناموجود است"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
