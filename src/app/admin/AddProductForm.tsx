"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  name: string;
  brand: string;
  description: string;
  imageUrl: string;
  visual360: string;
  price: string;
  category: "SUNGLASSES" | "PRESCRIPTION";
  opticianId: string;
};

export default function AddProductForm({ 
  initialData, 
  opticianId: propOpticianId, 
  onSuccess 
}: { 
  initialData?: any;
  opticianId?: number; 
  onSuccess?: () => void 
}) {
  const router = useRouter();
  const [opticians, setOpticians] = useState<{id: number, name: string}[]>([]);
  const isEdit = !!initialData;

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<Inputs>({
    defaultValues: initialData ? {
      ...initialData,
      price: initialData.price?.toString(),
      opticianId: initialData.opticianId?.toString()
    } : {
      opticianId: propOpticianId?.toString(),
      category: "SUNGLASSES"
    }
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({});

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: "imageUrl" | "visual360") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [fieldName]: true }));
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setValue(fieldName, data.url);
      } else {
        alert(data.error || "Yükleme başarısız.");
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Bağlantı hatası oluştu.");
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  useEffect(() => {
    if (propOpticianId) {
      setValue("opticianId", propOpticianId.toString());
    }
  }, [propOpticianId, setValue]);

  useEffect(() => {
    if (!propOpticianId && !initialData?.opticianId) {
      fetch("/api/opticians")
        .then(res => res.json())
        .then(data => setOpticians(data))
        .catch(err => console.error("Optisyenler yüklenemedi", err));
    }
  }, [propOpticianId, initialData]);

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    setMessage(null);

    const url = isEdit ? `/api/products/${initialData.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            opticianId: formData.opticianId || propOpticianId
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: isEdit ? "Ürün başarıyla güncellendi!" : "Ürün başarıyla eklendi!" });
        if (!isEdit) reset(); 
        router.refresh();
        if (onSuccess) {
          setTimeout(onSuccess, 1500);
        }
      } else {
        setMessage({ type: "error", text: data.error || "Bir hata oluştu." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bağlantı hatası oluştu." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 bg-white w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#002f56] mb-6 border-b pb-4">
        {isEdit ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
      </h2>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 text-sm font-medium ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ürün Adı</label>
            <input type="text" {...register("name", { required: "Ürün adı zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="Örn: Ray-Ban Aviator" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Marka</label>
            <input type="text" {...register("brand", { required: "Marka zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="Örn: Ray-Ban" />
            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fiyat</label>
            <input type="number" step="0.01" {...register("price", { required: "Fiyat zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="Örn: 4500.00" />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori</label>
            <select {...register("category")} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none">
                <option value="SUNGLASSES">Güneş Gözlüğü</option>
                <option value="PRESCRIPTION">Numaralı Gözlük</option>
            </select>
        </div>

        {!propOpticianId && !initialData?.opticianId && (
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Mağaza</label>
                <select {...register("opticianId", { required: "Mağaza seçimi zorunludur." })} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none">
                    <option value="">Mağaza Seçin</option>
                    {opticians.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                </select>
                {errors.opticianId && <p className="text-red-500 text-xs mt-1">{errors.opticianId.message}</p>}
            </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Açıklama</label>
          <textarea {...register("description")} className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none min-h-[80px]" placeholder="Ürün özelliklerini giriniz..." />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kapak Görseli</label>
          <div className="flex gap-2">
            <input type="text" {...register("imageUrl", { required: "Görsel URL'i zorunludur." })} className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="https://..." />
            <div className="relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleFileUpload(e, "imageUrl")} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                disabled={uploading.imageUrl}
              />
              <button type="button" className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-200 font-medium whitespace-nowrap">
                {uploading.imageUrl ? "Yükleniyor..." : "Dosya Yükle"}
              </button>
            </div>
          </div>
          {errors.imageUrl && <p className="text-red-500 text-xs mt-1">{errors.imageUrl.message}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">360 Görsel / 3D Model (BX/FBX/GLB)</label>
          <div className="flex gap-2">
            <input type="text" {...register("visual360")} className="flex-1 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-[#005da4] outline-none" placeholder="https://... veya dosya yükleyin" />
            <div className="relative">
              <input 
                type="file" 
                accept=".glb,.gltf,.fbx,.bx" 
                onChange={(e) => handleFileUpload(e, "visual360")} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                disabled={uploading.visual360}
              />
              <button type="button" className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-200 font-medium whitespace-nowrap">
                {uploading.visual360 ? "Yükleniyor..." : "Dosya Yükle"}
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">.glb, .fbx veya .bx formatında 360 görsellerinizi yükleyebilirsiniz.</p>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="mt-8 w-full bg-[#005da4] text-white font-bold p-4 rounded-xl hover:bg-blue-800 transition shadow-lg active:scale-[0.98] disabled:opacity-50"
      >
        {isSubmitting ? "Kaydediliyor..." : (isEdit ? "Güncelle" : "Ürünü Ekle")}
      </button>
    </form>
  );
}
