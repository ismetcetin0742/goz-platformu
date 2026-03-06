import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  // Hata ayıklama için terminale yazdırıyoruz
  console.log("OTURUM KONTROLÜ:", session?.user);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ 
      error: "Yetkisiz erişim", 
      debug: `Mevcut Rol: ${session?.user?.role || "Giriş yapılmamış"}` 
    }, { status: 401 });
  }

  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings || {});
}

export async function POST(req: Request) {
  const session = await auth();
  
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // upsert: Kayıt varsa güncelle, yoksa 1 id'siyle yeni oluştur
    const updatedSettings = await prisma.settings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: "Ayarlar kaydedilirken hata oluştu" }, { status: 500 });
  }
}