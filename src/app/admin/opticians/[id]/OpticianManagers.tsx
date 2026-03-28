"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OpticianManagers({ opticianId, managers }: { opticianId: number, managers: any[] }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/opticians/${opticianId}/managers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmail("");
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (emailToRemove: string) => {
    if (!confirm("Bu yöneticiyi mağazadan çıkarmak istediğinize emin misiniz?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/opticians/${opticianId}/managers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToRemove }),
      });

      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert("Sunucu hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-gray-100 mt-8">
      <h2 className="text-2xl font-black text-[#002f56] mb-2">Mağaza Yöneticileri</h2>
      <p className="text-gray-500 text-sm mb-6">Bu mağazaya ait ürünleri yönetebilecek yetkili kullanıcıların e-posta adreslerini buradan ekleyebilirsiniz.</p>
      
      <ul className="mb-8 space-y-3">
        {managers.length === 0 && <li className="text-gray-400 italic bg-gray-50 p-4 rounded-xl text-center border border-gray-100">Henüz hiçbir yönetici atanmamış.</li>}
        {managers.map((m: any) => (
          <li key={m.user.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <div>
              <p className="font-bold text-gray-800">{m.user.name || "İsimsiz Kullanıcı"}</p>
              <p className="text-sm text-[#005da4] font-medium">{m.user.email}</p>
            </div>
            <button onClick={() => handleRemove(m.user.email)} disabled={loading} className="text-red-500 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg font-bold text-sm transition">Kaldır</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Örn: ismet@gozplatformu.com" className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-[#005da4] transition text-black font-bold placeholder-gray-400" />
        <button type="submit" disabled={loading} className="bg-[#00a3e0] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#005da4] transition disabled:opacity-50 whitespace-nowrap">Yönetici Ekle</button>
      </form>
    </div>
  );
}