import { prisma } from "@/lib/prisma";
import Link from "next/link";
import UserRoleSelect from "./UserRoleSelect";
import UserActionButtons from "./UserActionButtons";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
  const session = await auth();
  
  // Ekstra Güvenlik: Sadece ADMIN'ler kullanıcı listesini görebilir
  if (session?.user?.role !== "ADMIN") {
    redirect("/admin"); 
  }

  // Tüm kullanıcıları veritabanından çekiyoruz
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* Başlık */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-[#002f56]">Kullanıcı Yönetimi</h1>
            <p className="text-gray-500 font-medium mt-2">Sisteme kayıtlı tüm üyeler ve yöneticiler.</p>
          </div>
        </div>

        {/* Kullanıcılar Tablosu */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-xs text-[#002f56] uppercase border-b border-gray-200 font-bold bg-white">
                <tr>
                  <th className="p-5">İsim & Soyisim</th>
                  <th className="p-5">E-posta Adresi</th>
                  <th className="p-5">Rol</th>
                  <th className="p-5">Durum</th>
                  <th className="p-5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-gray-800">{user.name || "İsimsiz Kullanıcı"}</td>
                    <td className="p-5 text-gray-600 text-sm">{user.email}</td>
                    <td className="p-5">
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    </td>
                    <td className="p-5">
                      <span 
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                          user.isBanned ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                        // Fare ile üzerine gelince yasaklama nedenini göster
                        title={user.isBanned && user.banReason ? `Neden: ${user.banReason}` : ''}
                      >
                        {user.isBanned ? 'Yasaklı' : 'Aktif'}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <UserActionButtons userId={user.id} isBanned={user.isBanned} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}