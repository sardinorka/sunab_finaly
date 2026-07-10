"use client";
import { motion } from "framer-motion";
import { Award, Gem, Leaf, Wrench } from "lucide-react";

const values = [
  {
    icon: Gem,
    title: "متریال بی‌نظیر",
    desc: "سنگ مرمر کارارا، مس ناب، طلای ۲۴ عیار و چوب‌های کمیاب از سراسر جهان.",
  },
  {
    icon: Wrench,
    title: "ساخت دست‌ساز",
    desc: "هر محصول توسط استادکاران با تجربه و با دقت میلی‌متری ساخته می‌شود.",
  },
  {
    icon: Award,
    title: "گارانتی مادام‌العمر",
    desc: "به کیفیت کار خود ایمان داریم؛ پس گارانتی مادام‌العمر ارائه می‌دهیم.",
  },
  {
    icon: Leaf,
    title: "پایداری و محیط زیست",
    desc: "استفاده از منابع پایدار و فرآیندهای تولید دوستدار محیط زیست.",
  },
];

export default function AboutSection() {
  return (
    <section className="relative py-24 md:py-32 bg-ink-2 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

      <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">
                فلسفه ما
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-balance">
              سوناب،<br />
              <span className="shine">میراثی از شکوه</span>
            </h2>
            <p className="text-cream/70 text-lg leading-relaxed mb-8">
              بیش از ۱۵ سال است که برند سوناب (SUNAB) به عنوان پیشرو در طراحی و تولید وان، جکوزی و زیردوشی لاکچری در ایران، استانداردهای جدیدی از شکوه و آرامش را تعریف کرده است. ما معتقدیم حمام، نه فقط یک فضا، بلکه پناهگاهی برای روح است.
            </p>
            <p className="text-cream/60 leading-relaxed mb-10">
              هر محصول ما داستانی دارد. داستانی از استادکارانی که با عشق، دقت و تعهد به کمال، قطعه‌ای می‌سازند که قرار است دهه‌ها در خانه شما بماند و خاطراتی بی‌نظیر را ثبت کند.
            </p>

            <div className="flex items-center gap-8 pb-8 border-b border-white/10">
              <div>
                <div className="text-4xl font-bold text-gold mb-1">۱۵+</div>
                <div className="text-xs text-cream/50">سال تجربه</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-4xl font-bold text-gold mb-1">۴۰۰+</div>
                <div className="text-xs text-cream/50">پروژه موفق</div>
              </div>
              <div className="w-px h-12 bg-white/10" />
              <div>
                <div className="text-4xl font-bold text-gold mb-1">۹۸٪</div>
                <div className="text-xs text-cream/50">رضایت مشتری</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Values */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className={`p-6 rounded-2xl luxury-border bg-ink/40 backdrop-blur-sm hover:bg-ink-3 transition-colors ${
                  i % 2 === 1 ? "sm:translate-y-8" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-cream">{v.title}</h3>
                <p className="text-sm text-cream/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
