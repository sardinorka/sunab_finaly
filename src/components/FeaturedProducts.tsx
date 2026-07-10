"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { StoreProduct } from "@/lib/types";
import AddToCartButton from "@/components/AddToCartButton";

export default function FeaturedProducts({ products }: { products: StoreProduct[] }) {
  const featured = products.filter((p) => p.isFeatured).slice(0, 3);
  const list = featured.length > 0 ? featured : products.slice(0, 3);

  return (
    <section className="relative py-24 md:py-32 bg-ink">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">
                شاهکارهای ما
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
              محصولاتی که<br />
              <span className="shine">افسانه می‌شوند</span>
            </h2>
          </motion.div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-gold hover:gap-4 transition-all"
          >
            <span className="text-sm tracking-wide">مشاهده همه محصولات</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {list.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: StoreProduct; index: number }) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("fa-IR").format(Number(price) / 1000000) + " میلیون";
  };

  return (
    <div className="group card-hover">
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
            <span className="text-[10px] text-gold/70 tracking-[0.3em]">۰{index + 1}</span>
            <div className="w-8 h-px bg-gold/30" />
          </div>
          <h3 className="text-2xl font-bold text-cream group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-cream/60 line-clamp-1">{product.tagline}</p>
        </div>
      </Link>
      <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
        <span className="text-lg font-bold text-gold">
          {formatPrice(product.price)} <span className="text-xs text-cream/40">تومان</span>
        </span>
        <AddToCartButton product={product} variant="icon" />
      </div>
    </div>
  );
}
