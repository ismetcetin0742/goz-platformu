"use client";
import { useState, useEffect } from "react";

export default function AdminPostApproval() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts/pending");
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPendingPosts(); }, []);

  const handleAction = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    
    if (res.ok) {
      fetchPendingPosts(); // Listeyi güncelle
    } else {
      alert("İşlem başarısız oldu.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-black mb-8 text-gray-900">Onay Masası ⚖️</h1>
      
      {loading ? (
        <p className="text-blue-600 font-bold animate-pulse">İçerikler yükleniyor...</p>
      ) : (
        <div className="grid gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white p-6 rounded-[2rem] shadow-xl border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
              {post.imageUrl && (
                <img src={post.imageUrl} alt="" className="w-32 h-32 object-cover rounded-2xl shadow-md" />
              )}
              
              <div className="flex-grow text-center md:text-left">
                <h3 className="text-xl font-extrabold text-gray-800">{post.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
                <p className="text-blue-600 text-xs font-bold mt-2 uppercase tracking-widest">
                  Yazar: {post.author?.name || "Bilinmiyor"} ({post.author?.email})
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => handleAction(post.id, "APPROVED")} 
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-lg shadow-green-100 active:scale-95"
                >
                  Onayla
                </button>
                <button 
                  onClick={() => handleAction(post.id, "REJECTED")} 
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-8 py-3 rounded-2xl font-black transition-all active:scale-95"
                >
                  Reddet
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold text-xl">Bekleyen içerik bulunmuyor. Kahve içebilirsin! ☕</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}