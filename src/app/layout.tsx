import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { auth } from "@/auth";
import BanChecker from "@/components/BanChecker";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="tr">
      <body>
        <SessionProvider session={session}>
          <BanChecker session={session} />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}