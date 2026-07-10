import "server-only";
import { db } from "@/db";
import { products as localProducts } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { StoreProduct, StoreCategory } from "@/lib/types";
import { ensureSchema } from "@/lib/setup-db";

function mapLocalProduct(p: typeof localProducts.$inferSelect): StoreProduct {
  return {
    id: `local-${p.id}`,
    source: "local",
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    price: p.price,
    regularPrice: p.comparePrice ?? undefined,
    onSale: Boolean(p.comparePrice),
    image: p.image,
    gallery: p.gallery,
    category: p.category,
    material: p.material ?? undefined,
    dimensions: p.dimensions ?? undefined,
    capacity: p.capacity ?? undefined,
    features: p.features,
    isFeatured: p.isFeatured,
    isNew: p.isNew,
    inStock: p.stock > 0,
    stockQuantity: p.stock,
  };
}

export async function listProducts(filters?: {
  category?: string;
  search?: string;
  sort?: string;
  inStock?: boolean;
  priceMin?: number;
  priceMax?: number;
}): Promise<StoreProduct[]> {
  await ensureSchema();
  const rows = await db.select().from(localProducts).orderBy(localProducts.createdAt);
  let mapped = rows.map(mapLocalProduct);

  if (filters?.category) {
    mapped = mapped.filter((p) => p.category === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    mapped = mapped.filter(
      (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q)
    );
  }

  // Filter: only in-stock products
  if (filters?.inStock) {
    mapped = mapped.filter((p) => p.inStock);
  }

  // Filter: price range (convert million toman from UI to actual price)
  if (filters?.priceMin) {
    const minActual = filters.priceMin * 1000000;
    mapped = mapped.filter((p) => Number(p.price) >= minActual);
  }
  if (filters?.priceMax) {
    const maxActual = filters.priceMax * 1000000;
    mapped = mapped.filter((p) => Number(p.price) <= maxActual);
  }

  // Sort
  if (filters?.sort) {
    switch (filters.sort) {
      case "price-asc":
        mapped.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        mapped.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "newest":
        mapped.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }
  }

  return mapped;
}

export async function listFeaturedProducts(): Promise<StoreProduct[]> {
  const all = await listProducts();
  const featured = all.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured : all.slice(0, 3);
}

export async function getProductBySlug(slug: string): Promise<StoreProduct | null> {
  await ensureSchema();
  const [row] = await db.select().from(localProducts).where(eq(localProducts.slug, slug)).limit(1);
  return row ? mapLocalProduct(row) : null;
}

export async function listCategories(): Promise<StoreCategory[]> {
  const rows = await db.select().from(localProducts);
  const set = new Map<string, number>();
  for (const r of rows) {
    set.set(r.category, (set.get(r.category) ?? 0) + 1);
  }
  return Array.from(set.entries()).map(([name, count]) => ({
    id: `local-${name}`,
    name,
    slug: name,
    count,
  }));
}
