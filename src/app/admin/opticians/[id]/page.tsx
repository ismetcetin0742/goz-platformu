import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditOpticianForm from "../EditOpticianForm";
import OpticianManagers from "./OpticianManagers";

export default async function EditOpticianPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Parametreyi al
  const { id } = await params;
  
  // 2. Sayıya çevir
  const opticianId = parseInt(id, 10);

  // 3. Geçerli bir sayı değilse 404 sayfasına at, Prisma'ya gönderme
  if (isNaN(opticianId)) {
    notFound(); 
  }

  // 4. Veritabanından mağazayı bul
  const optician = await prisma.optician.findUnique({
    where: { id: opticianId },
    include: {
      managers: {
        include: {
          user: true
        }
      }
    }
  });

  // Eğer veritabanında o ID'ye ait bir mağaza yoksa yine 404 döndür
  if (!optician) {
    notFound();
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen">
      <EditOpticianForm optician={optician} />
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <OpticianManagers opticianId={optician.id} managers={optician.managers} />
      </div>
    </div>
  );
}