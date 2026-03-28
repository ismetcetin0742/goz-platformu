"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserActionButtons({ userId, isBanned }: { userId: string | number, isBanned: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");

  // Kullanıcının yasağını kaldırma fonksiyonu
  const handleUnban = async () => {
    if (!confirm(`Bu kullanıcının yasağını kaldırmak istediğinize emin misiniz?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: false }), // Direkt yasağı kaldır
      });
      if (res.ok) router.refresh();
      else alert(`Hata: ${(await res.json()).error}`);
    } finally {
      setLoading(false);
    }
  };

  // Yasaklama modal'ındaki onayla butonu fonksiyonu
  const handleConfirmBan = async () => {
    if (banReason.trim().length < 5) {
      alert("Lütfen en az 5 karakterlik bir yasaklama nedeni girin.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: true, banReason: banReason }),
      });
      if (res.ok) {
        setShowBanModal(false);
        router.refresh();
      } else {
        alert(`Hata: ${(await res.json()).error}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcıyı silme fonksiyonu
  const deleteUser = async () => {
    if (!confirm("Kullanıcıyı KALICI olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert(`Hata: ${(await res.json()).error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        {isBanned ? (
          <button onClick={handleUnban} disabled={loading} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200">
            Ban Kaldır
          </button>
        ) : (
          <button onClick={() => setShowBanModal(true)} disabled={loading} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm active:scale-95 disabled:opacity-50 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200">
            Yasakla
          </button>
        )}
        <button onClick={deleteUser} disabled={loading} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 border border-red-200 transition-all shadow-sm active:scale-95 disabled:opacity-50">
          Sil
        </button>
      </div>

      {/* Yasaklama Nedeni Modalı */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in-95">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kullanıcıyı Yasakla</h3>
            <p className="text-gray-500 mb-6">Lütfen kullanıcıyı neden yasakladığınıza dair bir neden belirtin.</p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Örn: Sürekli spam içerik paylaşıyor."
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:border-blue-600 outline-none transition mb-6"
              rows={4}
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setShowBanModal(false)} className="px-6 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">
                İptal
              </button>
              <button onClick={handleConfirmBan} disabled={loading} className="px-6 py-2.5 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:bg-red-400">
                {loading ? "Yasaklanıyor..." : "Yasakla ve Onayla"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}