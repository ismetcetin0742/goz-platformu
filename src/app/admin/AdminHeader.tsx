import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { Session } from "next-auth";

interface AdminHeaderProps {
  session: Session;
}

export default function AdminHeader({ session }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Sol Taraf: Logo ve Navigasyon */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group transition-opacity hover:opacity-80">
            <span className="text-xl font-black tracking-tighter text-[#005da4]">GÖZ</span>
            <span className="text-xl font-light tracking-tighter text-[#00a3e0]">PLATFORMU</span>
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-400 text-[10px] font-bold rounded uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
              Siteye Dön
            </span>
          </Link>

          {/* İsteğe bağlı: Hızlı Linkler */}
          <nav className="hidden lg:flex items-center gap-4 text-sm font-bold text-gray-500">
            <Link href="/admin" className="hover:text-[#005da4]">Panel</Link>
            <Link href="/admin/posts" className="hover:text-[#005da4]">İçerikler</Link>
          </nav>
        </div>

        {/* Sağ Taraf: Durum ve Profil */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#005da4] text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Yönetici Modu
          </div>
          
          <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>
          
          <UserMenu session={session} />
        </div>
      </div>
    </header>
  );
}