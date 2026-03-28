import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    // Güvenlik 1: Sadece ADMIN rolüne sahip kullanıcılar işlem yapabilir
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim. Sadece yöneticiler bu işlemi yapabilir." }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    
    // Güncellenecek verileri hazırlayalım
    const updateData: any = {};

    if (body.role !== undefined) {
      if (!['ADMIN', 'EDITOR', 'USER'].includes(body.role)) return NextResponse.json({ error: "Geçersiz rol tipi." }, { status: 400 });
      if (session.user.id === id && body.role === "USER") return NextResponse.json({ error: "Kendi yetkinizi düşüremezsiniz." }, { status: 400 });
      updateData.role = body.role;
    }

    if (body.isBanned !== undefined) {
      if (session.user.id === id) return NextResponse.json({ error: "Kendinizi yasaklayamazsınız." }, { status: 400 });
      updateData.isBanned = body.isBanned;
      // Yasaklama işlemi yapılıyorsa nedeni kaydet, yasak kaldırılıyorsa nedeni temizle.
      updateData.banReason = body.isBanned ? (body.banReason || null) : null;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Güncellenecek veri bulunamadı." }, { status: 400 });
    }

    // Veritabanını Güncelle
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error("Kullanıcı Rolü Güncelleme Hatası:", error);
    return NextResponse.json({ error: "Veritabanı güncellenirken bir sunucu hatası oluştu." }, { status: 500 });
  }
}

// Kullanıcıyı Tamamen Silme
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;

    // Kendini silmeyi engelle
    if (session.user.id === id) {
      return NextResponse.json({ error: "Kendi hesabınızı silemezsiniz." }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Kullanıcı başarıyla silindi." }, { status: 200 });
  } catch (error: any) {
    console.error("Kullanıcı Silme Hatası:", error);
    return NextResponse.json({ error: "Kullanıcı silinirken bir sunucu hatası oluştu." }, { status: 500 });
  }
}