'use client';

import { useState, useEffect } from "react";
import { Optician } from "@prisma/client";
import dynamic from "next/dynamic";

// Leaflet haritasını ve CSS'lerini sadece istemci tarafında yüklüyoruz
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

// Haversine formülü ile iki nokta arasındaki mesafeyi hesaplayan fonksiyon
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Dünya'nın yarıçapı (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Mesafe (km)
}

export default function NearestOpticians() {
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [opticians, setOpticians] = useState<Optician[]>([]);
  const [nearest, setNearest] = useState<Optician | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Tüm gözlükçüleri API'den çek
    const fetchOpticians = async () => {
      try {
        const res = await fetch('/api/opticians');
        if (!res.ok) throw new Error("Mağazalar yüklenemedi.");
        const data: Optician[] = await res.json();
        setOpticians(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchOpticians();
  }, []);

  const handleFind = () => {
    setLoading(true);
    setError("");
    if (!navigator.geolocation) {
      setError("Tarayıcınız konum servisini desteklemiyor.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);

        if (opticians.length > 0) {
          // En yakın gözlükçüyü bul
          let closest: Optician | null = null;
          let minDistance = Infinity;

          opticians.forEach(opt => {
            const distance = getDistance(latitude, longitude, opt.latitude, opt.longitude);
            if (distance < minDistance) {
              minDistance = distance;
              closest = opt;
            }
          });
          setNearest(closest);
        }
        setLoading(false);
      },
      () => {
        setError("Konum bilgisi alınamadı. Lütfen tarayıcı izinlerinizi kontrol edin.");
        setLoading(false);
      }
    );
  };

  if (!userLocation) {
    return (
      <button onClick={handleFind} disabled={loading && !error} className="bg-[#005da4] text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-[#002f56] transition-all shadow-lg active:scale-95 disabled:bg-gray-400">
        {loading && !error ? 'Aranıyor...' : '📍 En Yakın Mağazayı Bul'}
      </button>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {nearest && (
        <div className="text-center mb-6 bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl shadow-sm">
          <h3 className="font-bold text-lg">En Yakın Mağaza: {nearest.name}</h3>
          <p className="text-sm">{nearest.address}</p>
        </div>
      )}
      <MapContainer center={userLocation} zoom={13} scrollWheelZoom={true} className="h-[400px] w-full rounded-2xl shadow-xl z-10">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {/* Kullanıcı Konumu İşaretçisi */}
        <Marker position={userLocation}>
          <Popup>Buradasınız</Popup>
        </Marker>
        {/* Gözlükçü İşaretçileri */}
        {opticians.map((optician) => (
          <Marker key={optician.id} position={[optician.latitude, optician.longitude]}>
            <Popup><b>{optician.name}</b><br/>{optician.address}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}