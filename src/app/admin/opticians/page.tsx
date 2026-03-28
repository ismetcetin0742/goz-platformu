import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OpticiansMapWrapper from "./OpticiansMapWrapper";
import OpticianDeleteButton from "@/components/OpticianDeleteButton";


async function getOpticians() {
  const opticians = await prisma.optician.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return opticians;
}

export default async function AdminOpticiansPage() {
  const session = await auth();
  // Sadece ADMIN ve EDITOR rollerinin bu sayfayı görmesine izin ver
  if (!["ADMIN", "EDITOR"].includes((session?.user as any)?.role as string)) {
    redirect("/admin");
  }

  const opticians = await getOpticians();

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Harita Bileşeni */}
        <div className="mb-12">
          <OpticiansMapWrapper opticians={opticians} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-[#002f56]">Gözlükçü Mağazaları</h1>
            <p className="text-gray-500 font-medium mt-2">Sisteme kayıtlı tüm gözlükçü mağazaları.</p>
          </div>
          <Link href="/admin/opticians/add" className="bg-[#005da4] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#002f56] transition-all shadow-md whitespace-nowrap">
            + Yeni Mağaza Ekle
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-xs text-[#002f56] uppercase border-b border-gray-200 font-bold bg-white">
                <tr>
                  <th className="p-5">Mağaza Adı</th>
                  <th className="p-5">Adres</th>
                  <th className="p-5">Telefon</th>
                  <th className="p-5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {opticians.map((optician) => (
                  <tr key={optician.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-gray-800">{optician.name}</td>
                    <td className="p-5 text-gray-600 text-sm max-w-md truncate" title={optician.address}>{optician.address}</td>
                    <td className="p-5 text-gray-600 text-sm">{optician.phone || "-"}</td>
                    <td className="p-5 text-right">
                      <OpticianDeleteButton opticianId={optician.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}