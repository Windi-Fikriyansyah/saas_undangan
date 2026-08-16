"use server";

import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { TemplateTier } from "@/generated/prisma/client";

async function getVendor() {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id) {
    throw new Error("Unauthorized");
  }
  return (session.user as any).id;
}

export async function getVendorTemplateById(id: string) {
  const vendorId = await getVendor();
  const template = await prisma.template.findUnique({
    where: { id }
  });
  
  if (!template) return null;
  
  // Vendors can only edit their own templates
  if (template.vendorId !== vendorId) {
    throw new Error("Unauthorized to access this template");
  }
  
  return template;
}

export async function upsertVendorTemplate(data: {
  id: string;
  name: string;
  category: string;
  tier: string;
  isActive: boolean;
  thumbnailUrl: string;
  configJson: string;
}) {
  const vendorId = await getVendor();
  
  let parsedConfig = {};
  try {
    parsedConfig = JSON.parse(data.configJson);
  } catch (e) {
    throw new Error("Invalid config JSON");
  }

  const existing = await prisma.template.findUnique({ where: { id: data.id } });

  if (existing) {
    // Make sure vendor owns it
    if (existing.vendorId !== vendorId) {
      throw new Error("Anda tidak memiliki akses ke tema ini");
    }

    await prisma.template.update({
      where: { id: data.id },
      data: {
        name: data.name,
        category: data.category,
        tier: data.tier as TemplateTier,
        isActive: data.isActive,
        thumbnailUrl: data.thumbnailUrl,
        configJson: parsedConfig
      }
    });
  } else {
    await prisma.template.create({
      data: {
        id: data.id,
        vendorId: vendorId, // Assign to vendor
        name: data.name,
        category: data.category,
        tier: data.tier as TemplateTier,
        isActive: data.isActive,
        thumbnailUrl: data.thumbnailUrl,
        configJson: parsedConfig
      }
    });
  }

  return { success: true };
}
