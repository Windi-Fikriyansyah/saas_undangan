"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string; waNumber: string }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session?.user as any).id;

  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: data.name,
        waNumber: data.waNumber,
      }
    });

    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update profile:", error);
    throw new Error("Gagal menyimpan profil");
  }
}

export async function completeOnboarding(data: {
  name: string;
  waNumber: string;
  subdomain: string;
  logoUrl?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session?.user as any).id;

  // Validate subdomain format (alphanumeric and dashes only, lowercase)
  const subdomainRegex = /^[a-z0-9-]+$/;
  if (!subdomainRegex.test(data.subdomain)) {
    throw new Error("Subdomain hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)");
  }

  // Check if subdomain is already taken by someone else
  const existingSubdomain = await prisma.vendor.findFirst({
    where: {
      subdomain: data.subdomain,
      id: { not: vendorId },
    },
  });

  if (existingSubdomain) {
    throw new Error("Subdomain ini sudah digunakan oleh vendor lain, silakan pilih yang lain");
  }

  try {
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: data.name,
        waNumber: data.waNumber,
        subdomain: data.subdomain,
        logoUrl: data.logoUrl || null,
        isOnboarded: true,
      }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to complete onboarding:", error);
    throw new Error("Gagal menyelesaikan onboarding");
  }
}
