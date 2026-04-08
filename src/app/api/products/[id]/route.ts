import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                optician: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!product) {
            return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ error: "Ürün detayları alınırken bir hata oluştu." }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { name, brand, description, price, imageUrl, visual360, category, opticianId } = body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                brand,
                description,
                price: parseFloat(price),
                imageUrl,
                visual360,
                category,
                opticianId: parseInt(opticianId),
            },
        });

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Product update error:", error);
        return NextResponse.json({ error: "Ürün güncellenirken bir hata oluştu." }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await auth();

    if (!session || !session.user) {
        return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 });
    }

    try {
        const { id } = await params;
        await prisma.product.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: "Ürün başarıyla silindi." });
    } catch (error) {
        console.error("Product delete error:", error);
        return NextResponse.json({ error: "Ürün silinirken bir hata oluştu." }, { status: 500 });
    }
}
