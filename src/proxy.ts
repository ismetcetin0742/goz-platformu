import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Modüler Rota Tanımları
const authRoutes = ["/login", "/register"]; // Sadece giriş yapmamış kişilerin görebileceği sayfalar
const protectedRoutes = ["/post-add"]; // Sadece giriş yapmış kullanıcıların görebileceği sayfalar
const adminRoutePrefix = "/admin"; // Yetkili kullanıcıların görebileceği sayfalar

// Turbopack'in isim beklentisini karşılamak için "proxy" değişkenine atıyoruz
const proxy = auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isAuthPage = authRoutes.includes(nextUrl.pathname);
  const isProtectedPage = protectedRoutes.includes(nextUrl.pathname);
  const isAdminPage = nextUrl.pathname.startsWith(adminRoutePrefix);

  // 1. Admin sayfasına erişmeye çalışıyor ama yetkisi (ADMIN veya EDITOR) yoksa
  if (isAdminPage && !["ADMIN", "EDITOR"].includes(userRole as string)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 2. Giriş yapmış bir kullanıcı tekrar login/register'a gitmeye çalışırsa
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 3. Giriş yapmamış bir kullanıcı korumalı bir sayfaya girmek isterse
  if (!isLoggedIn && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};