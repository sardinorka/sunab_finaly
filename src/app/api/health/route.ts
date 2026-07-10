import { db } from "@/db";
import { sql } from "drizzle-orm";
import { ensureSchema } from "@/lib/setup-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    // Best-effort schema bootstrap so cold DBs heal themselves
    try {
      await ensureSchema();
    } catch (err) {
      console.error("health ensureSchema failed", err);
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
