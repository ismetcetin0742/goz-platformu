import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        // 🛡️ Banlıysa veya kullanıcı yoksa direkt reddet
        if (!user || !user.password || user.isBanned) return null;

        const isValid = await bcrypt.compare(credentials.password as string, user.password);
        if (!isValid) return null;

        // İSMİ BURADA DÖNDÜRÜYORUZ (Önemli!)
        return { 
          id: user.id.toString(), 
          email: user.email, 
          name: user.name, 
          role: user.role 
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Sadece ilk girişte user dolu gelir, o an her şeyi token'a mühürle
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.name = user.name; // İsmi token'a yazdık
      }
      return token;
    },
    async session({ session, token }) {
      // Token'daki her şeyi session'a (arayüze) aktar
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        session.user.name = token.name as string; // İsmi arayüze bastık

        // Kullanıcının yasaklı olup olmadığını veritabanından kontrol et
        if (session.user.email) {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { isBanned: true }
          });

          if (!dbUser || dbUser.isBanned) {
            (session as any).error = "BannedUser";
          }
        }
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});