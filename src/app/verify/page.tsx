"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyToken() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Doğrulanıyor...");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      // Burada bir API'ye istek atıp token'ı onaylayacağız
      // Şimdilik sadece başarılı diyelim
      setStatus("✅ Hesabınız onaylandı! Giriş yapabilirsiniz.");
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-10 font-bold text-2xl">
      {status}
    </div>
  );
}