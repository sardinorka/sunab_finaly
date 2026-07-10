"use client";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MapPin, Mail } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 md:py-32 bg-ink-2 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 md:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs text-gold tracking-[0.3em] uppercase">
              مشاوره اختصاصی
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 text-balance">
            آماده‌اید تجربه‌ای<br />
            <span className="shine">فراتر از تصور</span> داشته باشید؟
          </h2>
          <p className="text-lg text-cream/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            تیم متخصص ما آماده است تا با شما در انتخاب بهترین محصول برای فضای شما همراه شود. مشاوره کاملاً رایگان و محرمانه است.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="btn-gold px-10 py-5 rounded-full inline-flex items-center justify-center gap-2 group text-lg"
            >
              <span className="font-bold">رزرو مشاوره رایگان</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </Link>
            <a
              href="tel:+982100000000"
              className="btn-outline px-10 py-5 rounded-full inline-flex items-center justify-center gap-2 text-lg"
            >
              <Phone className="w-5 h-5" />
              <span>۰۲۱-۰۰۰۰۰۰۰۰</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-ink border-t border-white/5 pt-20 pb-8">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center">
                <span className="text-gold text-xl font-bold">س</span>
              </div>
              <div>
                <div className="text-cream text-xl font-bold">سوناب</div>
                <div className="text-[10px] text-cream/50 tracking-[0.3em]">SUNAB</div>
              </div>
            </div>
            <p className="text-cream/60 leading-relaxed max-w-md mb-6">
              برند برتر طراحی و تولید وان، جکوزی و زیردوشی‌های لاکچری در ایران. بیش از ۱۵ سال است که به خلق فضاهای آرامش‌بخش و باشکوه برای مشتریان خود می‌پردازیم.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <MapPin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-cream font-bold mb-6">دسترسی سریع</h4>
            <ul className="space-y-3">
              {[
                { label: "خانه", href: "/" },
                { label: "محصولات", href: "/products" },
                { label: "بلاگ", href: "/blog" },
                { label: "درباره ما", href: "/about" },
                { label: "اخذ نمایندگی", href: "/about#dealership" },
                { label: "تماس", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-cream/60 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-bold mb-6">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-cream/60">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>تهران، الهیه، خیابان فرشته، پلاک ۱۲</span>
              </li>
              <li className="flex gap-3 text-sm text-cream/60">
                <Phone className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span dir="ltr">۰۲۱-۰۰۰۰۰۰۰۰</span>
              </li>
              <li className="flex gap-3 text-sm text-cream/60">
                <Mail className="w-4 h-4 text-gold shrink-0 mt-1" />
                <span>info@sunab.ir</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-cream/40">
            © ۱۴۰۴ برند سوناب (SUNAB). تمامی حقوق محفوظ است.
          </p>
          <div className="flex gap-6 text-xs text-cream/40">
            <a href="#" className="hover:text-gold transition-colors">قوانین و مقررات</a>
            <a href="#" className="hover:text-gold transition-colors">حریم خصوصی</a>
            <a href="#" className="hover:text-gold transition-colors">گارانتی</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
