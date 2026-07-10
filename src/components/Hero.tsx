"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const slides = [
  {
    id: 1,
    image:
      "https://images.pexels.com/photos/7214327/pexels-photo-7214327.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    tag: "کالکشن ۱۴۰۴",
    line1: "هنرِ",
    gold: "آرامش",
    line2: "در آغوش آب",
    desc: "کالکشن تخصصی وان‌های دست‌ساز سوناب، تراشیده‌شده از مرغوب‌ترین سنگ مرمر جهان.",
    cta: "مشاهده کالکشن",
    href: "/products",
  },
  {
    id: 2,
    image:
      "https://images.pexels.com/photos/6207947/pexels-photo-6207947.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    tag: "هیدروتراپی هوشمند",
    line1: "تجربه‌ای",
    gold: "فراتر",
    line2: "از تصور شما",
    desc: "جکوزی‌های سوناب با ۲۴ جت ماساژ و نورپردازی کروماتراپی. سلامتی در خانه شما.",
    cta: "مشاهده جکوزی‌ها",
    href: "/products?category=%D8%AC%DA%A9%D9%88%D8%B2%DB%8C",
  },
  {
    id: 3,
    image:
      "https://images.pexels.com/photos/6265839/pexels-photo-6265839.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
    tag: "مینیمالیسم مطلق",
    line1: "ظرافتِ",
    gold: "سنگ",
    line2: "زیر پای شما",
    desc: "زیردوشی‌های اولترا اسلیم از کوارتز و اسلات طبیعی. ایمنی صددرصد، زیبایی بی‌نهایت.",
    cta: "مشاهده زیردوشی‌ها",
    href: "/products?category=%D8%B2%DB%8C%D8%B1%D8%AF%D9%88%D8%B4%DB%8C",
  },
];

const DURATION = 7000;
const PARTICLE_COUNT = 30;

/* ═══════════════════════════════════════════════════════════
   GOLDEN DUST PARTICLES — bright, glowing
   ═══════════════════════════════════════════════════════════ */
function Particles() {
  const items = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        dur: 14 + Math.random() * 14,
        size: 2.5 + Math.random() * 4.5,
        drift: -60 + Math.random() * 120,
        opacity: 0.5 + Math.random() * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 z-[4] pointer-events-none overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full particle-float"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            bottom: "-5%",
            opacity: p.opacity,
            background:
              "radial-gradient(circle, #fff8e1 0%, #c9a961 50%, rgba(201,169,97,0) 100%)",
            boxShadow: `0 0 ${p.size * 4}px ${p.size * 1.5}px rgba(201,169,97,0.5)`,
            // @ts-expect-error -- CSS custom properties
            "--float-dur": `${p.dur}s`,
            "--float-delay": `${p.delay}s`,
            "--float-drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CURSOR GLOW
   ═══════════════════════════════════════════════════════════ */
function CursorGlow() {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 60, damping: 25 });
  const y = useSpring(rawY, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [rawX, rawY]);

  return (
    <motion.div
      className="fixed w-[500px] h-[500px] rounded-full pointer-events-none z-[5] hidden lg:block"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(201,169,97,0.08) 0%, transparent 70%)",
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════
   CIRCULAR SVG PROGRESS
   ═══════════════════════════════════════════════════════════ */
function CircleProgress({
  duration,
  slideId,
}: {
  duration: number;
  slideId: number;
}) {
  const R = 22;
  const C = 2 * Math.PI * R;
  return (
    <svg
      width="54"
      height="54"
      className="absolute -inset-[5px] -rotate-90 pointer-events-none"
    >
      <circle
        cx="27"
        cy="27"
        r={R}
        stroke="rgba(201,169,97,0.15)"
        strokeWidth="2"
        fill="none"
      />
      <circle
        key={slideId}
        cx="27"
        cy="27"
        r={R}
        stroke="#c9a961"
        strokeWidth="2"
        fill="none"
        strokeDasharray={C}
        strokeDashoffset={C}
        strokeLinecap="round"
        className="animate-circle-fill"
        style={{ animationDuration: `${duration}ms` }}
      />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function Hero() {
  const [cur, setCur] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── Mouse parallax ── */
  const mouseRawX = useMotionValue(0.5);
  const mouseRawY = useMotionValue(0.5);
  const mouseX = useSpring(mouseRawX, { stiffness: 40, damping: 20 });
  const mouseY = useSpring(mouseRawY, { stiffness: 40, damping: 20 });
  const bgX = useTransform(mouseX, [0, 1], [25, -25]);
  const bgY = useTransform(mouseY, [0, 1], [15, -15]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseRawX.set((e.clientX - rect.left) / rect.width);
      mouseRawY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseRawX, mouseRawY]
  );

  const go = useCallback((i: number) => setCur(i), []);
  const next = useCallback(() => setCur((c) => (c + 1) % slides.length), []);
  const prev = useCallback(
    () => setCur((c) => (c - 1 + slides.length) % slides.length),
    []
  );

  /* ── Auto-play: ALWAYS runs, never paused by hover ── */
  useEffect(() => {
    timer.current = setInterval(next, DURATION);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, cur]);

  const s = slides[cur];

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-ink"
      onMouseMove={handleMouseMove}
    >
      {/* ── Cursor spotlight ── */}
      <CursorGlow />

      {/* ── Golden floating particles ── */}
      <Particles />

      {/* ── Background images (Ken Burns + mouse parallax) ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={s.id}
          className="absolute -inset-[60px] z-[1]"
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.6, ease: "easeInOut" },
            scale: { duration: DURATION / 1000 + 2, ease: "linear" },
          }}
          style={{ x: bgX, y: bgY }}
        >
          <Image
            src={s.image}
            alt={s.gold}
            fill
            priority
            className="object-cover"
            sizes="110vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Cinematic overlays ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-ink/95 via-ink/60 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/50" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')]" />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 h-full max-w-[1600px] mx-auto px-6 md:px-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            className="max-w-3xl pt-24"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.13 } },
              exit: {},
            }}
          >
            {/* ── Tag ── */}
            <motion.div
              variants={reveal}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-gold" />
              <span className="text-[11px] text-gold tracking-[0.35em] uppercase font-semibold">
                {s.tag}
              </span>
            </motion.div>

            {/* ── Title ── */}
            <motion.h1
              variants={reveal}
              className="mb-10"
            >
              <span className="block text-4xl md:text-6xl lg:text-7xl font-light text-cream/90 leading-snug">
                <WordReveal text={s.line1} baseDelay={0} />
              </span>
              <span className="block text-6xl md:text-8xl lg:text-[7rem] font-black text-gold hero-gold-glow leading-tight mt-2">
                <WordReveal text={s.gold} baseDelay={0.15} />
              </span>
              <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-cream/80 leading-snug mt-4">
                <WordReveal text={s.line2} baseDelay={0.3} />
              </span>
            </motion.h1>

            {/* ── Description ── */}
            <motion.p
              variants={reveal}
              className="text-base md:text-xl text-cream/60 max-w-xl leading-relaxed mb-12"
            >
              {s.desc}
            </motion.p>

            {/* ── CTA ── */}
            <motion.div variants={reveal} className="flex gap-4">
              <Link
                href={s.href}
                className="btn-gold px-10 py-5 rounded-full inline-flex items-center justify-center gap-3 group text-lg"
              >
                <span className="font-bold">{s.cta}</span>
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom bar ── */}
        <div className="absolute bottom-10 left-6 right-6 md:left-12 md:right-12 z-20 flex items-end justify-between">
          {/* Stats */}
          <div className="hidden md:grid grid-cols-3 gap-10 border-t border-white/10 pt-6">
            {[
              ["۱۵+", "سال تجربه"],
              ["۴۰۰+", "پروژه لاکچری"],
              ["۱۰۰٪", "رضایت مشتری"],
            ].map(([v, l], i) => (
              <div
                key={i}
                className={i > 0 ? "border-r border-white/10 pr-10" : ""}
              >
                <div className="text-3xl font-bold text-gold mb-1">{v}</div>
                <div className="text-[11px] text-cream/50">{l}</div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-5 mr-auto md:mr-0">
            {/* Dots */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-500"
                  style={{ width: i === cur ? 48 : 20 }}
                  aria-label={`اسلاید ${i + 1}`}
                >
                  <span className="absolute inset-0 bg-white/20 rounded-full" />
                  {i === cur && (
                    <motion.span
                      key={`fill-${s.id}`}
                      className="absolute inset-0 bg-gold rounded-full origin-right"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{
                        duration: DURATION / 1000,
                        ease: "linear",
                      }}
                    />
                  )}
                  {i < cur && (
                    <span className="absolute inset-0 bg-gold/60 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Arrows */}
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-cream/70 hover:border-gold hover:text-gold transition-all active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={next}
                className="relative z-10 w-11 h-11 rounded-full bg-gold text-ink flex items-center justify-center hover:bg-gold-2 transition-colors active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 stroke-[3]" />
              </button>
              <CircleProgress duration={DURATION} slideId={s.id} />
            </div>

            {/* Counter */}
            <span className="text-xs font-mono text-cream/40 tabular-nums">
              <span className="text-gold text-base font-bold">
                {String(cur + 1).padStart(2, "0")}
              </span>{" "}
              / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Side label ── */}
      <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-4">
        <span className="w-px h-20 bg-gradient-to-b from-transparent to-gold/30" />
        <span
          className="text-[9px] text-cream/20 tracking-[0.5em] uppercase"
          style={{ writingMode: "vertical-rl" }}
        >
          SUNAB — Since 2009
        </span>
        <span className="w-px h-20 bg-gradient-to-b from-gold/30 to-transparent" />
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] text-cream/30 tracking-widest">
          SCROLL
        </span>
        <span className="w-px h-8 bg-gradient-to-b from-gold/50 to-transparent" />
      </motion.div>

      {/* ── Corner frames ── */}
      <span className="hidden md:block absolute top-6 right-6 w-16 h-16 border-t border-r border-gold/[0.08] rounded-tr-2xl z-20 pointer-events-none" />
      <span className="hidden md:block absolute bottom-6 left-6 w-16 h-16 border-b border-l border-gold/[0.08] rounded-bl-2xl z-20 pointer-events-none" />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORD REVEAL — each word animates as one connected block
   (keeps Persian letters properly joined)
   spacing is handled with regular CSS word-spacing
   ═══════════════════════════════════════════════════════════ */
function WordReveal({
  text,
  baseDelay = 0,
}: {
  text: string;
  baseDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap gap-x-[0.35em]">
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ perspective: 600 }}
          variants={{
            hidden: { opacity: 0, y: 50, rotateX: -40, filter: "blur(5px)" },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: "blur(0px)",
              transition: {
                duration: 0.8,
                delay: baseDelay + i * 0.12,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              },
            },
            exit: {
              opacity: 0,
              y: -25,
              filter: "blur(4px)",
              transition: { duration: 0.25, delay: i * 0.04 },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SHARED REVEAL VARIANT
   ═══════════════════════════════════════════════════════════ */
const reveal = {
  hidden: { opacity: 0, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(4px)",
    transition: { duration: 0.35 },
  },
};
