import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // upsert: Eğer id: 1 varsa güncelle, yoksa oluştur
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Ayarlar kaydedilemedi" }, { status: 500 });
  }
}

export async function GET() {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json(settings || {});
}