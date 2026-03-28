import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  // Güvenlik: Sadece ADMIN girebilir
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        // Kaç postu var onu da görelim (Şemanda Post[] ilişkisi vardı)
        _count: {
          select: { posts: true }
        }
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Kullanıcılar yüklenemedi" }, { status: 500 });
  }
}