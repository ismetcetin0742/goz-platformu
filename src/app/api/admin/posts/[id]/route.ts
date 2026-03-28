import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// İçerik Durumunu Güncelleme (Onaylama / Reddetme)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    // Güvenlik: ADMIN ve EDITOR rolüne sahip kullanıcılar işlem yapabilir
    if (!session || !["ADMIN", "EDITOR"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim. Bu işlemi sadece yetkililer yapabilir." }, { status: 401 });
    }

    const { id } = await params; // Next.js 16 standartlarına göre params await edilmeli
    const body = await req.json();
    const { status } = body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: "Geçersiz içerik durumu." }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error("İçerik Güncelleme Hatası:", error);
    return NextResponse.json({ error: "İçerik güncellenirken bir sunucu hatası oluştu." }, { status: 500 });
  }
}

// İçeriği Tamamen Silme
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || !["ADMIN", "EDITOR"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    await prisma.post.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "İçerik başarıyla silindi." }, { status: 200 });
  } catch (error: any) {
    console.error("İçerik Silme Hatası:", error);
    return NextResponse.json({ error: "İçerik silinirken bir sunucu hatası oluştu." }, { status: 500 });
  }
}