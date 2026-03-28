// Silme Butonu Bileşeni
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OpticianDeleteButton({ opticianId }: { opticianId: number }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Bu mağazayı silmek istediğinizden emin misiniz?')) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/opticians/${opticianId}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          router.refresh(); // Sayfayı yenile
        } else {
          alert('Silme işlemi başarısız oldu.');
        }
      } catch (error) {
        alert('Bir hata oluştu.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-50 text-red-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-red-100 disabled:opacity-50"
    >
      {isDeleting ? 'Siliniyor...' : 'Sil'}
    </button>
  );
}