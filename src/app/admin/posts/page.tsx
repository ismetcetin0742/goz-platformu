"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts/pending");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Yükleme Hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleAction = async (id: number, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p: any) => p.id !== id));
      } else {
        const errData = await res.json();
        alert("Hata: " + errData.error);
      }
    } catch (error) {
      alert("Bağlantı hatası oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-[#002f56]">Onay Bekleyenler ⚖️</h1>
          <Link href="/admin" className="bg-white border px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-50 transition">
            ← Panele Dön
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[#00a3e0] font-bold animate-pulse">İçerikler kontrol ediliyor...</div>
        ) : (
          <div className="space-y-6">
            {posts.length > 0 ? posts.map((post: any) => (
              <div key={post.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="" className="w-full md:w-48 h-32 object-cover rounded-2xl shadow-inner bg-gray-100" />
                )}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.content}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00a3e0]">
                    <span>👤 {post.author?.name || "İsimsiz"}</span>
                    <span>•</span>
                    <span>📅 {new Date(post.createdAt).toLocaleDateString("tr-TR")}</span>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2 justify-center">
                  <button 
                    onClick={() => handleAction(post.id, "APPROVED")}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
                  >
                    Onayla
                  </button>
                  <button 
                    onClick={() => handleAction(post.id, "REJECTED")}
                    className="bg-red-50 text-red-600 px-8 py-3 rounded-xl font-bold hover:bg-red-100 transition-all"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            )) : (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-xl font-bold font-serif">Şu an onay bekleyen içerik bulunmuyor. ✨</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}