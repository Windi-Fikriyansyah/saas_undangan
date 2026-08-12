import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import AdminClientLayout from "./AdminClientLayout";
import React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user as any;
  if (!user.isAdmin) {
    redirect("/dashboard");
  }

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
