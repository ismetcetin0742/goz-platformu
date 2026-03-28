import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, imageUrl } = await req.json();

  if (!session.user?.id) {
    return NextResponse.json({ error: "Kullanıcı ID bulunamadı" }, { status: 400 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { name, image: imageUrl },
  });

  return NextResponse.json(updatedUser);
}