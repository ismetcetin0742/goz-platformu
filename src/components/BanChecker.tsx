"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { Session } from "next-auth";

export default function BanChecker({ session }: { session: Session | null }) {
  useEffect(() => {
    // Eğer oturumdan 'BannedUser' hatası dönerse çerezleri sil ve sistemden at
    if ((session as any)?.error === "BannedUser") {
      signOut({ callbackUrl: "/?error=banned" });
    }
  }, [session]);

  return null; // Arayüzde hiçbir şey göstermez, sadece arka planda çalışır
}