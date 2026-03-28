import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import GozluklerClientPage, { StoreWithCategories } from './GozluklerClientPage';

export default async function GozluklerPage() {
  // 1. Veritabanından tüm optik mağazalarını çekiyoruz.
  const opticians = await prisma.optician.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // 2. Veritabanından gelen veriyi, istemci bileşeninin beklediği yapıya dönüştürüyoruz.
  //    Boolean (hasSunGlasses) alanlarını, string dizisine (allowedCategories) çeviriyoruz.
  const stores: StoreWithCategories[] = opticians.map(optician => {
    const allowedCategories: ('gunes' | 'numarali')[] = [];
    if (optician.hasSunGlasses) {
      allowedCategories.push('gunes');
    }
    if (optician.hasPrescription) {
      allowedCategories.push('numarali');
    }
    return {
      ...optician,
      allowedCategories,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      {/* SAYFA BAŞLIĞI (HEADER) */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-tighter text-[#005da4] transition-colors group-hover:text-black">GÖZ</span>
            <span className="text-2xl font-light tracking-tighter text-[#00a3e0]">PLATFORMU</span>
          </Link>
          <Link href="/" className="bg-blue-50 text-[#005da4] px-6 py-2 rounded-full font-black text-sm hover:bg-[#005da4] hover:text-white transition-all border border-blue-100">
            ← ANA SAYFAYA DÖN
          </Link>
        </div>
      </header>

      {/* 3. Etkileşimli tüm mantığı içeren istemci bileşenini gerçek verilerle render ediyoruz. */}
      <GozluklerClientPage stores={stores} />
    </div>
  );
}