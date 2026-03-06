"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "loading", text: "Hesabınız oluşturuluyor..." });

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // İŞTE BURASI KRİTİK: Admin'e değil, uyarı sayfasına gönderiyoruz
        window.location.href = "/verify-notice";
      } else {
        setMessage({ type: "error", text: data.error || "Bir hata oluştu." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Sunucu bağlantı hatası." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Ücretsiz Üye Ol</h1>
        <p className="text-gray-500 text-center mb-8">Göz sağlığı platformuna hoş geldiniz.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Ad Soyad"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="E-posta"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Şifre"
            required
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Kayıt Ol
          </button>
        </form>

        {message.text && (
          <p className={`mt-4 text-center font-bold ${message.type === "error" ? "text-red-500" : "text-blue-600"}`}>
            {message.text}
          </p>
        )}

        <p className="mt-8 text-center text-gray-500">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-blue-600 font-bold hover:underline">
            Giriş Yap
          </Link>
        </p>
      </div>
    </div>
  );
}