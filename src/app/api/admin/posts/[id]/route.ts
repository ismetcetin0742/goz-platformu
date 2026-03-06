import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Params artık bir Promise
) {
  try {
    const session = await auth();

    // 1. Güvenlik Kontrolü
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    // 2. Parametreleri Bekle (Kritik Nokta)
    const { id } = await params; 
    const { status } = await req.json(); // APPROVED veya REJECTED

    // 3. Veritabanı Güncelleme
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { status },
    });

    return NextResponse.json(updatedPost, { status: 200 });
  } catch (error: any) {
    console.error("Onay API Hatası:", error);
    return NextResponse.json(
      { error: "İçerik güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}