import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Phone } from "lucide-react";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; total?: string }>;
}) {
  const { order, total } = await searchParams;

  return (
    <main className="min-h-screen bg-ink">
      <Navbar />

      <section className="pt-40 pb-24 px-6 text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12 text-gold" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          سفارش شما با موفقیت <span className="shine">ثبت شد</span>
        </h1>
        <p className="text-cream/70 mb-10 leading-relaxed">
          از خرید شما سپاسگزاریم. کارشناسان ما به‌زودی برای هماهنگی ارسال و پرداخت با شما تماس خواهند گرفت.
        </p>

        {order && (
          <div className="p-6 rounded-2xl luxury-border bg-ink-2/50 mb-10 flex flex-col sm:flex-row justify-around gap-6">
            <div>
              <div className="text-xs text-cream/50 mb-1">شماره سفارش</div>
              <div className="text-xl font-bold text-gold" dir="ltr">
                {order}
              </div>
            </div>
            {total && (
              <div>
                <div className="text-xs text-cream/50 mb-1">مبلغ سفارش</div>
                <div className="text-xl font-bold text-gold">
                  {new Intl.NumberFormat("fa-IR").format(Number(total))} تومان
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="btn-gold px-8 py-4 rounded-full inline-flex items-center justify-center gap-2 group"
          >
            <span className="font-bold">ادامه خرید</span>
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          </Link>
          <a
            href="tel:+982100000000"
            className="btn-outline px-8 py-4 rounded-full inline-flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>تماس با پشتیبانی</span>
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
