"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { IMAGES } from "@/lib/images";

const categories = [
  {
    id: "bathtub",
    title: "وان",
    subtitle: "وان‌های مستقل و سلطنتی",
    slug: "وان",
    image: IMAGES.almas,
    count: "۸+ شاهکار",
    tagline: "تجربه غوطه‌وری در شکوه سنگ مرمر و طلای ناب",
    description:
      "وان‌های مستقل سوناب با طراحی کلاسیک و مینیمال، ساخته‌شده از سنگ مرمر طبیعی کارارا و مس با روکش طلای ۲۴ عیار. نقطه‌عطف معماری هر حمام مستر.",
    highlights: [
      "سنگ مرمر طبیعی کارارا و گرانیت سیاه",
      "پایه‌های چوب گردوی دست‌ساز",
      "حفظ حرارت طولانی‌مدت آب",
    ],
  },
  {
    id: "jacuzzi",
    title: "جکوزی",
    subtitle: "جکوزی‌های هیدروتراپی و فضای باز",
    slug: "جکوزی",
    image: IMAGES.sapphire,
    count: "۶+ مدل پریمیوم",
    tagline: "ترکیب علم آب‌درمانی با فناوری ماساژ هوشمند",
    description:
      "مجهز به ده‌ها جت قدرتمند هیدروتراپی، نورپردازی کروماتراپی و سیستم تصفیه پیشرفته اوزون برای تسکین دردهای عضلانی و آرامش عمیق روان.",
    highlights: [
      "۲۴ تا ۴۰ جت هیدروتراپی قابل تنظیم",
      "نورپردازی کروماتراپی آرامش‌بخش",
      "پنل کنترل لمسی و سیستم اوزون",
    ],
  },
  {
    id: "shower-tray",
    title: "زیردوشی",
    subtitle: "زیردوشی‌های سنگ اسلات و کوارتز",
    slug: "زیردوشی",
    image: IMAGES.nordic,
    count: "۵+ طرح اولترا اسلیم",
    tagline: "ظرافت سنگ طبیعی با ساختار کاملاً ضدلغزش",
    description:
      "طراحی اولترا اسلیم ۳ سانتی‌متری با شیب مهندسی‌شده برای تخلیه فوری آب. سطحی گرم در لمس و کاملاً آنتی‌باکتریال برای کابین‌های دوش مدرن.",
    highlights: [
      "ضخامت فوق‌باریک ۳ سانتی‌متری",
      "سطح ۱۰۰٪ ضد لغزش (Anti-slip)",
      "رزین کوارتز و سنگ طبیعی اسلات",
    ],
  },
];

export default function CategoryShowcase() {
  return (
    <section className="relative py-24 md:py-32 bg-ink-2/60 border-y border-white/5 overflow-hidden">
      {/* Golden subtle glow background elements */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
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
              <span className="text-xs text-gold tracking-[0.3em] uppercase flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                کالکشن‌های اصلی سوناب
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight text-balance text-cream">
              پالتی از <span className="text-gold gold-glow">شکوه و آرامش</span>
            </h2>
          </motion.div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-cream/70 hover:text-gold transition-all group"
          >
            <span className="text-sm tracking-wide">مشاهده تمامی محصولات فروشگاه</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gold" />
          </Link>
        </div>

        {/* 3 Categories Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.2 }}
              className="flex flex-col group rounded-3xl luxury-border bg-ink/70 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-gold/50 hover:shadow-[0_10px_40px_-15px_rgba(201,169,97,0.2)]"
            >
              {/* Image Section */}
              <Link href={`/products?category=${encodeURIComponent(cat.slug)}`} className="block relative aspect-[16/11] overflow-hidden product-image-wrap">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                
                {/* Top badges */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-ink/80 backdrop-blur-md border border-white/10 text-gold">
                    ۰{i + 1}
                  </span>
                  <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-gold/90 text-ink shadow-lg shadow-gold/20">
                    {cat.count}
                  </span>
                </div>

                {/* Bottom title inside image wrapper */}
                <div className="absolute bottom-5 left-6 right-6 z-10">
                  <span className="text-xs text-gold tracking-widest uppercase block mb-1">
                    کالکشن تخصصی
                  </span>
                  <h3 className="text-3xl font-bold text-cream group-hover:text-gold transition-colors">
                    {cat.title}
                  </h3>
                </div>
              </Link>

              {/* Text & Features Section */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
                <div>
                  <div className="text-sm font-bold text-gold/90 mb-3 tracking-wide">
                    {cat.subtitle}
                  </div>
                  <p className="text-sm text-cream/70 leading-relaxed mb-6">
                    {cat.description}
                  </p>

                  <ul className="space-y-2.5 border-t border-white/5 pt-5">
                    {cat.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-xs text-cream/80">
                        <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div className="pt-6 border-t border-white/5 mt-auto">
                  <Link
                    href={`/products?category=${encodeURIComponent(cat.slug)}`}
                    className="w-full py-4 px-6 rounded-2xl bg-ink-2 border border-white/10 hover:border-gold hover:bg-gold hover:text-ink transition-all duration-300 flex items-center justify-between group/btn font-bold text-sm text-cream"
                  >
                    <span>مشاهده کالکشن {cat.title}</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover/btn:bg-ink/20 flex items-center justify-center transition-colors">
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
