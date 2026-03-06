import { auth } from "@/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import UserMenu from "@/components/UserMenu";

export default async function HomePage() {
  const session = await auth();

  // Onaylı içerikleri yazar bilgisiyle birlikte çekiyoruz
  const posts = await prisma.post.findMany({
    where: { status: "APPROVED" },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } }
  });

  // A-Z Dizini verisi
  const visionAZ = [
    "Astigmatizma", "Blefarit", "Göz Kuruluğu", "Katarakt", "Renk Körlüğü",
    "Diyabetik Retinopati", "Göz Sineklenmesi", "Glokom", "Hipermetropi", "Miyopi"
  ];

  return (
    <div className="min-h-screen bg-white text-[#2d2a26] font-sans selection:bg-blue-100">
      
      {/* 1. ÜST NAVİGASYON - Modern ve Net */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex justify-between items-center">
          {/* Logo Alanı */}
          <Link href="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-tighter text-[#005da4] transition-colors group-hover:text-black">GÖZ</span>
            <span className="text-2xl font-light tracking-tighter text-[#00a3e0]">PLATFORMU</span>
          </Link>

          {/* Menü Linkleri (Desktop) */}
          <nav className="hidden lg:flex gap-8 text-[13px] font-bold uppercase tracking-wider text-[#515151]">
            <Link href="#" className="hover:text-[#005da4] transition-colors">Göz Koşulları</Link>
            <Link href="#" className="hover:text-[#005da4] transition-colors">Gözlükler</Link>
            <Link href="#" className="hover:text-[#005da4] transition-colors">Lensler</Link>
            <Link href="/post-add" className="text-[#00a3e0] hover:text-[#005da4] transition-colors">✨ İçerik Paylaş</Link>
          </nav>

          {/* Kullanıcı Bölümü */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-[#f6f6f6] rounded-full px-4 py-2 border border-gray-200 focus-within:border-[#00a3e0] transition-all">
              <input type="text" placeholder="Hastalık, belirti ara..." className="bg-transparent border-none focus:ring-0 text-sm w-32 md:w-48 outline-none text-gray-700" />
              <span className="text-gray-400 cursor-pointer hover:text-blue-500">🔍</span>
            </div>
            {session ? (
              <UserMenu session={session} />
            ) : (
              <Link href="/login" className="bg-[#005da4] text-white px-6 py-2.5 rounded-md font-bold text-xs hover:bg-[#002f56] transition uppercase tracking-widest shadow-md">
                GİRİŞ YAP
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER - Dikkat Çekici Giriş */}
      <section className="relative w-full h-[450px] md:h-[550px] bg-[#002f56] overflow-hidden flex items-center">
        {/* Arka Plan Dokusu */}
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.allaboutvision.com/images/desktopimage1.jpg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#002f56] to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1 bg-[#00a3e0] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded mb-6">
              Bilgi Güçtür
            </span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6">
              Daha Net Bir Gelecek <br /><span className="text-[#00a3e0]">İçin Okuyun.</span>
            </h1>
            <p className="text-lg md:text-xl text-blue-100/80 mb-10 font-medium leading-relaxed">
              Türkiye'nin en kapsamlı ve uzman onaylı göz sağlığı kütüphanesine hoş geldiniz. 
              Siz de katkıda bulunun, toplumu bilgilendirin.
            </p>
            <div className="flex flex-wrap gap-4">
               <Link href="/post-add" className="bg-white text-[#002f56] px-10 py-4 rounded-md font-black text-lg hover:bg-[#00a3e0] hover:text-white transition-all shadow-2xl active:scale-95">
                 Hemen Makale Yaz
               </Link>
               <Link href="#latest" className="px-10 py-4 text-white font-bold hover:underline transition-all">
                 Son Yayınları Gör ↓
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. A-Z DIZINI - Bilgiye Hızlı Erişim */}
      <section className="bg-[#f8f9fa] py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-xl font-black text-[#002f56] uppercase tracking-tighter whitespace-nowrap">Göz Sağlığı A-Z</h2>
            <div className="h-[2px] bg-blue-100 w-full rounded-full"></div>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {visionAZ.map((item, idx) => (
              <Link key={idx} href="#" className="text-[#005da4] font-bold hover:text-[#00a3e0] hover:underline text-sm md:text-[15px] transition-colors">
                {item}
              </Link>
            ))}
            <Link href="#" className="text-gray-400 font-black text-sm hover:text-blue-700 transition uppercase">TÜM DİZİN →</Link>
          </div>
        </div>
      </section>

      {/* 4. SON MAKALELER - Modern Kart Tasarımı */}
      <section id="latest" className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-16 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-4xl font-black text-[#002f56]">En Son Makaleler</h2>
            <p className="text-gray-500 font-medium mt-2 text-lg italic">Editörlerimizin onayından geçen güncel rehberler.</p>
          </div>
          <Link href="#" className="bg-blue-50 text-[#005da4] px-6 py-2 rounded-full font-black text-sm hover:bg-[#005da4] hover:text-white transition-all border border-blue-100">
            TÜMÜNÜ KEŞFET
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.length > 0 ? posts.map((post) => (
            <article key={post.id} className="group flex flex-col h-full bg-white">
              {/* Resim Alanı - Tıklanabilir */}
              <Link href={`/posts/${post.id}`} className="block relative h-64 w-full overflow-hidden rounded-2xl mb-6 shadow-lg">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-in-out" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300 font-bold uppercase tracking-widest">Resim Yok</div>
                )}
                <div className="absolute top-5 left-5 bg-[#00a3e0] text-white text-[9px] font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
                   Yeni İçerik
                </div>
              </Link>

              {/* İçerik Bilgileri */}
              <div className="flex flex-col flex-grow px-2">
                <Link href={`/posts/${post.id}`}>
                  <h3 className="text-2xl font-black text-[#2d2a26] group-hover:text-[#005da4] transition-colors leading-[1.2] mb-4">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-[#515151] text-base line-clamp-3 leading-relaxed mb-6 font-medium">
                  {post.content}
                </p>
                
                {/* Alt Bilgi */}
                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Yazar</span>
                    <span className="text-sm font-bold text-gray-700">{post.author?.name || "Göz Platformu"}</span>
                  </div>
                  <Link href={`/posts/${post.id}`} className="text-[#00a3e0] font-black text-[12px] uppercase tracking-tighter hover:text-[#002f56] transition-all">
                    OKUMAYA BAŞLA →
                  </Link>
                </div>
              </div>
            </article>
          )) : (
            <div className="col-span-3 text-center py-24 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
               <p className="text-gray-400 text-xl font-bold font-serif italic">Henüz onaylanmış makale bulunmuyor.</p>
               <Link href="/post-add" className="mt-4 inline-block text-blue-600 font-black hover:underline underline-offset-4">İlk makaleyi sen eklemek ister misin?</Link>
            </div>
          )}
        </div>
      </section>

      {/* 5. KATKIDA BULUN BANNERI - All About Vision Tarzı */}
      <section className="bg-[#f0f7fd] py-24 text-center px-6 border-y border-blue-50">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#00a3e0] font-black uppercase tracking-[0.4em] text-xs mb-6 block">Topluluğa Katılın</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#002f56] mb-8 leading-tight">
            Bilginizi Paylaşın, <br />Göz Sağlığına Işık Tutun.
          </h2>
          <p className="text-[#515151] mb-12 text-xl max-w-2xl mx-auto leading-relaxed">
            Yazılarınız uzman ekibimizce incelenir ve onaylandıktan sonra milyonlarca kişiye ücretsiz bilgi kaynağı olarak sunulur.
          </p>
          <div className="flex justify-center gap-6">
            <Link href="/post-add" className="bg-[#002f56] text-white px-12 py-5 rounded-md font-black text-xl hover:bg-black transition-all shadow-2xl hover:-translate-y-1 active:scale-95">
               Yazı Gönder 🚀
            </Link>
          </div>
        </div>
      </section>

      {/* 6. MODERN FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col items-center md:items-start">
             <Link href="/" className="text-2xl font-black text-[#005da4] tracking-tighter">GÖZ<span className="font-light text-[#00a3e0]">PLATFORMU</span></Link>
             <p className="text-[13px] text-gray-400 mt-4 text-center md:text-left max-w-xs font-medium">
               © 2000-2026 Tüm hakları saklıdır. Bu platformda yer alan bilgiler tıbbi tavsiye niteliğinde değildir.
             </p>
          </div>
          <div className="flex flex-wrap justify-center gap-10 text-[13px] font-bold text-[#515151] uppercase tracking-widest">
            <Link href="#" className="hover:text-[#00a3e0] transition-colors">Hakkımızda</Link>
            <Link href="#" className="hover:text-[#00a3e0] transition-colors">İletişim</Link>
            <Link href="#" className="hover:text-[#00a3e0] transition-colors">Gizlilik Sözleşmesi</Link>
            <Link href="#" className="hover:text-[#00a3e0] transition-colors">Kullanım Şartları</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}