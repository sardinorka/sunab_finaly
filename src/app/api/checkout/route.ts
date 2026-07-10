import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

interface CheckoutItem {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: string;
  quantity: number;
}

interface CheckoutBody {
  items: CheckoutItem[];
  billing: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    postalCode: string;
  };
  paymentMethod: "cod" | "bank-transfer";
  note?: string;
}

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `SUNAB-${Date.now().toString().slice(-6)}${rand}`;
}

export async function POST(request: Request) {
  try {
    await ensureSchema();
    const body = (await request.json()) as CheckoutBody;

    if (!body.items?.length) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }
    const { billing } = body;
    if (
      !billing?.firstName ||
      !billing?.lastName ||
      !billing?.phone ||
      !billing?.city ||
      !billing?.address ||
      !billing?.postalCode
    ) {
      return NextResponse.json({ error: "اطلاعات ارسال ناقص است" }, { status: 400 });
    }

    const total = body.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
    const paymentTitle =
      body.paymentMethod === "cod" ? "پرداخت در محل" : "کارت به کارت / واریز بانکی";

    const orderNumber = generateOrderNumber();
    const status = "pending";
    const source = "platform";

    await db.insert(orders).values({
      orderNumber,
      customerName: `${billing.firstName} ${billing.lastName}`,
      phone: billing.phone,
      email: billing.email,
      city: billing.city,
      address: billing.address,
      postalCode: billing.postalCode,
      paymentMethod: paymentTitle,
      note: body.note,
      items: body.items.map((i) => ({
        productId: i.id,
        name: i.name,
        slug: i.slug,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
      })),
      total: total.toFixed(2),
      status,
      source,
    });

    // Decrease stock quantity
    for (const item of body.items) {
      if (typeof item.id === "string" && item.id.startsWith("local-")) {
        const localId = Number(item.id.replace("local-", ""));
        if (!isNaN(localId)) {
          try {
            const [existing] = await db
              .select()
              .from(products)
              .where(eq(products.id, localId))
              .limit(1);
            if (existing && existing.stock >= item.quantity) {
              await db
                .update(products)
                .set({ stock: existing.stock - item.quantity })
                .where(eq(products.id, localId));
            }
          } catch (err) {
            console.error("Failed to update product stock:", err);
          }
        }
      }
    }

    return NextResponse.json({ orderNumber, total, source, status });
  } catch (error) {
    console.error("Checkout failed:", error);
    return NextResponse.json({ error: "ثبت سفارش با خطا مواجه شد" }, { status: 500 });
  }
}
