import Link from "next/link";
import { prisma } from "@/lib/prisma";
import OpticianDeleteButton from "@/components/OpticianDeleteButton";

export default async function AdminOpticiansPage() {
  // Veritabanındaki tüm mağazaları oluşturulma tarihine göre yeniden eskiye sıralı çekiyoruz
  const opticians = await prisma.optician.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-[#002f56]">Optik Mağazaları</h1>
          <Link href="/admin/opticians/add" className="bg-[#005da4] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#002f56] transition">
            + Yeni Mağaza Ekle
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700">Mağaza Adı</th>
                <th className="p-4 font-bold text-gray-700">Adres</th>
                <th className="p-4 font-bold text-gray-700 text-center">Güneş G.</th>
                <th className="p-4 font-bold text-gray-700 text-center">Numaralı G.</th>
                <th className="p-4 font-bold text-gray-700 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {opticians.map((optician) => (
                <tr key={optician.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{optician.name}</td>
                  <td className="p-4 text-gray-600">{optician.address}</td>
                  <td className="p-4 text-center">
                    {optician.hasSunGlasses ? <span className="text-green-600 font-bold">Evet</span> : <span className="text-gray-400">Hayır</span>}
                  </td>
                  <td className="p-4 text-center">
                    {optician.hasPrescription ? <span className="text-green-600 font-bold">Evet</span> : <span className="text-gray-400">Hayır</span>}
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-3">
                    {/* Düzenle butonuna tıklandığında [id]/page.tsx sayfasına yönlendirecek */}
                    <Link href={`/admin/opticians/${optician.id}`} className="text-[#005da4] font-bold hover:underline">
                      Düzenle
                    </Link>
                    <OpticianDeleteButton opticianId={optician.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}