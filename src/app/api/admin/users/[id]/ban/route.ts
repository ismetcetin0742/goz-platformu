import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Next.js 15 kuralı!
) {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    return new NextResponse("Yetkisiz Erişim", { status: 401 });
  }

  try {
    const resolvedParams = await params;
    const userId = Number(resolvedParams.id);
    const { isBanned } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isBanned: isBanned }, // True ise banla, False ise banı aç
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("BAN_HATASI:", error);
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}