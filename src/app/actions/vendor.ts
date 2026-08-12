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
