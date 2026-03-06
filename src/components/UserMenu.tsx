"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UserMenu({ session }: { session: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-bold text-[#005da4] hover:text-[#00a3e0] transition-all py-1 px-2 rounded-md hover:bg-gray-50"
      >
        <span>👤 {session.user?.name || "Kullanıcı"}</span>
        <span className={`text-[10px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </button>

      {isOpen && (
        <>
          {/* Menü dışına tıklandığında kapanması için */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-2xl z-20 py-2 rounded-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-2 border-b border-gray-50 text-[10px] text-gray-400 uppercase tracking-widest font-black">
              Hesap Yönetimi
            </div>
            
            <Link
              href="/profile"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005da4] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Profil Bilgilerim
            </Link>

            <Link
              href="/my-posts"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#005da4] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Onaya Gönderdiklerim
            </Link>

            {session.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="block px-4 py-3 text-sm text-blue-600 font-bold hover:bg-blue-100 transition-colors border-t border-gray-50"
                onClick={() => setIsOpen(false)}
              >
                🛠️ Yönetim Paneli
              </Link>
            )}

            <div className="border-t border-gray-100 mt-2">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors"
              >
                Güvenli Çıkış 🚪
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}