"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Optician } from "@prisma/client";

export default function EditOpticianForm({ optician }: { optician: Optician }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: optician.name,
    address: optician.address,
    phone: optician.phone || "",
    latitude: optician.latitude.toString(),
    longitude: optician.longitude.toString(),
    hasSunGlasses: optician.hasSunGlasses,
    hasPrescription: optician.hasPrescription,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const lat = parseFloat(formData.latitude.toString().replace(',', '.'));
    const lng = parseFloat(formData.longitude.toString().replace(',', '.'));

    if (isNaN(lat) || isNaN(lng)) {
      alert("Lütfen geçerli bir enlem ve boylam (koordinat) değeri girin.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/opticians/${optician.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          phone: formData.phone,
          latitude: lat,
          longitude: lng,
          hasSunGlasses: formData.hasSunGlasses,
          hasPrescription: formData.hasPrescription,
        }),
      });

      if (res.ok) {
        alert("Mağaza başarıyla güncellendi!");
        router.push("/admin/opticians");
        router.refresh();
      } else {
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          alert(`Hata: ${data.error}`);
        } catch (err) {
          alert(`HTTP Hatası (${res.status}): Sunucu geçersiz bir yanıt döndürdü.`);
          console.error("API Yanıtı:", text);
        }
      }
    } catch (error) {
      console.error("İstek Hatası:", error);
      alert("Bağlantı hatası: Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#002f56]">Mağazayı Düzenle</h1>
            <p className="text-gray-500 font-medium mt-2">{optician.name} bilgilerini güncelliyorsunuz.</p>
          </div>
          <Link href="/admin/opticians" className="text-sm font-bold text-gray-500 hover:text-[#005da4] transition-colors">
            ← Mağazalara Dön
          </Link>
        </div>

        <div className="max-w-3xl bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mağaza Adı</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Adres</label>
              <input type="text" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Telefon</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Enlem (Latitude)</label>
                <input type="text" required value={formData.latitude} onChange={(e) => setFormData({...formData, latitude: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Boylam (Longitude)</label>
                <input type="text" required value={formData.longitude} onChange={(e) => setFormData({...formData, longitude: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-black font-bold outline-none focus:bg-white focus:border-blue-500 transition-all" />
              </div>
            </div>

            {/* Yetki (Kategori) Seçimi */}
            <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
              <h3 className="text-sm font-bold text-gray-700 mb-4">Mağaza Yetkileri (Sanal Deneme Kategorileri)</h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.hasSunGlasses} 
                    onChange={(e) => setFormData({...formData, hasSunGlasses: e.target.checked})}
                    className="w-5 h-5 text-[#005da4] rounded focus:ring-blue-500"
                  />
                  <span className="font-bold text-gray-700">Güneş Gözlükleri</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.hasPrescription} 
                    onChange={(e) => setFormData({...formData, hasPrescription: e.target.checked})}
                    className="w-5 h-5 text-[#005da4] rounded focus:ring-blue-500"
                  />
                  <span className="font-bold text-gray-700">Numaralı Gözlükler</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="flex-1 bg-[#005da4] text-white p-4 rounded-xl font-bold hover:bg-[#002f56] transition-all disabled:opacity-50">
                {loading ? "Güncelleniyor..." : "Güncelle"}
              </button>
              <Link href="/admin/opticians" className="px-8 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all text-center">İptal</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}