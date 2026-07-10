"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: number;
  authorName: string;
  authorRole: string;
  content: string;
  rating: number;
}

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative py-24 md:py-32 bg-ink overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs text-gold tracking-[0.3em] uppercase">
              صدای مشتریان
            </span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-balance">
            آنچه درباره ما<br />
            <span className="shine">می‌گویند</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative p-8 rounded-2xl luxury-border bg-ink-2/50 backdrop-blur-sm hover:border-gold/40 transition-colors"
            >
              <Quote className="absolute top-6 left-6 w-10 h-10 text-gold/20" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-cream/80 leading-relaxed mb-6 text-lg">
                «{t.content}»
              </p>
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-2 flex items-center justify-center text-ink font-bold">
                    {t.authorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-cream">{t.authorName}</div>
                    <div className="text-xs text-cream/50">{t.authorRole}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
