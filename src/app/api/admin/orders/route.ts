import { NextResponse } from "next/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchema();
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json(allOrders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return NextResponse.json({ error: "خطا در دریافت لیست سفارش‌ها" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await ensureSchema();
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "شناسه سفارش و وضعیت الزامی است" }, { status: 400 });
    }

    const [updated] = await db
      .update(orders)
      .set({ status: body.status })
      .where(eq(orders.id, Number(body.id)))
      .returning();

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Failed to update order status:", err);
    return NextResponse.json({ error: "خطا در به‌روزرسانی وضعیت سفارش" }, { status: 500 });
  }
}
