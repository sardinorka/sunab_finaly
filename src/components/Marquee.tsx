"use client";
import { motion } from "framer-motion";

const words = ["لاکچری", "دست‌ساز", "منحصر‌به‌فرد", "بی‌نظیر", "شکوه", "آرامش", "هنر"];

export default function Marquee() {
  return (
    <section className="py-12 bg-ink border-y border-white/5 overflow-hidden">
      <div className="flex whitespace-nowrap">
        <div className="marquee flex gap-16 pr-16 shrink-0">
          {[...words, ...words, ...words].map((word, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="text-5xl md:text-7xl font-bold text-cream/10 hover:text-gold transition-colors">
                {word}
              </span>
              <span className="text-gold text-3xl">✦</span>
            </div>
          ))}
        </div>
        <div className="marquee flex gap-16 pr-16 shrink-0" aria-hidden>
          {[...words, ...words, ...words].map((word, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="text-5xl md:text-7xl font-bold text-cream/10">
                {word}
              </span>
              <span className="text-gold text-3xl">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
