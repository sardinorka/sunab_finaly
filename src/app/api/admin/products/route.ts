import { NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const all = await db.select().from(products).orderBy(products.createdAt);
    return NextResponse.json(all);
  } catch (err) {
    console.error("Failed to list products:", err);
    return NextResponse.json({ error: "خطا در دریافت لیست محصولات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json({ error: "نام، قیمت و دسته‌بندی الزامی هستند" }, { status: 400 });
    }

    const slug = body.slug || body.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-\u0600-\u06FF]/g, "") + "-" + Math.floor(Math.random() * 1000);

    const [created] = await db
      .insert(products)
      .values({
        name: body.name,
        slug,
        tagline: body.tagline || "",
        description: body.description || "",
        price: String(body.price),
        comparePrice: body.comparePrice ? String(body.comparePrice) : null,
        image: body.image || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
        gallery: body.gallery || [body.image || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"],
        category: body.category,
        material: body.material || null,
        dimensions: body.dimensions || null,
        capacity: body.capacity || null,
        features: Array.isArray(body.features) ? body.features : body.features?.split("،").map((s: string) => s.trim()).filter(Boolean) || [],
        isFeatured: Boolean(body.isFeatured),
        isNew: Boolean(body.isNew),
        stock: Number(body.stock) || 10,
      })
      .returning();

    return NextResponse.json(created);
  } catch (err) {
    console.error("Failed to create product:", err);
    return NextResponse.json({ error: "خطا در ایجاد محصول جدید" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
    }

    const [updated] = await db
      .update(products)
      .set({
        name: body.name,
        slug: body.slug,
        tagline: body.tagline || "",
        description: body.description || "",
        price: String(body.price),
        comparePrice: body.comparePrice ? String(body.comparePrice) : null,
        image: body.image || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
        gallery: body.gallery || [body.image || "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"],
        category: body.category,
        material: body.material || null,
        dimensions: body.dimensions || null,
        capacity: body.capacity || null,
        features: Array.isArray(body.features) ? body.features : body.features?.split("،").map((s: string) => s.trim()).filter(Boolean) || [],
        isFeatured: Boolean(body.isFeatured),
        isNew: Boolean(body.isNew),
        stock: Number(body.stock) || 0,
      })
      .where(eq(products.id, Number(body.id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update product:", err);
    return NextResponse.json({ error: "خطا در ویرایش محصول" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureSchema();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "شناسه محصول الزامی است" }, { status: 400 });
    }

    await db.delete(products).where(eq(products.id, Number(id)));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete product:", err);
    return NextResponse.json({ error: "خطا در حذف محصول" }, { status: 500 });
  }
}
