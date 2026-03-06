import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  // Güvenlik: Giriş yapmamış veya Admin olmayan erişemez
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const pendingPosts = await prisma.post.findMany({
      where: { status: "PENDING" },
      include: { author: { select: { name: true, email: true } } }, // Yazar ismini de çekelim
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pendingPosts);
  } catch (error) {
    return NextResponse.json({ error: "Veriler çekilemedi" }, { status: 500 });
  }
}