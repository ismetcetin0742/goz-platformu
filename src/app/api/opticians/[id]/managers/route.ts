import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// MAĞAZAYA YENİ BİR YÖNETİCİ EKLE (POST)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "EDITOR"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    const opticianId = parseInt(id, 10);
    const { email } = await req.json();

    if (isNaN(opticianId) || !email) {
      return NextResponse.json({ error: "Geçersiz veriler." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı." }, { status: 404 });
    }

    const existing = await prisma.opticianManager.findUnique({
      where: {
        userId_opticianId: { userId: user.id, opticianId }
      }
    });

    if (existing) {
      return NextResponse.json({ error: "Bu kullanıcı zaten bu mağazanın yöneticisi." }, { status: 400 });
    }

    await prisma.opticianManager.create({
      data: { userId: user.id, opticianId }
    });

    return NextResponse.json({ message: "Yönetici başarıyla eklendi." }, { status: 200 });
  } catch (error) {
    console.error("Yönetici Ekleme Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}

// MAĞAZADAN BİR YÖNETİCİYİ KALDIR (DELETE)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || !["ADMIN", "EDITOR"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    const opticianId = parseInt(id, 10);
    const { email } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    await prisma.opticianManager.delete({
      where: {
        userId_opticianId: { userId: user.id, opticianId }
      }
    });

    return NextResponse.json({ message: "Yönetici başarıyla kaldırıldı." }, { status: 200 });
  } catch (error) {
    console.error("Yönetici Silme Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası oluştu." }, { status: 500 });
  }
}