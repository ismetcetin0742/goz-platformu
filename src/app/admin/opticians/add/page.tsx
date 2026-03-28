"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddOpticianPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // BURASI ÇOK ÖNEMLİ: İstek tam olarak bu API rotasına gitmeli!
      const res = await fetch("/api/opticians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
        }),
      });

      if (res.ok) {
        alert("Mağaza başarıyla eklendi!");
        router.push("/admin/opticians");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert("Sunucuya ulaşılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-16 px-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-[#002f56]">Yeni Mağaza Ekle</h1>
          <p className="text-gray-500 mt-2">Sisteme yeni bir gözlükçü mağazası kaydedin.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mağaza Adı</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" placeholder="Örn: Gözde Optik" />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Adres</label>
            <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" placeholder="Örn: Kızılay Mah. Atatürk Bulvarı No:1" />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
            <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" placeholder="Örn: 0312 123 45 67" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Enlem (Latitude)</label>
              <input type="number" step="any" required value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" placeholder="Örn: 39.92077" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Boylam (Longitude)</label>
              <input type="number" step="any" required value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500" placeholder="Örn: 32.85411" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="flex-1 bg-[#005da4] text-white p-4 rounded-xl font-bold hover:bg-[#002f56] transition-all disabled:opacity-50">
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <Link href="/admin/opticians" className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-center">İptal</Link>
          </div>
        </form>
      </div>
    </div>
  );
}