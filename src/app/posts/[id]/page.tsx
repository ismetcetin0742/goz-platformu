import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Veritabanından makaleyi yazar bilgisiyle birlikte çekiyoruz
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: { select: { name: true } } },
  });

  // Makale yoksa veya henüz onaylanmamışsa 404 göster (Opsiyonel: Admin görsün istersen status kontrolünü kaldırabilirsin)
  if (!post || post.status !== "APPROVED") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Basit Geri Dönüş Navbarı */}
      <nav className="border-b border-gray-100 py-4 px-6 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#005da4] font-bold hover:underline flex items-center gap-2">
            ← Ana Sayfaya Dön
          </Link>
          <span className="text-xs font-black text-gray-300 uppercase tracking-widest">Makale Detayı</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Başlık Bölümü */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-[#002f56] leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 border-y border-gray-50 py-4">
             <div className="flex flex-col">
                <span className="font-bold text-[#00a3e0] uppercase text-[10px] tracking-tighter">Yazar</span>
                <span className="text-gray-900 font-medium">{post.author.name}</span>
             </div>
             <div className="w-px h-8 bg-gray-200"></div>
             <div className="flex flex-col">
                <span className="font-bold text-[#00a3e0] uppercase text-[10px] tracking-tighter">Yayınlanma</span>
                <span className="text-gray-900 font-medium">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
             </div>
          </div>
        </header>

        {/* Kapak Görseli */}
        {post.imageUrl && (
          <div className="mb-12 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-100 border border-gray-100">
            <img 
              src={post.imageUrl} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[500px]" 
            />
          </div>
        )}

        {/* Makale İçeriği */}
        <article className="prose prose-lg max-w-none">
          <p className="text-xl leading-relaxed text-[#2d2a26] whitespace-pre-wrap font-medium italic mb-8 border-l-4 border-blue-100 pl-6">
            {/* İlk paragrafı veya girişi vurgulu yapabiliriz */}
            Bu makale, göz sağlığı topluluğumuz için özenle hazırlanmış ve doğruluğu kontrol edilmiştir.
          </p>
          
          <div className="text-lg leading-[1.8] text-[#434446] whitespace-pre-wrap">
            {post.content}
          </div>
        </article>

        {/* Alt Bilgi */}
        <footer className="mt-20 pt-10 border-t border-gray-100 text-center">
           <div className="bg-[#f0f7fd] p-8 rounded-3xl">
              <h3 className="font-black text-[#002f56] text-xl mb-2">Başka sorularınız mı var?</h3>
              <p className="text-gray-600 mb-6 font-medium">Göz sağlığı hakkında daha fazla bilgi edinmek için diğer makalelerimize göz atın.</p>
              <Link href="/" className="bg-[#005da4] text-white px-8 py-3 rounded-full font-bold hover:bg-[#00a3e0] transition-all inline-block">
                Tüm Makaleleri Keşfet
              </Link>
           </div>
        </footer>
      </main>
    </div>
  );
}