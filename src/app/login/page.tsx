"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/admin",
        redirect: true,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı.");
      }
    } catch (err) {
      setError("Giriş yapılırken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Göz Platformu Giriş
          </h1>
          <p className="text-gray-600 mt-2 font-medium">
            Lütfen kullanıcı bilgilerinizi girin
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-center font-bold border border-red-100 animate-shake">
            {error}
          </div>
        )}

        {/* GOOGLE BUTONU ALTYAPISI HAZIR AMA GİZLİ (false && kısmı ile) */}
        {false && (
          <>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/admin" })}
              className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 border border-gray-300 p-4 rounded-2xl font-bold hover:bg-gray-50 transition shadow-sm mb-6"
            >
              <img 
                src="https://authjs.dev/img/providers/google.svg" 
                alt="Google" 
                className="w-6 h-6" 
              />
              Google ile giriş yapın
            </button>

            <div className="relative flex items-center py-4 mb-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">veya e-posta ile</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              E-posta Adresi
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="username email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 text-lg font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-400"
              placeholder="admin@gozplatformu.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-300 rounded-2xl text-gray-900 text-lg font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-600 focus:bg-white outline-none transition-all placeholder:text-gray-400"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 active:scale-[0.98] transition-all text-lg disabled:bg-blue-400"
            >
              {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </button>
            
            <Link
              href="/"
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl text-center hover:bg-gray-200 active:scale-[0.98] transition-all text-lg border border-gray-200 flex items-center justify-center"
            >
              Geri Dön
            </Link>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 font-medium">
              Henüz hesabınız yok mu?{" "}
              <Link href="/register" className="text-blue-600 font-bold hover:underline">
                Üye Olun
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}