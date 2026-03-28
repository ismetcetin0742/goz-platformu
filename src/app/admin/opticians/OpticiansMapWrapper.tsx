"use client";

import dynamic from "next/dynamic";
import { Optician } from "@prisma/client";

// Harita bileşenini sadece istemci tarafında yüklüyoruz (SSR kapalı)
const OpticiansMap = dynamic(() => import("./OpticiansMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] w-full rounded-[2.5rem] bg-gray-100 flex items-center justify-center"><p className="text-gray-400 font-bold">Harita yükleniyor...</p></div>,
});

export default function OpticiansMapWrapper({ opticians }: { opticians: Optician[] }) {
  return <OpticiansMap opticians={opticians} />;
}