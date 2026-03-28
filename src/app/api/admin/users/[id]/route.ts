import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();

    // Güvenlik: Sadece ADMIN ve EDITOR yetkisine sahip olanlar silebilir.
    if (!session || !["ADMIN", "EDITOR"].includes((session.user as any)?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
    }

    const { id } = await params;
    await prisma.optician.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Gözlükçü başarıyla silindi." }, { status: 200 });
  } catch (error: any) {
    console.error("Gözlükçü Silme Hatası:", error);
    return NextResponse.json({ error: "Gözlükçü silinirken bir sunucu hatası oluştu." }, { status: 500 });
  }
}