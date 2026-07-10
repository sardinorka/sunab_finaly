import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { listProducts } from "@/lib/products";
import { ensureSchema } from "@/lib/setup-db";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";
import AboutSection from "@/components/AboutSection";
import Testimonials from "@/components/Testimonials";
import Marquee from "@/components/Marquee";
import CTASection, { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSchema();

  const [allProducts, allTestimonials] = await Promise.all([
    listProducts(),
    db.select().from(testimonials),
  ]);

  return (
    <main>
      <Navbar />
      <Hero />
      <Marquee />
      <FeaturedProducts products={allProducts} />
      <CategoryShowcase />
      <AboutSection />
      <Testimonials testimonials={allTestimonials} />
      <CTASection />
      <Footer />
    </main>
  );
}
