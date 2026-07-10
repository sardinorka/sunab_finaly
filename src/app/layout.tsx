import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import SeoHead from "@/components/SeoHead";

export const metadata: Metadata = {
  title: "سوناب | وان، جکوزی و زیردوشی لاکچری",
  description: "برند برتر طراحی و تولید وان، جکوزی و زیردوشی لاکچری در ایران. تجربه‌ای بی‌نظیر از آرامش، سلامتی و شکوه در حمام شما.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-ink text-cream antialiased grain">
        <SeoHead />
        <CartProvider>
          <AnalyticsTracker />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
