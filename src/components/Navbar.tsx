"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-blue-700">
            Göz Platformu
          </span>
        </Link>
        
        <div className="flex md:order-2 space-x-3">
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                Panelim
              </Link>
              <button
                onClick={() => signOut()}
                className="text-white bg-red-600 hover:bg-red-700 font-medium rounded-lg text-sm px-4 py-2"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-4 py-2 transition"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}