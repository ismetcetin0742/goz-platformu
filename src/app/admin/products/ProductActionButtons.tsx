"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AddProductForm from "../AddProductForm";

export default function ProductActionButtons({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const deleteProduct = async () => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const data = await res.json();
        alert(`Hata: ${data.error}`);
      }
    } catch (error) {
      alert("Bağlantı hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        <button 
          onClick={() => setShowEditModal(true)} 
          disabled={loading} 
          className="px-4 py-2 bg-blue-50 text-[#005da4] rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-100 border border-blue-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          Düzenle
        </button>
        <button 
          onClick={deleteProduct} 
          disabled={loading} 
          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-100 border border-red-200 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          Sil
        </button>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <button 
              onClick={() => setShowEditModal(false)} 
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors font-bold"
            >
              ✕
            </button>
            <div className="p-2">
                <AddProductForm 
                    initialData={product} 
                    onSuccess={() => {
                        setShowEditModal(false);
                        router.refresh();
                    }} 
                />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
