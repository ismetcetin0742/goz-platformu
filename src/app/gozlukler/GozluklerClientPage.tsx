"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Optician } from '@prisma/client';
import VirtualTryOn3D from '@/components/VirtualTryOn3D';

// Client Component'in prop olarak alacağı mağaza tipini tanımlıyoruz.
// Veritabanından gelen Optician tipine, kategorileri tutan bir dizi ekliyoruz.
export type StoreWithCategories = Optician & {
  allowedCategories: ('gunes' | 'numarali')[];
};

// Ürünler için sahte veri, bu daha sonra veritabanına taşınabilir.
const MOCK_PRODUCTS = {
  gunes: [
    { id: 101, name: "Ray-Ban Aviator", brand: "Ray-Ban", price: "4.500 TL" },
    { id: 102, name: "Vogue Elegance", brand: "Vogue", price: "2.100 TL" },
    { id: 103, name: "Oakley Classic", brand: "Oakley", price: "6.200 TL" },
  ],
  numarali: [
    { id: 201, name: "Prada Minimal", brand: "Prada", price: "3.200 TL" },
    { id: 202, name: "Tom Ford Optic", brand: "Tom Ford", price: "5.400 TL" },
  ]
};

export default function GozluklerClientPage({ stores }: { stores: StoreWithCategories[] }) {
  // --- DURUMLAR (STATES) ---
  const [selectedStore, setSelectedStore] = useState<StoreWithCategories | null>(null);
  const [activeCategory, setActiveCategory] = useState<'gunes' | 'numarali'>('gunes');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showKVKK, setShowKVKK] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleStoreSelect = (store: StoreWithCategories) => {
    setSelectedStore(store);
    if (store.allowedCategories.length > 0) {
      setActiveCategory(store.allowedCategories[0]);
    }
    setIsCameraActive(false);
    setSelectedProduct(null);
  };

  const handleBackToStores = () => {
    setSelectedStore(null);
    setIsCameraActive(false);
    setSelectedProduct(null);
  };

  const handleCanliDeneClick = (product: any) => {
    setSelectedProduct(product);
    setShowKVKK(true);
  };

  const handleKVKKApprove = async () => {
    setShowKVKK(false);
    setIsCameraActive(true);
  };

  const handleCategoryChange = (category: 'gunes' | 'numarali') => {
    setActiveCategory(category);
    setIsCameraActive(false);
    setSelectedProduct(null);
    setShowKVKK(false);
  }

  const renderCameraView = () => (
    <div className="w-full max-w-4xl flex flex-col items-center">
      <VirtualTryOn3D 
        product={selectedProduct} 
        onClose={() => setIsCameraActive(false)} 
      />
    </div>
  );

  return (
    <main className="flex-1 flex flex-col items-center py-10 w-full px-4 max-w-6xl mx-auto">
      {!selectedStore && (
        <div className="w-full">
          <h1 className="text-3xl font-black text-gray-800 mb-2">Sanal Deneme Mağazaları</h1>
          <p className="text-gray-500 mb-8">Sanal deneme yapmak ve ürünleri incelemek için bir mağaza seçin.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <div key={store.id} onClick={() => handleStoreSelect(store)} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all transform hover:-translate-y-1">
                <h3 className="text-xl font-bold text-[#005da4] mb-4">{store.name}</h3>
                <p className="text-sm text-gray-500 mb-4">📍 {store.address}</p>
                <div className="flex flex-wrap gap-2">
                  {store.allowedCategories.includes('gunes') && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded uppercase font-bold">Güneş Gözlüğü</span>}
                  {store.allowedCategories.includes('numarali') && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase font-bold">Numaralı Gözlük</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedStore && !isCameraActive && (
        <div className="w-full">
          <button onClick={handleBackToStores} className="text-[#005da4] font-bold mb-6 hover:underline">
            ← Mağazalara Dön
          </button>
          <div className="flex items-end justify-between border-b-2 border-gray-200 mb-8 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-800">{selectedStore.name}</h2>
              <p className="text-gray-500">Bu mağazadaki sanal denemeye uygun ürünler</p>
            </div>
          </div>
          <div className="flex space-x-4 mb-8">
            {selectedStore.allowedCategories.includes('gunes') && <button onClick={() => handleCategoryChange('gunes')} className={`px-6 py-2 rounded-full font-bold transition-colors ${activeCategory === 'gunes' ? 'bg-[#005da4] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>Güneş Gözlükleri</button>}
            {selectedStore.allowedCategories.includes('numarali') && <button onClick={() => handleCategoryChange('numarali')} className={`px-6 py-2 rounded-full font-bold transition-colors ${activeCategory === 'numarali' ? 'bg-[#005da4] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>Numaralı Gözlükler</button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS[activeCategory]?.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col items-center p-6 border border-gray-100">
                <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-6"><span className="text-gray-400 font-medium">Gözlük Görseli</span></div>
                <h3 className="text-xl font-bold text-gray-800 text-center">{product.name}</h3>
                <p className="text-gray-500 mb-2">{product.brand}</p>
                <p className="text-[#005da4] font-black text-lg mb-6">{product.price}</p>
                <button onClick={() => handleCanliDeneClick(product)} className="w-full py-3 bg-[#00a3e0] text-white font-bold rounded-xl shadow-md hover:bg-[#005da4] transition transform hover:scale-105 active:scale-95">Canlı Dene</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCameraActive && renderCameraView()}

      {showKVKK && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">KVKK Aydınlatma Metni</h3>
            <p className="text-gray-600 text-sm mb-6 max-h-40 overflow-y-auto pr-2">
              Sanal deneme (Canlı Dene) özelliğini kullanabilmeniz için cihazınızın kamerasına erişmemiz gerekmektedir. Kamera görüntüleriniz anlık olarak tarayıcınızda işlenmekte olup, hiçbir şekilde sunucularımıza kaydedilmemekte veya üçüncü şahıslarla paylaşılmamaktadır. Devam ederek kamera kullanımına açık rıza göstermiş olursunuz.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowKVKK(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">İptal</button>
              <button onClick={handleKVKKApprove} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition">Okudum, Onaylıyorum</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}