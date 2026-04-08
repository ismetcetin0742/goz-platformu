import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import AddProductModal from "../AddProductModal";
import ProductActionButtons from "./ProductActionButtons";

export default async function AdminProductsPage() {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
        redirect("/");
    }

    const [products, opticians] = await Promise.all([
        prisma.product.findMany({
            include: {
                optician: {
                    select: { name: true }
                }
            },
            orderBy: { createdAt: "desc" }
        }),
        prisma.optician.findMany({
            select: { id: true, name: true }
        })
    ]);

    return (
        <div className="min-h-screen bg-[#f8f9fa] py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-[#002f56] tracking-tight">Ürün Yönetimi</h1>
                        <p className="text-gray-500 font-medium">Sistemdeki tüm ürünleri ve mağaza stoklarını yönetin.</p>
                    </div>
                    <AddProductModal opticians={opticians} />
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-5 text-sm font-black text-[#002f56] uppercase tracking-wider">Ürün</th>
                                    <th className="px-6 py-5 text-sm font-black text-[#002f56] uppercase tracking-wider">Marka/Kategori</th>
                                    <th className="px-6 py-5 text-sm font-black text-[#002f56] uppercase tracking-wider">Mağaza</th>
                                    <th className="px-6 py-5 text-sm font-black text-[#002f56] uppercase tracking-wider text-right">Fiyat</th>
                                    <th className="px-6 py-5 text-sm font-black text-[#002f56] uppercase tracking-wider text-right">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                                                    {product.imageUrl ? (
                                                        <Image 
                                                            src={product.imageUrl} 
                                                            alt={product.name} 
                                                            fill 
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">🖼️</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#002f56] text-lg">{product.name}</div>
                                                    {product.visual360 && (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                            360° Aktif
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-gray-700 font-bold">{product.brand}</div>
                                            <div className="text-gray-400 text-xs font-medium">
                                                {product.category === "SUNGLASSES" ? "Güneş Gözlüğü" : "Numaralı Gözlük"}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-gray-600 font-medium">
                                            {product.optician.name}
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-[#005da4] text-lg">
                                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(Number(product.price))}
                                        </td>
                                        <td className="px-6 py-5">
                                            <ProductActionButtons product={{...product, price: product.price.toString()}} />
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center text-gray-400 font-medium">
                                            Henüz hiç ürün eklenmemiş.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
