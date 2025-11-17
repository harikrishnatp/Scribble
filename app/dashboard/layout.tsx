// app/dashboard/layout.tsx
import { Header } from "@/components/header"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
 

  return (
    <>
      <Header />
      {children}
    </>
  );
}
