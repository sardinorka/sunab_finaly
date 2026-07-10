import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <section className="pt-32 pb-24 px-6 md:px-12 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-gold" />
              <span className="text-xs text-gold tracking-[0.3em] uppercase">تماس با ما</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 text-balance">
              با ما در<br />
              <span className="shine">ارتباط باشید</span>
            </h1>
            <p className="text-lg text-cream/70 leading-relaxed mb-12">
              تیم متخصص ما آماده است تا با شما در انتخاب بهترین محصول برای فضای شما همراه شود. مشاوره کاملاً رایگان و محرمانه است.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-sm text-cream/50 mb-1">تلفن تماس</div>
                  <div className="text-lg font-bold" dir="ltr">۰۲۱-۰۰۰۰۰۰۰۰</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-sm text-cream/50 mb-1">ایمیل</div>
                  <div className="text-lg font-bold">info@sunab.ir</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-sm text-cream/50 mb-1">شوروم</div>
                  <div className="text-lg font-bold">تهران، الهیه، خیابان فرشته، پلاک ۱۲</div>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-sm text-cream/50 mb-1">ساعات کاری</div>
                  <div className="text-lg font-bold">شنبه تا پنجشنبه، ۹ صبح تا ۸ شب</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 md:p-12 rounded-3xl luxury-border bg-ink-2/50 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-2">فرم مشاوره رایگان</h2>
            <p className="text-cream/60 mb-8">اطلاعات خود را وارد کنید، در اسرع وقت با شما تماس می‌گیریم.</p>

            <form className="space-y-6">
              <div>
                <label className="text-sm text-cream/70 mb-2 block">نام و نام خانوادگی</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  placeholder="نام شما"
                />
              </div>

              <div>
                <label className="text-sm text-cream/70 mb-2 block">شماره تماس</label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors"
                  placeholder="۰۹۱۲۰۰۰۰۰۰۰"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="text-sm text-cream/70 mb-2 block">نوع پروژه</label>
                <select className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors">
                  <option>ویلای شخصی</option>
                  <option>آپارتمان لوکس</option>
                  <option>هتل یا رزورت</option>
                  <option>سایر</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-cream/70 mb-2 block">توضیحات (اختیاری)</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-ink border border-white/10 focus:border-gold outline-none transition-colors resize-none"
                  placeholder="درباره پروژه خود بنویسید..."
                />
              </div>

              <button type="submit" className="btn-gold w-full px-8 py-4 rounded-full font-bold">
                ارسال درخواست مشاوره
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
