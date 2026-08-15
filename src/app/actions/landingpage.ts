"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function saveLandingPage(data: { name: string; slug: string; blocks: any[] }) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }

  const vendorId = (session!.user as any).id;

  if (!data.name || !data.slug) {
    throw new Error("Nama halaman dan URL slug wajib diisi");
  }

  // Check if slug is unique for this vendor
  const existing = await prisma.landingPage.findFirst({
    where: {
      vendorId,
      slug: data.slug,
    }
  });

  if (existing) {
    // If it exists, update it
    await prisma.landingPage.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        content: data.blocks as any,
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
        isActive: true,
      }
    });
  }

  revalidatePath("/dashboard/landingpages");
  return { success: true };
}
