import { auth } from "@/auth";
import AdminHeader from "./AdminHeader";
import { ReactNode } from "react";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  return (
    <>
      {session && <AdminHeader session={session} />}
      {children}
    </>
  );
}