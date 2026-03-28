"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpticianDeleteButton({ opticianId }: { opticianId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Bu mağazayı tamamen silmek istediğinizden emin misiniz?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/opticians/${opticianId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // Başarılıysa tabloyu yenile
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert("Bir hata oluştu. Sunucuya ulaşılamıyor.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-100 disabled:opacity-50 transition-colors shadow-sm"
    >
      {isDeleting ? "Siliniyor..." : "Sil"}
    </button>
  );
}