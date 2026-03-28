import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // 1. Yetki Kontrolü: Sadece Admin ve Editörler mağaza ekleyebilir
    const session = await auth();
    if (!session || !["ADMIN", "EDITOR"].includes(session.user?.role as string)) {
      return NextResponse.json({ error: "Yetkisiz erişim. Sadece yetkililer mağaza ekleyebilir." }, { status: 401 });
    }

    // 2. Gelen Verileri Al
    const body = await req.json();
    const { name, address, phone, latitude, longitude, hasSunGlasses, hasPrescription } = body;

    if (!name || !address || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Gerekli alanlar eksik." }, { status: 400 });
    }

    // 3. Veritabanına Kaydet
    const optician = await prisma.optician.create({
      data: {
        name,
        address,
        phone,
        latitude,
        longitude,
        hasSunGlasses: hasSunGlasses || false,
        hasPrescription: hasPrescription || false,
      },
    });

    return NextResponse.json(optician, { status: 201 });
  } catch (error) {
    console.error("Mağaza Ekleme Hatası:", error);
    return NextResponse.json({ error: "Mağaza eklenirken sunucu hatası oluştu." }, { status: 500 });
  }
}