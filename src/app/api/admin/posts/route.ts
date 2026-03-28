import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  // Güvenlik Kontrolü
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    // Veritabanındaki TÜM postları yazar bilgisiyle çekiyoruz
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}