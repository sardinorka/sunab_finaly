import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "سیستم ورود پیکربندی نشده است. لطفاً با پشتیبانی تماس بگیرید." },
        { status: 503 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      const cookieStore = await cookies();
      cookieStore.set("luxbath_admin", "authenticated", {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "رمز عبور نادرست است" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "خطا در ورود" }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("luxbath_admin");
  return NextResponse.json({ success: true });
}
