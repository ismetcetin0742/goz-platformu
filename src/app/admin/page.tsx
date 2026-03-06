import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import UserMenu from "@/components/UserMenu";

export default async function AdminDashboard() {
  const session = await auth();

  // Güvenlik: Admin değilse ana sayfaya at
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/");
  }

  // İstatistikleri çekelim
  const [pendingCount, approvedCount, userCount] = await Promise.all([
    prisma.post.count({ where: { status: "PENDING" } }),
    prisma.post.count({ where: { status: "APPROVED" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#212121]">
      {/* 1. ADMIN ÜST BANNER (Siteye Dönüş Barı) */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            {/* Logo ve Ana Sayfa Linki */}
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-black tracking-tighter text-[#005da4]">GÖZ</span>
              <span className="text-xl font-light tracking-tighter text-[#00a3e0]">PLATFORMU</span>
              <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded uppercase group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                Siteye Dön
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
             <div className="hidden md:block px-3 py-1 bg-blue-50 text-[#005da4] text-xs font-black rounded-full uppercase tracking-widest border border-blue-100">
                Yönetici Modu
             </div>
             {/* Kullanıcı Menüsü (Çıkış ve profil için) */}
             <UserMenu session={session} />
          </div>
        </div>
      </header>

      {/* 2. DASHBOARD İÇERİĞİ */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-[#002f56]">Yönetim Paneli</h1>
            <p className="text-gray-500 font-medium mt-1">Sistem genelindeki içerikleri ve ayarları buradan kontrol edin.</p>
          </div>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Onay Bekleyen</p>
            <p className="text-5xl font-black text-orange-500 mt-2">{pendingCount}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Yayındaki İçerik</p>
            <p className="text-5xl font-black text-green-500 mt-2">{approvedCount}</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-gray-400 font-black text-xs uppercase tracking-[0.2em]">Kayıtlı Üye</p>
            <p className="text-5xl font-black text-[#005da4] mt-2">{userCount}</p>
          </div>
        </div>

        {/* Hızlı Erişim Menüsü */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* İçerik Yönetimi */}
          <div className="bg-[#002f56] p-10 rounded-[2.5rem] shadow-2xl text-white flex flex-col justify-between group">
            <div>
              <div className="size-14 bg-[#00a3e0] rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 transition-transform">⚖️</div>
              <h2 className="text-3xl font-bold mb-4">İçerik Onay Masası</h2>
              <p className="text-blue-100/70 text-lg mb-8 leading-relaxed">
                Kullanıcılar tarafından gönderilen yeni makaleleri inceleyin, düzenleyin ve onaylayarak yayına alın.
              </p>
            </div>
            <Link 
              href="/admin/posts" 
              className="bg-white text-[#002f56] text-center py-5 rounded-2xl font-black text-xl hover:bg-[#00a3e0] hover:text-white transition-all shadow-xl active:scale-95"
            >
              İncelemeye Başla ({pendingCount})
            </Link>
          </div>

          {/* Sistem Ayarları */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group">
            <div>
              <div className="size-14 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:rotate-45 transition-transform text-gray-600">⚙️</div>
              <h2 className="text-3xl font-bold text-[#002f56] mb-4">Sistem Ayarları</h2>
              <p className="text-gray-500 text-lg mb-8 leading-relaxed">
                E-posta yapılandırmaları (SMTP), API anahtarları ve platformun teknik altyapısını yönetin.
              </p>
            </div>
            <Link 
              href="/admin/settings" 
              className="bg-gray-100 text-center py-5 rounded-2xl font-black text-xl text-gray-700 hover:bg-gray-200 transition-all active:scale-95 border border-gray-200"
            >
              Ayarları Düzenle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}