"use client";

import { useState } from "react";
import AddProductForm from "./AddProductForm";

export default function AddProductModal({ opticians }: { opticians: { id: number; name: string }[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOpticianId, setSelectedOpticianId] = useState<number>(opticians[0]?.id || 0);

  // Eğer sistemde hiç mağaza yoksa butonu devre dışı bırak
  if (opticians.length === 0) {
    return (
      <button disabled className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed shadow-sm font-medium">
        Önce Mağaza Eklemelisiniz
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="bg-[#005da4] text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow-sm font-medium"
      >
        + Yeni Ürün Ekle
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl hide-scrollbar">
            
            {/* Kapat Butonu */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors font-bold"
            >
              ✕
            </button>
            
            {/* Modal İçeriği */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              
              {/* Mağaza Seçimi */}
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <label className="block text-sm font-bold text-[#002f56] mb-2 uppercase tracking-wider">
                  Hangi Mağazaya Eklenecek?
                </label>
                <select 
                  value={selectedOpticianId} 
                  onChange={(e) => setSelectedOpticianId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#005da4] outline-none font-medium text-gray-700 bg-white"
                >
                  {opticians.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Form Bileşeni */}
              <AddProductForm 
                opticianId={selectedOpticianId} 
                onSuccess={() => {
                  // Başarılı kayıttan 1.5 saniye sonra modalı kapat
                  setTimeout(() => setIsOpen(false), 1500);
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}