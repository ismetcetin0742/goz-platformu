"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
};

export default function AddProductForm({ opticianId, onSuccess }: { opticianId: number; onSuccess?: () => void }) {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Inputs>();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Mağaza ID'si değiştiğinde formu ve mesajları sıfırla
  useEffect(() => {
    reset();
    setMessage(null);
  }, [opticianId, reset]);

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setMessage(null);

    try {
      const res = await fetch(`/api/opticians/${opticianId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Ürün mağazanıza başarıyla eklendi!" });
        reset(); // Formu temizle
        router.refresh(); // Sayfayı yenile ve yeni ürünü göster
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Bir hata oluştu." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-[#002f56] mb-6 border-b pb-4">Ürün Detayları</h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Adı</label>
          <input type="text" {...register("name", { required: "Ürün adı zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] focus:border-transparent outline-none" placeholder="Örn: Ray-Ban Aviator" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Fiyat (İsteğe Bağlı)</label>
          <input type="text" {...register("price")} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="Örn: 4.500 TL" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
          <textarea {...register("description")} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none min-h-[100px]" placeholder="Ürün özelliklerini giriniz..." />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Görsel URL</label>
          <input type="url" {...register("imageUrl", { required: "Görsel URL'i zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="https://..." />
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="mt-6 w-full bg-[#005da4] text-white font-bold p-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Ekleniyor..." : "Ürünü Ekle"}
      </button>
    </form>
  );
}