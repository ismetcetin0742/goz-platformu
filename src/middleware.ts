// src/middleware.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register";
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

  // 1. Admin sayfasına erişmeye çalışıyor ama ADMIN değilse
  if (isAdminPage && req.auth?.user?.role !== "ADMIN") {
    // Onu ana sayfaya veya yetkisiz erişim sayfasına fırlat
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 2. Giriş yapmış bir kullanıcı tekrar login/register'a gitmeye çalışırsa
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  // Bu kuralın hangi sayfalarda geçerli olacağını belirliyoruz
  matcher: ["/admin/:path*", "/login", "/register"],
};