"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Optician } from "@prisma/client";

interface OpticiansMapProps {
  opticians: Optician[];
}

export default function OpticiansMap({ opticians }: OpticiansMapProps) {
  // Haritanın merkezini, mağazaların ortalamasına göre ayarla
  // Mağaza yoksa varsayılan olarak Ankara'yı merkez al.
  const center: [number, number] =
    opticians.length > 0
      ? [
          opticians.reduce((acc, opt) => acc + opt.latitude, 0) / opticians.length,
          opticians.reduce((acc, opt) => acc + opt.longitude, 0) / opticians.length,
        ]
      : [39.925533, 32.866287]; // Ankara

  return (
    <MapContainer
      center={center}
      zoom={opticians.length > 0 ? 6 : 5}
      scrollWheelZoom={true}
      className="h-[500px] w-full rounded-[2.5rem] shadow-lg border border-gray-200 z-10"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {opticians.map((optician) => (
        <Marker key={optician.id} position={[optician.latitude, optician.longitude]}>
          <Popup>{optician.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}