import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardChart from "./DashboardChart";
import { auth } from "@/auth";

async function getStats() {
  // Son 7 günün başlangıç tarihini hesapla
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // Tüm istatistik sorgularını veritabanına aynı anda (paralel) göndererek ciddi bir performans artışı sağlıyoruz.
  const [totalPosts, pendingPosts, totalUsers, totalOpticians, recentUsers] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.optician.count(),
    prisma.user.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true },
    }),
  ]);

  // Son 7 günün verisini grafiğe uygun formata (Gün: Kayıt Sayısı) dönüştür
  const userTrends = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { name: d.toLocaleDateString("tr-TR", { weekday: 'short' }), users: 0, fullDate: d.toDateString() };
  });

  recentUsers.forEach(user => {
    const userDate = new Date(user.createdAt).toDateString();
    const dayData = userTrends.find(d => d.fullDate === userDate);
    if (dayData) dayData.users += 1;
  });

  return { totalPosts, pendingPosts, totalUsers, totalOpticians, userTrends };
}

export default async function AdminDashboard() {
  const session = await auth();
  const stats = await getStats();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
        <main className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black text-[#002f56] tracking-tight">Yönetim Paneli</h1>
                <p className="text-lg text-gray-500 mt-4">Göz Platformu Yönetim Merkezi</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">Toplam İçerik</h3>
                    <p className="text-4xl font-black text-[#005da4] mt-2">{stats.totalPosts}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">Onay Bekleyen</h3>
                    <p className="text-4xl font-black text-orange-500 mt-2">{stats.pendingPosts}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">Kullanıcılar</h3>
                    <p className="text-4xl font-black text-[#00a3e0] mt-2">{stats.totalUsers}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase">Gözlükçüler</h3>
                    <p className="text-4xl font-black text-green-500 mt-2">{stats.totalOpticians}</p>
                </div>
            </div>

            {/* Analiz Grafiği */}
            <DashboardChart stats={stats} userTrends={stats.userTrends} />

            {/* Hızlı Erişim Menüsü */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* İçerik Yönetimi */}
                <div className="bg-gradient-to-br from-[#005da4] to-[#00a3e0] p-10 rounded-[2.5rem] shadow-2xl shadow-blue-200 text-white flex flex-col justify-between group">
                    <div>
                        <div className="size-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">📝</div>
                        <h2 className="text-3xl font-bold text-white mb-4">İçerik Yönetimi</h2>
                        <p className="text-blue-200 text-lg mb-8 leading-relaxed">
                            Onay bekleyen yazıları yönetin, mevcut içerikleri düzenleyin veya yayından kaldırın.
                        </p>
                    </div>
                    <Link href="/admin/posts" className="bg-white text-center py-5 rounded-2xl font-black text-xl text-[#005da4] hover:bg-blue-50 hover:shadow-lg transition-all active:scale-95">
                        İçerikleri Yönet
                    </Link>
                </div>

                {/* Optisyen Yönetimi */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
                    <div>
                        <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:text-[#005da4] transition-transform">🏪</div>
                        <h2 className="text-3xl font-bold text-[#002f56] mb-4">Gözlükçü Mağazaları</h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            Sisteme kayıtlı optisyenleri ve gözlükçü mağazalarını harita üzerinde yönetin.
                        </p>
                    </div>
                    <Link href="/admin/opticians" className="bg-gray-100 text-center py-5 rounded-2xl font-black text-xl text-gray-700 hover:bg-gray-200 transition-all active:scale-95 border border-gray-200">
                        Mağazaları Yönet
                    </Link>
                </div>

                {/* SADECE ADMIN'LERİN GÖREBİLECEĞİ KARTLAR */}
                {isAdmin && (
                  <>
                    {/* Kullanıcı Yönetimi */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:text-[#00a3e0] transition-transform">👥</div>
                            <h2 className="text-3xl font-bold text-[#002f56] mb-4">Kullanıcı Yönetimi</h2>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                Sisteme kayıtlı kullanıcıları listeleyin, yetkilendirmelerini ve durumlarını kontrol edin.
                            </p>
                        </div>
                        <Link href="/admin/users" className="bg-gray-100 text-center py-5 rounded-2xl font-black text-xl text-gray-700 hover:bg-gray-200 transition-all active:scale-95 border border-gray-200">
                            Kullanıcıları Yönet
                        </Link>
                    </div>
                    
                    {/* Ayarlar */}
                    <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
                        <div>
                            <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:text-gray-900 transition-transform">⚙️</div>
                            <h2 className="text-3xl font-bold text-[#002f56] mb-4">Genel Ayarlar</h2>
                            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                                Platformun temel e-posta, iletişim ve sistem yapılandırmasını yönetin.
                            </p>
                        </div>
                        <Link href="/admin/settings" className="bg-gray-100 text-center py-5 rounded-2xl font-black text-xl text-gray-700 hover:bg-gray-200 transition-all active:scale-95 border border-gray-200">
                            Ayarları Düzenle
                        </Link>
                    </div>
                  </>
                )}

                {/* Kategori Yönetimi */}
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
                    <div>
                        <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:text-yellow-500 transition-transform">📂</div>
                        <h2 className="text-3xl font-bold text-[#002f56] mb-4">Kategori Yönetimi</h2>
                        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                            İçerik kategorilerini oluşturun, düzenleyin ve sistemdeki sınıflandırmaları yönetin.
                        </p>
                    </div>
                    <Link href="/admin/categories" className="bg-gray-100 text-center py-5 rounded-2xl font-black text-xl text-gray-700 hover:bg-gray-200 transition-all active:scale-95 border border-gray-200">
                        Kategorileri Yönet
                    </Link>
                </div>
            </div>
        </main>
    </div>
  );
}