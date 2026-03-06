import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token eksik" }, { status: 400 });
  }

  try {
    // 1. Token'ı veritabanında ara
    const user = await prisma.user.findUnique({
      where: { verifyToken: token },
    });

    if (!user) {
      // Eğer token yoksa veya geçersizse giriş sayfasına hata mesajıyla gönder
      return NextResponse.redirect(new URL("/login?error=invalid_token", req.url));
    }

    // 2. Kullanıcıyı onayla
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null, // Güvenlik için token'ı sıfırla
      },
    });

    // 3. İŞLEM TAMAM! Kullanıcıyı giriş sayfasına "verified=true" parametresiyle at
    return NextResponse.redirect(new URL("/login?verified=true", req.url));

  } catch (error) {
    console.error("Doğrulama hatası:", error);
    return NextResponse.redirect(new URL("/login?error=server_error", req.url));
  }
}