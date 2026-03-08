"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Yükleme Hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRoleChange = async (id: number, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!confirm(`Bu kullanıcının yetkisini ${newRole} olarak değiştirmek istediğinize emin misiniz?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setUsers((prev: any) => prev.map((u: any) => u.id === id ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-[#002f56]">Üye Yönetimi 👥</h1>
            <p className="text-gray-500 font-medium">Toplam {users.length} kayıtlı üye bulunuyor.</p>
          </div>
          <Link href="/admin" className="bg-white border px-4 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
            ← Panele Dön
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Kullanıcı Bilgileri</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Yetki</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Durum</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 text-right">Eylem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center text-blue-500 font-bold animate-pulse">Yükleniyor...</td></tr>
              ) : users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {user.name?.[0] || "U"}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{user.name || "İsimsiz"}</div>
                        <div className="text-sm text-gray-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      user.role === "ADMIN" ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    {user.emailVerified ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-600 text-xs font-bold gap-1.5">
                        <span className="size-1.5 bg-green-600 rounded-full" /> Onaylı
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold gap-1.5">
                        <span className="size-1.5 bg-orange-600 rounded-full animate-ping" /> Bekliyor
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
                    >
                      Rolü Değiştir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}