"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostAdd() {
  const [formData, setFormData] = useState({ title: "", content: "", imageUrl: "", category: "Göz Sağlığı" });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. FOTOĞRAF YÜKLEME FONKSİYONU (Cloudinary Bağlantısı)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const fileData = await res.json();
      
      if (fileData.secure_url) {
        setFormData((prev) => ({ ...prev, imageUrl: fileData.secure_url }));
      } else {
        alert("Yükleme sırasında bir hata oluştu. Cloudinary ayarlarınızı kontrol edin.");
      }
    } catch (err) {
      console.error("Yükleme Hatası:", err);
      alert("Fotoğraf yüklenirken bağlantı hatası oluştu.");
    } finally {
      setUploading(false);
    }
  };

  // 2. FORM GÖNDERME FONKSİYONU
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return alert("Lütfen önce bir fotoğraf yükleyin.");
    
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Harika! İçeriğiniz yönetici onayına gönderildi.");
        router.push("/"); 
      } else {
        const errorData = await res.json();
        alert(`Hata: ${errorData.error || "İçerik gönderilemedi"}`);
      }
    } catch (error) {
      alert("Sunucuya bağlanılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full mb-4">
        <button onClick={() => router.back()} type="button" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#005da4] font-bold transition-colors">
          <span>←</span> Geri Dön
        </button>
      </div>
      <div className="max-w-3xl w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-6 text-center">Yeni İçerik Paylaş</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Başlık Girişi */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">İçerik Başlığı</label>
            <input 
              type="text" 
              placeholder="Başlığı buraya yazın..." 
              required
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold text-lg outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-gray-400"
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          
          {/* Kategori Seçimi */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Kategori</label>
            <select 
              required
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 font-semibold text-lg outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all"
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              <option value="Göz Sağlığı">Göz Sağlığı</option>
              <option value="Gözlükler">Gözlükler</option>
              <option value="Lensler">Lensler</option>
              <option value="Hastalıklar">Hastalıklar</option>
              <option value="Tedaviler">Tedaviler</option>
            </select>
          </div>

          {/* İçerik Metni */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Makale İçeriği</label>
            <textarea 
              placeholder="İçeriğinizi detaylıca buraya yazın..." 
              rows={8} 
              required
              className="w-full p-4 bg-white border-2 border-gray-200 rounded-2xl text-gray-900 text-lg outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 transition-all placeholder:text-gray-400"
              onChange={e => setFormData({...formData, content: e.target.value})}
            />
          </div>

          {/* Görsel Yükleme Alanı */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Kapak Fotoğrafı</label>
            <div className="relative border-2 border-dashed border-blue-200 rounded-2xl p-8 bg-blue-50/50 hover:bg-blue-50 transition-all flex flex-col items-center justify-center group">
              <input 
                type="file" 
                accept="image/png, image/jpeg, image/webp" 
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-center">
                 <span className="text-4xl mb-2 block">📸</span>
                 <p className="text-blue-700 font-bold text-lg">
                    {uploading ? "Yükleniyor, lütfen bekleyin..." : formData.imageUrl ? "Görsel Seçildi (Değiştirmek için tıkla)" : "Fotoğraf Seçmek İçin Tıkla"}
                 </p>
                 <p className="text-blue-400 text-sm mt-1">PNG, JPG veya WebP (Max 5MB)</p>
              </div>
            </div>
            
            {/* Görsel Önizleme (Canlı ve Net) */}
            {formData.imageUrl && (
              <div className="mt-4 p-2 bg-gray-100 rounded-2xl border border-gray-200 animate-in fade-in zoom-in duration-300">
                 <img src={formData.imageUrl} alt="Önizleme" className="w-full h-64 object-cover rounded-xl shadow-md" />
              </div>
            )}
          </div>

          {/* Gönder Butonu */}
          <button 
            type="submit" 
            disabled={loading || uploading}
            className="w-full bg-[#005da4] text-white font-black py-5 rounded-2xl hover:bg-[#002f56] transition shadow-xl shadow-[#005da4]/30 disabled:bg-gray-400 active:scale-[0.98] text-xl"
          >
            {loading ? "Sistem Kaydediyor..." : "İçeriği Onaya Gönder 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}