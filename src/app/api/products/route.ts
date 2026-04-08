import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const opticianId = searchParams.get("opticianId");

    const where = opticianId ? { opticianId: parseInt(opticianId) } : {};

    const products = await prisma.product.findMany({
      where,
      include: {
        optician: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Ürünler listelenirken bir hata oluştu." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || !session.user || !["ADMIN", "EDITOR"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Yetkisiz işlem. Sadece yöneticiler ürün ekleyebilir." }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Product creation request body:", body);
    const { name, brand, description, price, imageUrl, visual360, category, opticianId } = body;

    if (!name || !brand || price === undefined || !category || !opticianId) {
      return NextResponse.json({ error: "Eksik bilgi girdiniz. Lütfen tüm zorunlu alanları doldurun." }, { status: 400 });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json({ error: "Geçersiz fiyat formatı." }, { status: 400 });
    }

    const parsedOpticianId = parseInt(opticianId);
    if (isNaN(parsedOpticianId)) {
      return NextResponse.json({ error: "Geçersiz mağaza ID'si." }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        brand,
        description: description || "",
        price: parsedPrice,
        imageUrl: imageUrl || "",
        visual360: visual360 || "",
        category,
        opticianId: parsedOpticianId,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("Product create error:", error);
    return NextResponse.json({ error: `Ürün eklenirken bir hata oluştu: ${error.message}` }, { status: 500 });
  }
}
