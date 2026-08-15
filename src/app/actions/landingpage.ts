"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveLandingPage(data: { id?: string; name: string; slug: string; blocks: any[]; isActive?: boolean }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session!.user as any).id;

  if (!data.name || !data.slug) {
    throw new Error("Nama halaman dan URL slug wajib diisi");
  }

  // Check if slug is taken by a DIFFERENT page
  const existingBySlug = await prisma.landingPage.findFirst({
    where: {
      vendorId,
      slug: data.slug,
      ...(data.id ? { id: { not: data.id } } : {}),
    }
  });

  if (existingBySlug) {
    throw new Error("URL / Slug sudah digunakan. Silakan pilih URL lain.");
  }

  if (data.id) {
    // If ID provided, verify ownership and update
    const existing = await prisma.landingPage.findUnique({ where: { id: data.id } });
    if (!existing || existing.vendorId !== vendorId) {
      throw new Error("Landing page tidak ditemukan atau bukan milik Anda");
    }

    await prisma.landingPage.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug: data.slug, // Can update slug now
        content: data.blocks as any,
        isActive: data.isActive !== undefined ? data.isActive : existing.isActive,
      }
    });
  } else {
    // Create new
    await prisma.landingPage.create({
      data: {
        vendorId,
        name: data.name,
        slug: data.slug,
        content: data.blocks as any,
        isActive: data.isActive !== undefined ? data.isActive : true,
      }
    });
  }

  revalidatePath("/dashboard/landingpages");
  return { success: true };
}
