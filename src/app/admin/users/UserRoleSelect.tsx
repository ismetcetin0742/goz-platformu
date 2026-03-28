"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserRoleSelect({ userId, currentRole }: { userId: string | number, currentRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    
    if (!confirm(`Kullanıcı rolünü ${newRole} olarak değiştirmek istediğinize emin misiniz?`)) {
      e.target.value = currentRole; // İptal edilirse eski değere dön
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        alert(`Rol başarıyla ${newRole} olarak güncellendi.`);
        router.refresh(); // Tabloyu yenile
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
        e.target.value = currentRole;
      }
    } catch (error) {
      alert("Sunucuya bağlanılırken bir hata oluştu.");
      e.target.value = currentRole;
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      defaultValue={currentRole}
      onChange={handleRoleChange}
      disabled={loading}
      className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider outline-none cursor-pointer border-2 transition-all appearance-none text-center shadow-sm ${
        currentRole === 'ADMIN' 
          ? 'bg-purple-50 text-purple-700 border-purple-200 focus:border-purple-500 hover:bg-purple-100' 
          : 'bg-gray-50 text-gray-700 border-gray-200 focus:border-gray-500 hover:bg-gray-100'
      } disabled:opacity-50`}
    >
      <option value="USER" className="text-gray-700 font-bold">USER</option>
      <option value="ADMIN" className="text-purple-700 font-bold">ADMIN</option>
    </select>
  );
}