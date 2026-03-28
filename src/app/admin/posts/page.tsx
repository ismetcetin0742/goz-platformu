import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPostsPage(props: { searchParams: Promise<{ status?: string }> }) {
  const searchParams = await props.searchParams;
  const statusFilter = searchParams.status;

  // URL'den gelen duruma göre veritabanı filtreleme koşulu oluşturuyoruz
  const whereClause = statusFilter ? { status: statusFilter as "PENDING" | "APPROVED" | "REJECTED" } : {};

  // İçerikleri filtreye göre en yeniden en eskiye doğru yazar bilgisiyle birlikte çekiyoruz
  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-7xl mx-auto px-6 py-16">

        {/* Başlık ve Filtreler */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <h1 className="text-3xl font-black text-[#002f56]">İçerik Yönetimi</h1>
          
          {/* Filtre Menüsü */}
          <div className="flex flex-wrap bg-white rounded-xl shadow-sm border border-gray-100 p-1.5 gap-1">
            <Link href="/admin/posts" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!statusFilter ? 'bg-[#005da4] text-white shadow' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>Tümü</Link>
            <Link href="/admin/posts?status=PENDING" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'PENDING' ? 'bg-orange-50 text-orange-600 shadow-sm border border-orange-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>Bekleyenler</Link>
            <Link href="/admin/posts?status=APPROVED" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'APPROVED' ? 'bg-green-50 text-green-600 shadow-sm border border-green-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>Onaylılar</Link>
            <Link href="/admin/posts?status=REJECTED" className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${statusFilter === 'REJECTED' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}>Reddedilenler</Link>
          </div>
        </div>

        {/* İçerik Tablosu */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="text-xs text-[#002f56] uppercase border-b border-gray-200 font-bold bg-white">
                <tr>
                  <th className="p-5">Başlık</th>
                  <th className="p-5">Kategori</th>
                  <th className="p-5">Yazar</th>
                  <th className="p-5">Durum</th>
                  <th className="p-5 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-gray-800 max-w-xs truncate" title={post.title}>{post.title}</td>
                    <td className="p-5 text-gray-600 text-sm font-medium">{post.category}</td>
                    <td className="p-5 text-gray-600 text-sm">{post.author?.name || "Bilinmiyor"}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        post.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                        post.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {post.status === 'APPROVED' ? 'Onaylı' : post.status === 'PENDING' ? 'Bekliyor' : 'Reddedildi'}
                      </span>
                    </td>
                    <td className="p-5 text-right space-x-3">
                      <Link href={`/admin/posts/${post.id}`} className="text-sm font-bold text-[#005da4] hover:underline">
                        İncele
                      </Link>
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