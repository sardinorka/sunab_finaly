import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Award, Users, Gem, Wrench, Store, ShieldCheck, Truck, Headphones, ArrowLeft } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">داستان ما</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-balance">
              میراثی از<br />
              <span className="shine">شکوه و آرامش</span>
            </h1>
            <p className="text-lg text-cream/70 leading-relaxed mb-6">
              برند سوناب (SUNAB) در سال ۱۳۸۸ با یک رویا متولد شد: خلق فضاهایی که نه فقط حمام، بلکه پناهگاهی برای روح باشند. امروز، پس از بیش از ۱۵ سال تلاش بی‌وقفه، به یکی از معتبرترین برندهای وان، جکوزی و زیردوشی لاکچری در ایران تبدیل شده‌ایم.
            </p>
            <p className="text-cream/60 leading-relaxed">
              فلسفه ما ساده است: بهترین متریال جهان، دستان هنرمند استادکاران، و عشقی بی‌پایان به کمال. هر محصولی که از کارگاه ما خارج می‌شود، حامل این سه ارزش بنیادین است.
            </p>
          </div>

          <div className="relative aspect-square rounded-3xl overflow-hidden luxury-border">
            <Image
              src={IMAGES.heroBathtub}
              alt="درباره سوناب"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-ink-2 border-y border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, value: "۱۵+", label: "سال تجربه" },
              { icon: Users, value: "۴۰۰+", label: "پروژه موفق" },
              { icon: Gem, value: "۹۸٪", label: "رضایت مشتری" },
              { icon: Wrench, value: "۵۰+", label: "استادکار ماهر" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-gold" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gold mb-2">{stat.value}</div>
                <div className="text-sm text-cream/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-px bg-gold" />
            <span className="text-xs text-gold tracking-[0.3em] uppercase">ارزش‌های ما</span>
            <div className="w-12 h-px bg-gold" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            آنچه ما را <span className="shine">متفاوت</span> می‌کند
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "کیفیت بی‌چون‌وچرا",
              desc: "از سنگ مرمر کارارا تا طلای ۲۴ عیار، تنها بهترین متریال جهان در محصولات ما جای دارد.",
            },
            {
              title: "هنر دست‌ساز",
              desc: "هر محصول توسط استادکاران با تجربه و با دقت میلی‌متری ساخته می‌شود. هیچ میانبری وجود ندارد.",
            },
            {
              title: "خدمات پس از فروش",
              desc: "گارانتی مادام‌العمر و تیم پشتیبانی اختصاصی، تضمین آرامش خاطر شماست.",
            },
          ].map((value, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl luxury-border bg-ink-2/50 hover:border-gold/40 transition-colors"
            >
              <div className="text-5xl font-bold text-gold/20 mb-4">۰{i + 1}</div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-cream/60 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dealership Section */}
      <section className="py-24 md:py-32 bg-ink-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />

        <div className="relative max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">همکاری تجاری</span>
              <div className="w-12 h-px bg-gold" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              اخذ <span className="shine">نمایندگی</span> فروش
            </h2>
            <p className="text-cream/60 text-lg max-w-2xl mx-auto leading-relaxed">
              به خانواده بزرگ سوناب بپیوندید و یکی از نمایندگان رسمی فروش ما در سراسر ایران باشید.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Store,
                  title: "ویترین اختصاصی",
                  desc: "طراحی شوروم مطابق با استانداردهای برند سوناب با هزینه مشارکتی",
                },
                {
                  icon: ShieldCheck,
                  title: "انحصار منطقه‌ای",
                  desc: "حق فروش انحصاری محصولات در منطقه جغرافیایی مشخص‌شده",
                },
                {
                  icon: Truck,
                  title: "پشتیبانی لجستیک",
                  desc: "ارسال مستقیم محصولات از کارخانه به محل مشتری با بیمه کامل",
                },
                {
                  icon: Headphones,
                  title: "آموزش و پشتیبانی",
                  desc: "دوره‌های آموزشی تخصصی محصولات و تیم پشتیبانی ۲۴ ساعته",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl luxury-border bg-ink/40 backdrop-blur-sm hover:border-gold/40 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h4 className="font-bold text-cream mb-2">{item.title}</h4>
                  <p className="text-xs text-cream/60 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Form */}
            <div className="p-8 md:p-10 rounded-3xl luxury-border bg-ink-2/80 backdrop-blur-sm sticky top-32">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Store className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-cream">درخواست نمایندگی</h3>
                  <p className="text-xs text-cream/50">فرم زیر را تکمیل کنید، کارشناسان ما حداکثر ظرف ۴۸ ساعت تماس می‌گیرند.</p>
                </div>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs text-cream/70 mb-1.5 block">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm transition-colors"
                      placeholder="نام کامل"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-cream/70 mb-1.5 block">شماره تماس *</label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm transition-colors"
                      placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-cream/70 mb-1.5 block">استان و شهر *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm transition-colors"
                    placeholder="مثلاً: تهران، شیراز، اصفهان"
                  />
                </div>

                <div>
                  <label className="text-xs text-cream/70 mb-1.5 block">سابقه فعالیت در صنف مرتبط</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm transition-colors cursor-pointer">
                    <option>بدون سابقه - تازه‌کار هستم</option>
                    <option>۱ تا ۳ سال</option>
                    <option>۳ تا ۵ سال</option>
                    <option>۵ تا ۱۰ سال</option>
                    <option>بیش از ۱۰ سال</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-cream/70 mb-1.5 block">توضیحات (اختیاری)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none text-sm transition-colors resize-none"
                    placeholder="چرا علاقه‌مند به همکاری با سوناب هستید؟ ملک تجاری یا شوروم دارید؟"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-gold w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 group"
                >
                  <span>ارسال درخواست نمایندگی</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </button>

                <p className="text-[11px] text-cream/40 text-center">
                  با ثبت این فرم، تیم توسعه کسب‌وکار سوناب حداکثر ظرف ۴۸ ساعت کاری برای هماهنگی جلسه معارفه با شما تماس می‌گیرد.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
