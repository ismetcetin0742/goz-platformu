"use client";

import dynamic from "next/dynamic";

// Harita bileşenini sadece istemcide çalışacak şekilde (SSR kapalı) burada dinamik olarak içe aktarıyoruz
const NearestOpticians = dynamic(() => import("./NearestOpticians"), {
  ssr: false,
});

export default function NearestOpticiansWrapper() {
  return <NearestOpticians />;
}