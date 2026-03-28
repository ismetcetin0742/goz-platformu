import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Burayı Promise yaptık
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Yetkisiz Erişim", { status: 401 });
  }

  try {
    // 2. Next.js 15 kuralı: params'ı kullanmadan önce await ile bekliyoruz
    const resolvedParams = await params; 
    const userId = Number(resolvedParams.id);

    if (isNaN(userId)) {
      console.log("HATA: ID sayıya çevrilemedi ->", resolvedParams.id);
      return NextResponse.json({ error: "Geçersiz Kullanıcı ID" }, { status: 400 });
    }

    const { role } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: role },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ROL_GUNCELLEME_HATASI:", error);
    return NextResponse.json(
      { error: "Veritabanı güncellenemedi." }, 
      { status: 500 }
    );
  }
}