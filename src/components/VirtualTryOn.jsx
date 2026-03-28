import React, { useState, useRef, useEffect } from 'react';

export default function VirtualTryOn() {
  const [activeCategory, setActiveCategory] = useState('gunes'); // 'gunes' veya 'numarali'
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const [showKVKK, setShowKVKK] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  // "Canlı Dene" butonuna tıklandığında KVKK modalını göster
  const handleCanliDeneClick = () => {
    setShowKVKK(true);
  };

  // KVKK onaylandığında modalı kapat ve kamerayı aç
  const handleKVKKApprove = async () => {
    setShowKVKK(false);
    setIsCameraActive(true);
  };

  // isCameraActive state'i true olduğunda web kamerasını başlat
  useEffect(() => {
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Kameraya erişilemedi:", err);
          alert("Kamera erişimi reddedildi veya bulunamadı.");
        });
    }
  }, [isCameraActive]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      
      {/* Üst Navigasyon / Açılır Menü */}
      <nav className="w-full bg-white shadow-md p-4 flex justify-center z-20 relative">
        <div 
          className="relative cursor-pointer"
          onMouseEnter={() => setIsDropdownMenuOpen(true)}
          onMouseLeave={() => setIsDropdownMenuOpen(false)}
        >
          <div 
            className="text-xl font-bold text-gray-800 py-2 px-6 rounded-md hover:text-blue-600 transition-colors"
            onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
          >
            Gözlükler ▾
          </div>
          {/* Açılır Menü (Dropdown) İçeriği */}
          {isDropdownMenuOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-100 shadow-2xl rounded-xl transition-all overflow-hidden z-50">
            <ul className="py-1">
              <li 
                className={`px-5 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 font-medium ${activeCategory === 'numarali' ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => { setActiveCategory('numarali'); setIsCameraActive(false); setShowKVKK(false); setIsDropdownMenuOpen(false); }}
              >
                Numaralı Gözlükler
              </li>
              <li 
                className={`px-5 py-3 hover:bg-blue-50 cursor-pointer text-gray-700 font-medium border-t border-gray-100 ${activeCategory === 'gunes' ? 'bg-blue-50 text-blue-600' : ''}`}
                onClick={() => { setActiveCategory('gunes'); setIsDropdownMenuOpen(false); }}
              >
                Güneş Gözlükleri
              </li>
            </ul>
          </div>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center py-10 w-full px-4">
        
        {activeCategory === 'numarali' ? (
          /* Numaralı Gözlükler Ekranı */
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-16 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Numaralı Gözlükler</h2>
            <p className="text-gray-500 text-lg">Bu kategorideki ilanlar ve sanal deneme özellikleri yakında eklenecektir.</p>
          </div>
        ) : (
          /* Güneş Gözlükleri Ekranı (KVKK ve Kamera Kurgusu ile birlikte) */
          <div className="w-full flex flex-col items-center">
            {/* Sekme Başlığı */}
            <div className="w-full max-w-4xl border-b-2 border-gray-200 mb-8 pb-4">
              <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
                Güneş Gözlükleri <span className="text-blue-500 text-lg ml-2">Yeni Sezon</span>
              </h2>
            </div>

            {/* Ana Ekran: Ürün veya Kamera Feed'i */}
            <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
              {!isCameraActive ? (
                /* Durum 1: Ürün Görseli ve Canlı Dene Butonu */
                <div className="w-full flex flex-col items-center justify-center p-8 bg-gray-100">
                  <div className="w-64 h-32 bg-gray-300 rounded-lg shadow-inner flex items-center justify-center mb-8 relative">
                    <span className="text-gray-500 font-medium">[Şık Güneş Gözlüğü Görseli]</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ray-Ban Aviator Classic</h3>
                  <p className="text-gray-500 mb-8 text-center max-w-sm">Yüzünüzde nasıl duracağını anında görün. Optik uzmanlarımız tarafından sisteme yüklendi.</p>
                  
                  <button 
                    onClick={handleCanliDeneClick}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition transform hover:scale-105"
                  >
                    Sanal Deneme (Canlı Dene)
                  </button>
                </div>
              ) : (
                /* Durum 2: Canlı Kamera Feed'i (KVKK onayından sonra) */
                <div className="w-full relative bg-black flex items-center justify-center overflow-hidden">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  <div className="absolute bottom-6 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full backdrop-blur-sm">
                    Sanal Deneme Aktif - Yüzünüz Takip Ediliyor...
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* KVKK Modal Penceresi (Popup) */}
      {showKVKK && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">KVKK Aydınlatma Metni</h3>
            <p className="text-gray-600 text-sm mb-6 max-h-40 overflow-y-auto pr-2">
              Sanal deneme (Canlı Dene) özelliğini kullanabilmeniz için cihazınızın kamerasına erişmemiz gerekmektedir. 
              Kamera görüntüleriniz anlık olarak tarayıcınızda işlenmekte olup, 
              hiçbir şekilde sunucularımıza kaydedilmemekte veya üçüncü şahıslarla paylaşılmamaktadır. 
              Devam ederek kamera kullanımına açık rıza göstermiş olursunuz.
            </p>
            <div className="flex justify-end space-x-4">
              <button onClick={() => setShowKVKK(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium">İptal</button>
              <button onClick={handleKVKKApprove} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow transition">
                Okudum, Onaylıyorum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}