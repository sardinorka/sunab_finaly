import { NextResponse } from "next/server";
import { setupDatabase, getDbStatus } from "@/lib/setup-db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function checkPassword(request: Request, bodyPassword?: string) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          error:
            "ADMIN_PASSWORD در متغیرهای محیطی تنظیم نشده است. ابتدا در Netlify آن را تنظیم کنید.",
        },
        { status: 503 }
      ),
    };
  }

  const headerPassword = request.headers.get("x-admin-password") || "";
  const password = bodyPassword || headerPassword;

  if (password !== adminPassword) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "رمز عبور نادرست است." },
        { status: 401 }
      ),
    };
  }

  return { ok: true as const };
}

/** GET: check which tables exist (password required). */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password") || undefined;
    const auth = checkPassword(request, password);
    if (!auth.ok) return auth.response;

    try {
      const status = await getDbStatus();
      return NextResponse.json(status);
    } catch (err) {
      console.error("setup-db status failed", err);
      return NextResponse.json(
        {
          connected: false,
          error:
            err instanceof Error
              ? err.message
              : "اتصال به دیتابیس برقرار نشد. DATABASE_URL را بررسی کنید.",
        },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("setup-db GET failed", err);
    return NextResponse.json({ error: "خطای داخلی" }, { status: 500 });
  }
}

/** POST: create all tables + seed sample data (password required). */
export async function POST(request: Request) {
  try {
    let bodyPassword: string | undefined;
    try {
      const body = await request.json();
      bodyPassword = body?.password;
    } catch {
      bodyPassword = undefined;
    }

    const auth = checkPassword(request, bodyPassword);
    if (!auth.ok) return auth.response;

    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          error:
            "DATABASE_URL تنظیم نشده است. در Netlify → Environment variables مقدار Neon را اضافه کنید.",
        },
        { status: 503 }
      );
    }

    const result = await setupDatabase();

    return NextResponse.json({
      success: true,
      message: "راه‌اندازی دیتابیس با موفقیت انجام شد.",
      ...result,
    });
  } catch (err) {
    console.error("setup-db failed", err);
    const message =
      err instanceof Error ? err.message : "خطا در راه‌اندازی دیتابیس";
    return NextResponse.json(
      {
        success: false,
        error: message,
        hint: "مطمئن شوید DATABASE_URL نئون درست است و IPها unrestricted هستند.",
      },
      { status: 500 }
    );
  }
}
