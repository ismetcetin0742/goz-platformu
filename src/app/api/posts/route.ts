import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // 1. Oturum kontrolü
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Önce giriş yapmalısınız." }, { status: 401 });
    }

    // 2. Kullanıcıyı bul (ID'sini kesinleştirmek için)
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
    }

    const { title, content, imageUrl } = await req.json();

    // 3. Veritabanına kaydet
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl,
        authorId: dbUser.id, // İlişkiyi burası kuruyor
        status: "PENDING",   // Varsayılan onay bekliyor
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.error("Post Kayıt Hatası:", error);
    return NextResponse.json({ error: "İçerik gönderilemedi." }, { status: 500 });
  }
}