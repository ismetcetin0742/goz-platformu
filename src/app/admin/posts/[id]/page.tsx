import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostActionButtons from "./PostActionButtons";

export default async function AdminPostReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: { author: { select: { name: true } } },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Üst Navigasyon */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/admin/posts" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#005da4] font-bold transition-colors text-sm">
            <span>←</span> İçeriklere Dön
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl font-bold text-sm text-[#005da4] shadow-sm border border-gray-100 hover:bg-blue-50 hover:shadow-md transition-all active:scale-95">
            🌍 Siteye Dön
          </Link>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#002f56] tracking-tight">İçerik İnceleme</h1>
          <p className="text-gray-500 font-medium mt-2">Kullanıcı tarafından gönderilen içeriği inceleyin ve yayın durumunu belirleyin.</p>
        </div>

        {/* Makale İnceleme Kartı */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          {/* Durum Banner'ı */}
          <div className={`p-4 text-center font-bold text-sm tracking-widest uppercase ${
            post.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
            post.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
          }`}>
            Mevcut Durum: {post.status === 'APPROVED' ? '✅ Onaylandı ve Yayında' : post.status === 'PENDING' ? '⏳ Onay Bekliyor' : '❌ Reddedildi'}
          </div>

          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-black text-gray-900 mb-6">{post.title}</h2>
            
            <div className="flex flex-wrap gap-6 mb-10 text-sm text-gray-600 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div><span className="block text-xs font-bold text-gray-400 uppercase mb-1">Yazar</span><span className="font-bold text-[#005da4]">{post.author?.name || "Bilinmiyor"}</span></div>
              <div><span className="block text-xs font-bold text-gray-400 uppercase mb-1">Kategori</span><span className="font-bold text-gray-800">{post.category}</span></div>
              <div><span className="block text-xs font-bold text-gray-400 uppercase mb-1">Gönderim Tarihi</span><span className="font-bold text-gray-800">{new Date(post.createdAt).toLocaleDateString("tr-TR")}</span></div>
            </div>

            {post.imageUrl && (
              <div className="mb-10 rounded-2xl overflow-hidden shadow-md">
                <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover" />
              </div>
            )}

            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{post.content}</div>

            {/* Aksiyon Butonları Bileşeni */}
            <PostActionButtons postId={post.id} currentStatus={post.status} />
          </div>
        </div>
      </main>
    </div>
  );
}