import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import ClientLayout from "./ClientLayout";
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

  const vendorId = (session.user as any).id;
  const vendor = await prisma.vendor.findUnique({
    where: { id: vendorId },
    select: { isOnboarded: true }
  });

  if (vendor && !vendor.isOnboarded) {
    redirect("/onboarding");
  }
  return <ClientLayout>{children}</ClientLayout>;
}
