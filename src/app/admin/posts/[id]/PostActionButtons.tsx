"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PostActionButtons({ postId, currentStatus }: { postId: number, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    const actionName = status === 'APPROVED' ? 'onaylamak' : 'reddetmek';
    if (!confirm(`Bu içeriği ${actionName} istediğinize emin misiniz?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        alert(`İçerik başarıyla ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}.`);
        router.refresh(); // Sayfadaki verileri (Durum yazısını) günceller
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert('Sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Bu içeriği kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: 'DELETE' });
      if (res.ok) {
        alert('İçerik başarıyla silindi.');
        router.push('/admin/posts'); // Silindikten sonra listeye geri dön
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert('Sunucu hatası oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mt-10 pt-8 border-t border-gray-100">
      {currentStatus !== 'APPROVED' && (
        <button onClick={() => updateStatus('APPROVED')} disabled={loading} className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200 active:scale-95 disabled:opacity-50">
          ✅ İçeriği Onayla
        </button>
      )}
      
      {currentStatus !== 'REJECTED' && (
        <button onClick={() => updateStatus('REJECTED')} disabled={loading} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95 disabled:opacity-50">
          ❌ İçeriği Reddet
        </button>
      )}

      <div className="flex-grow"></div>

      <button onClick={deletePost} disabled={loading} className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-100 transition-all border border-red-100 active:scale-95 disabled:opacity-50">
        🗑️ Kalıcı Olarak Sil
      </button>
    </div>
  );
}